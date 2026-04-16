import { useEffect, useRef, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import mapboxgl from 'mapbox-gl';

import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import outputs from '../amplify_outputs.json';
import type { Schema } from '../amplify/data/resource';
import InputGroup from './components/atoms/InputGroup/InputGroup.tsx';
import Stack from './components/atoms/Stack/Stack.tsx';

Amplify.configure(outputs);
const client = generateClient<Schema>();

const INITIAL_CENTER: [number, number] = [-3.18393, 55.96118];
const INITIAL_ZOOM = 15;

function App() {
    const [plans, setPlans] = useState<Array<Schema['Plan']['type']>>([]);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
    const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
    const [updatingPlan, setUpdatingPlan] = useState<Schema['Plan']['type'] | null>(null);
    const mapRef = useRef<any>(null);
    const mapContainerRef = useRef<any>(null);
    const {user, signOut} = useAuthenticator();
    const prioritiesEnum = client.enums.PlanPriority.values();
    const categories = [
        {id: 0, value: 'home', displayName: 'Home'},
        {id: 1, value: 'work', displayName: 'Work'},
    ];

    useEffect(() => {
        client.models.Plan.observeQuery().subscribe({
            next: (data) => setPlans([...data.items]),
        });
    }, []);

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [center[0], center[1]],
            zoom: zoom,
            style: 'mapbox://styles/nigeljohnwade/ck6t9mbdx2osp1in0fnb3xd1c',
        });
        mapRef.current.on('move', () => {
            // get the current center coordinates and zoom level from the map
            const mapCenter = mapRef.current.getCenter();
            const mapZoom = mapRef.current.getZoom();

            // update state
            setCenter([mapCenter.lng, mapCenter.lat]);
            setZoom(mapZoom);
        });
        // create a marker at a coordinate
        new mapboxgl.Marker({
            color: 'blue',
            scale: 1.5,
        })
            .setLngLat(INITIAL_CENTER)
            .addTo(mapRef.current);

        return () => {
            mapRef.current.remove();
        };
    }, []);

    useEffect(() => {
        if (isUpdating && updatingPlan && updatingPlan.location) {
            setCenter([updatingPlan.location.long || INITIAL_CENTER[0], updatingPlan.location.lat || INITIAL_CENTER[1]]);
            mapRef.current.flyTo({
                center: [updatingPlan.location.long, updatingPlan.location.lat],
                zoom: zoom
            });
        } else if (!isUpdating) {
            mapRef.current.flyTo({
                center: INITIAL_CENTER,
                zoom: zoom
            });
        }
    }, [isUpdating]);

    useEffect(() => {
        if (!isCreating) {
            mapRef.current.flyTo({
                center: INITIAL_CENTER,
                zoom: zoom
            });
        }
    }, [isCreating]);

    useEffect(() => {
        plans.forEach(plan => {
            if (plan.location !== null && plan.location !== undefined) {
                // create a marker for each location
                new mapboxgl.Marker({
                    color: 'green',
                })
                    .setLngLat([Number(plan.location.long), Number(plan.location.lat)])
                    .addTo(mapRef.current);
            }
        });
    }, [plans]);

    function deletePlan(id: string) {
        client.models.Plan.delete({id});
    }

    function extractFields(event: any) {
        const formData: FormData = new FormData(event.target);
        const newContent = formData.get('content') as string;
        const newTitle = formData.get('title') as string;
        const newCategory = formData.get('category') as string;
        const newPriority = formData.get('priority') as any;
        const newPlace = formData.get('place') as any;
        const newTime = formData.get('time') as any;
        const newDate = formData.get('date') as any;
        const saveLocation = formData.get('location-checkbox') === 'true' ? true : false;
        return {newContent, newTitle, newCategory, newPriority, newPlace, newTime, newDate, saveLocation};
    }

    function updatePlanSubmitHandler(event: any) {
        event.preventDefault();
        const {
            newContent,
            newTitle,
            newCategory,
            newPriority,
            newPlace,
            newTime,
            newDate,
            saveLocation
        } = extractFields(event);
        if (isUpdating) {
            client.models.Plan.update({
                id: isUpdating,
                content: newContent !== '' ? newContent : '',
                title: newTitle,
                category: newCategory !== '' ? newCategory : null,
                priority: newPriority !== '' ? newPriority : null,
                place: newPlace !== '' ? newPlace : null,
                time: newTime !== '' ? newTime : null,
                date: newDate !== '' ? newDate : null,
                location: saveLocation ? {
                    lat: center[1],
                    long: center[0],
                } : null,
            });
        }
        setIsUpdating(null);
    }

    function createPlanSubmitHandler(event: any) {
        event.preventDefault();
        const {
            newContent,
            newTitle,
            newCategory,
            newPriority,
            newPlace,
            newTime,
            newDate,
            saveLocation
        } = extractFields(event);
        client.models.Plan.create({
            content: newContent !== '' ? newContent : '',
            title: newTitle,
            category: newCategory !== '' ? newCategory : null,
            priority: newPriority !== '' ? newPriority : null,
            place: newPlace !== '' ? newPlace : null,
            time: newTime !== '' ? newTime : null,
            date: newDate !== '' ? newDate : null,
            location: saveLocation ? {
                lat: center[1],
                long: center[0],
            } : null,
        });
        setIsCreating(false);
    }

    const handleInitialize = () => {
        mapRef.current.flyTo({
            center: INITIAL_CENTER,
            zoom: INITIAL_ZOOM
        });
    };

    const sortByCategory = (a: Schema['Plan']['type'], b: Schema['Plan']['type']) => {
        if (a.category && b.category) {
            const _a = categories.find(category => category.value === a.category)!.id;
            const _b = categories.find(category => category.value === b.category)!.id;
            return _a > _b ? 1 : -1;
        } else if (a.category && !b.category) {
            return -1;
        } else if (!a.category && b.category) {
            return 1;
        } else {
            return 0;
        }
    };
    return (
        <main className="main">
            <Stack spacing="large">
                <h1>{user?.signInDetails?.loginId}'s plans <button onClick={signOut}>Sign out</button></h1>
                <>
                    {
                        !isCreating && isUpdating === null &&
                        <>
                            <button
                                onClick={() => {
                                    setIsCreating(true);
                                    setIsUpdating(null);
                                }}
                            >
                                Make a new plan
                            </button>
                            <ul className="plan-list">
                                {
                                    plans
                                        // .sort((a, b) => a.category === 'work' && b.category === 'home' ? -1 : 1)
                                        .sort(sortByCategory)
                                        .map((plan) => (
                                            <li key={plan.id}>
                                                <p className="todo-title">{plan.title ? plan.title : plan.content ? plan.content.substring(0, 35) : ''}</p>
                                                <p className="todo-category">{categories.find(category => category.value === plan.category)?.displayName}</p>
                                                <p className="todo-priority">{plan.priority}</p>
                                                <p>{plan.date} {plan.time}</p>
                                                <div className="button-row">
                                                    <button
                                                        onClick={() => {
                                                            setIsUpdating(plan.id);
                                                            setUpdatingPlan(plan);
                                                            setIsCreating(false);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button onClick={() => deletePlan(plan.id)}>Delete</button>
                                                </div>
                                            </li>
                                        ))}
                            </ul>
                        </>
                    }
                </>
                <>
                    {
                        isUpdating &&
                        <form onSubmit={(event) => updatePlanSubmitHandler(event)}>
                            <Stack spacing="medium">
                                <h2>Update plan {updatingPlan?.title || 'no title'}</h2>
                                <Stack spacing="small">
                                    <InputGroup>
                                        <label htmlFor="update-title">Title</label>
                                        <input
                                            defaultValue={updatingPlan?.title || ''}
                                            id="update-title"
                                            name="title"
                                            type="text"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="update-content">Content</label>
                                        <textarea
                                            defaultValue={updatingPlan?.content || ''}
                                            id="update-content"
                                            name="content"
                                        />
                                    </InputGroup>
                                    <div className="form-row">
                                        <InputGroup>
                                            <label htmlFor="update-category">Category</label>
                                            <select
                                                id="update-category"
                                                name="category"
                                                defaultValue={updatingPlan?.category || ''}
                                            >
                                                <option value={''}>None</option>
                                                {
                                                    categories.map(category => (
                                                        <option
                                                            key={category.id}
                                                            value={category.value}
                                                        >
                                                            {category.displayName}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </InputGroup>
                                        <InputGroup>
                                            <label htmlFor="update-priority">Priority</label>
                                            <select
                                                id="update-priority"
                                                name="priority"
                                                defaultValue={updatingPlan?.priority || ''}
                                            >
                                                <option value={''}>None</option>
                                                {
                                                    prioritiesEnum.map(priority => (
                                                        <option
                                                            key={priority}
                                                            value={priority}
                                                        >
                                                            {priority}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </InputGroup>
                                    </div>
                                    <InputGroup>
                                        <label htmlFor="update-place">Place</label>
                                        <input
                                            defaultValue={updatingPlan?.place || ''}
                                            id="update-place"
                                            name="place"
                                            type="text"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="update-date">Date</label>
                                        <input
                                            defaultValue={updatingPlan?.date || ''}
                                            id="update-date"
                                            name="date"
                                            type="date"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="update-time">Time</label>
                                        <input
                                            defaultValue={updatingPlan?.time || ''}
                                            id="update-time"
                                            name="time"
                                            type="time"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="update-longitude">Longitude</label>
                                        <input
                                            value={updatingPlan?.location?.long || center[0]}
                                            id="update-longitude"
                                            name="longitude"
                                            type="number"
                                            readOnly={true}
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="update-latitude">Latitude</label>
                                        <input
                                            value={updatingPlan?.location?.lat || center[1]}
                                            id="update-latitude"
                                            name="latitude"
                                            type="number"
                                            readOnly={true}
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="create-location-checkbox">Save location</label>
                                        <input
                                            type="checkbox"
                                            id="create-location-checkbox"
                                            name="location-checkbox"
                                            value="true"
                                            checked={updatingPlan?.location !== null}
                                        />
                                    </InputGroup>
                                </Stack>
                                <div className="button-row">
                                    <button>Update</button>
                                    <button
                                        type="button"
                                        onClick={() => setIsUpdating(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Stack>
                        </form>
                    }
                </>
                <>
                    {
                        isCreating &&
                        <form onSubmit={(event) => createPlanSubmitHandler(event)}>
                            <Stack spacing="medium">
                                <h2>Create new plan</h2>
                                <Stack spacing="small">
                                    <InputGroup>
                                        <label htmlFor="create-title">Title</label>
                                        <input
                                            defaultValue={''}
                                            id="create-title"
                                            name="title"
                                            type="text"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="create-content">Content</label>
                                        <textarea
                                            defaultValue={''}
                                            id="create-content"
                                            name="content"
                                        />
                                    </InputGroup>
                                    <div className="form-row">
                                        <InputGroup>
                                            <label htmlFor="create-category">Category</label>
                                            <select
                                                id="create-category"
                                                name="category"
                                            >
                                                <option value={''}>None</option>
                                                {
                                                    categories.map(category => (
                                                        <option
                                                            key={category.id}
                                                            value={category.value}
                                                        >
                                                            {category.displayName}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </InputGroup>
                                        <InputGroup>
                                            <label htmlFor="create-priority">Priority</label>
                                            <select
                                                id="create-priority"
                                                name="priority"
                                                defaultValue={''}
                                            >
                                                <option value={''}>None</option>
                                                {
                                                    prioritiesEnum.map(priority => (
                                                        <option
                                                            key={priority}
                                                            value={priority}
                                                        >
                                                            {priority}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </InputGroup>
                                    </div>
                                    <InputGroup>
                                        <label htmlFor="create-place">Place</label>
                                        <input
                                            defaultValue={''}
                                            id="update-place"
                                            name="place"
                                            type="text"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="create-date">Date</label>
                                        <input
                                            defaultValue={updatingPlan?.date || ''}
                                            id="create-date"
                                            name="date"
                                            type="date"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="create-time">Time</label>
                                        <input
                                            defaultValue={updatingPlan?.time || ''}
                                            id="create-time"
                                            name="time"
                                            type="time"
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="create-longitude">Longitude</label>
                                        <input
                                            value={center[0]}
                                            id="create-longitude"
                                            name="longitude"
                                            type="number"
                                            readOnly={true}
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="create-latitude">Latitude</label>
                                        <input
                                            value={center[1]}
                                            id="create-latitude"
                                            name="latitude"
                                            type="number"
                                            readOnly={true}
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="create-location-checkbox">Save location</label>
                                        <input
                                            type="checkbox"
                                            id="create-location-checkbox"
                                            name="location-checkbox"
                                            value="true"
                                            defaultChecked={false}
                                        />
                                    </InputGroup>
                                </Stack>
                                <div className="button-row">
                                    <button>Create</button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Stack>
                        </form>
                    }
                </>
                <div className="map-wrapper">
                    <div
                        id="map-container"
                        ref={mapContainerRef}
                    />
                    {
                        isCreating &&
                        <div className="map-center"></div>
                    }
                    <button onClick={handleInitialize}>Center map</button>
                </div>
            </Stack>
        </main>
    );
}

export default App;
