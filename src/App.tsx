import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Outlet, useLocation } from 'react-router';
import mapboxgl from 'mapbox-gl';

import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { Schema } from '../amplify/data/resource';
import { client } from './client';
import { INITIAL_CENTER, INITIAL_ZOOM } from './constants';
import type { PlanContext } from './context';
import Stack from './components/atoms/Stack/Stack';
import { InteractionControl } from './components/atoms/InteractionControl/InteractionControl.tsx';

function App() {
    const [plans, setPlans] = useState<Array<Schema['Plan']['type']>>([]);
    const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const {user, signOut} = useAuthenticator();
    const {pathname} = useLocation();
    const isCreating = pathname === '/create';

    useEffect(() => {
        const subscription = client.models.Plan.observeQuery().subscribe({
            next: (data) => setPlans([...data.items]),
        });
        return () => subscription.unsubscribe();
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

    const context: PlanContext = {plans, center, flyTo};

    return (
        <Stack spacing="containers">
            <header className="header">
                <h1>
                    {user?.signInDetails?.loginId}'s plans
                </h1>
                <InteractionControl
                    onClick={signOut}
                >
                    Sign out
                </InteractionControl>
            </header>
            <main className="main">
                <Stack spacing="components">
                    <Outlet context={context}/>
                    <div className="map-wrapper">
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
                    </div>
                </Stack>
            </main>
        </Stack>
    );
}

export default App;
