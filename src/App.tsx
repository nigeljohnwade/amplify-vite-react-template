import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

import './App.css';

import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import InputGroup from './components/atoms/InputGroup/InputGroup.tsx';
import Stack from './components/atoms/Stack/Stack.tsx';

const client = generateClient<Schema>();

function App() {
    const [plans, setPlans] = useState<Array<Schema['Plan']['type']>>([]);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [updatingPlan, setUpdatingPlan] = useState<Schema['Plan']['type'] | null>(null);
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
        console.log(updatingPlan);
    }, [updatingPlan]);

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
                content: newContent,
                title: newTitle,
                category: newCategory,
                priority: newPriority,
                place: newPlace,
                time: newTime,
                date: newDate,
            });
        }
        setIsUpdating(null);
    }

    function createPlanSubmitHandler(event: any) {
        event.preventDefault();
        const {newContent, newTitle, newCategory, newPriority, newPlace, newTime, newDate} = extractFields(event);
        client.models.Plan.create({
            content: newContent,
            title: newTitle,
            category: newCategory,
            priority: newPriority,
            place: newPlace,
            time: newTime,
            date: newDate,
        });
        setIsCreating(false);
    }

    return (
        <main className="main">
            <Stack spacing="large">
                <h1>{user?.signInDetails?.loginId}'s plans <button onClick={signOut}>Sign out</button></h1>
                <button
                    onClick={() => {
                        setIsCreating(true);
                        setIsUpdating(null);
                    }}
                >
                    Make a new plan
                </button>
                <>
                    {
                        !isCreating && isUpdating === null &&
                        <ul className="plan-list">
                            {plans.map((plan) => (
                                <li key={plan.id}>
                                    <p className="todo-title">{plan.title ? plan.title : plan.content ? plan.content.substring(0, 25) : ''}</p>
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
                                        <input
                                            defaultValue={updatingPlan?.content || ''}
                                            id="update-content"
                                            name="content"
                                            type="text"
                                        />
                                    </InputGroup>
                                    <div className="form-row">
                                        <InputGroup>
                                            <label htmlFor="update-category">Category</label>
                                            <select
                                                id="update-category"
                                                name="category"
                                            >
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
                                        <input
                                            defaultValue={''}
                                            id="create-content"
                                            name="content"
                                            type="text"
                                        />
                                    </InputGroup>
                                    <div className="form-row">
                                        <InputGroup>
                                            <label htmlFor="create-category">Category</label>
                                            <select
                                                id="create-category"
                                                name="category"
                                            >
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
                                            >
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
