import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    Outlet,
    useLocation
} from 'react-router';
import mapboxgl from 'mapbox-gl';

import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { Schema } from '../amplify/data/resource';
import { client } from 'amplify/client.ts';
import {
    DEFAULT_LIST_VIEW,
    INITIAL_CENTER,
    INITIAL_ZOOM
} from 'configuration/constants';
import type {
    Plan,
    PlanContext
} from 'contexts/planContext';
import Stack from 'components/atoms/Stack/Stack';
import { InteractionControl } from 'components/atoms/InteractionControl/InteractionControl';
import UiContext from 'contexts/UiContext.ts';
import Header from 'components/organisms/Header/Header';
import MapWrapper from 'components/atoms/MapWrapper/MapWrapper';

function App() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [planView, setPlanView] = useState<'list' | 'tile'>(DEFAULT_LIST_VIEW);
    const [categories, setCategories] = useState<Array<Schema['Category']['type']>>([]);
    const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const {pathname} = useLocation();
    const isCreating = pathname === '/create';

    useEffect(() => {
        const planSubscription = client.models.Plan.observeQuery({
            selectionSet: [
                'category.*',
                'categoryId',
                'content',
                'date',
                'id',
                'isDone',
                'location.*',
                'place',
                'priority',
                'status',
                'time',
                'title',
            ]
        }).subscribe({
            next: (data) => setPlans([...data.items as Plan[]]),
        });
        const categorySubscription = client.models.Category.observeQuery().subscribe({
            next: (data) => setCategories([...data.items]),
        });
        return () => {
            planSubscription.unsubscribe();
            categorySubscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            center: [INITIAL_CENTER[0], INITIAL_CENTER[1]],
            zoom: INITIAL_ZOOM,
            style: 'mapbox://styles/nigeljohnwade/ck6t9mbdx2osp1in0fnb3xd1c',
        });
        mapRef.current = map;
        map.on('move', () => {
            const mapCenter = map.getCenter();
            setCenter([mapCenter.lng, mapCenter.lat]);
        });
        // create a marker at the initial coordinate
        new mapboxgl.Marker({
            color: 'blue',
            scale: 1.5,
        })
            .setLngLat(INITIAL_CENTER)
            .addTo(map);

        return () => {
            map.remove();
        };
    }, []);

    useEffect(() => {
        plans.forEach(plan => {
            if (plan.location !== null && plan.location !== undefined) {
                // create a marker for each location
                new mapboxgl.Marker({
                    color: 'green',
                })
                    .setLngLat([Number(plan.location.long), Number(plan.location.lat)])
                    .addTo(mapRef.current!);
            }
        });
    }, [plans]);

    const flyTo = useCallback((coords: [number, number], zoom?: number) => {
        mapRef.current?.flyTo(zoom !== undefined ? {center: coords, zoom} : {center: coords});
    }, []);

    const context: PlanContext = {plans, categories, center, flyTo};

    return (
        <UiContext.Provider
            value={{
                planView: planView,
                setPlanView: setPlanView,
            }}
        >
            <Stack spacing="containers">
                <Header/>
                <main className="main">
                    <Stack spacing="components">
                        <Outlet context={context}/>
                        <MapWrapper>
                            <div
                                id="map-container"
                                ref={mapContainerRef}
                            />
                            {
                                isCreating &&
                                <div className="map-center"></div>
                            }
                            <InteractionControl
                                onClick={() => flyTo(INITIAL_CENTER, INITIAL_ZOOM)}
                            >
                                Center map
                            </InteractionControl>
                        </MapWrapper>
                    </Stack>
                </main>
            </Stack>
        </UiContext.Provider>
    );
}

export default App;