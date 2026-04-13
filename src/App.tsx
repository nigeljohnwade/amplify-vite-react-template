import { useEffect, useRef, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import mapboxgl from 'mapbox-gl';

import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import InputGroup from './components/atoms/InputGroup/InputGroup.tsx';
import Stack from './components/atoms/Stack/Stack.tsx';

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
        mapboxgl.accessToken = 'pk.eyJ1IjoibmlnZWxqb2hud2FkZSIsImEiOiJjazZldzF4azEwaTNrM2txcGl5cHl4b2NmIn0.zakMLSZFY8JDePqgWedLXg';

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [center[0], center[1]],
            zoom: zoom,
            style: 'mapbox://styles/nigeljohnwade/ck6t9mbdx2osp1in0fnb3xd1c'
        });
        mapRef.current.on('move', () => {
            // get the current center coordinates and zoom level from the map
            const mapCenter = mapRef.current.getCenter();
            const mapZoom = mapRef.current.getZoom();

            // update state
            setCenter([mapCenter.lng, mapCenter.lat]);
            setZoom(mapZoom);
            console.log(mapRef.current.getCenter());
            console.log(mapRef.current.getZoom());
        });
        return () => {
            mapRef.current.remove();
        };
    }, []);

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
        return {newContent, newTitle, newCategory, newPriority, newPlace, newTime, newDate};
    }

    function updatePlanSubmitHandler(event: any) {
        event.preventDefault();
        const {newContent, newTitle, newCategory, newPriority, newPlace, newTime, newDate} = extractFields(event);
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
            });
        }
        setIsUpdating(null);
    }

    function createPlanSubmitHandler(event: any) {
        event.preventDefault();
        const {newContent, newTitle, newCategory, newPriority, newPlace, newTime, newDate} = extractFields(event);
        client.models.Plan.create({
            content: newContent !== '' ? newContent : '',
            title: newTitle,
            category: newCategory !== '' ? newCategory : null,
            priority: newPriority !== '' ? newPriority : null,
            place: newPlace !== '' ? newPlace : null,
            time: newTime !== '' ? newTime : null,
            date: newDate !== '' ? newDate : null,
        });
        setIsCreating(false);
    }

    const handleInitialize = () => {
        mapRef.current.flyTo({
            center: INITIAL_CENTER,
            zoom: INITIAL_ZOOM
        });
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
                                        .sort((a, b) => a.category === 'work' && b.category === 'home' ? -1 : 1)
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
                            <button onClick={handleInitialize}>Center map</button>
                            <div
                                id="map-container"
                                ref={mapContainerRef}
                            />
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
            </Stack>
        </main>
    );
}

export default App;
