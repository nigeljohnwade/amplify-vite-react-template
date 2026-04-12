import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

import './App.css';

import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import InputGroup from './components/atoms/InputGroup/InputGroup.tsx';
import Stack from './components/atoms/Stack/Stack.tsx';

const client = generateClient<Schema>();

function App() {
    const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([]);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [updatingTodo, setUpdatingTodo] = useState<Schema['Todo']['type'] | null>(null);
    const {user, signOut} = useAuthenticator();
    const prioritiesEnum = client.enums.TodoPriority.values();
    const categories = [
        {id: 0, value: 'home', displayName: 'Home'},
        {id: 1, value: 'work', displayName: 'Work'},
    ];

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    useEffect(() => {
        console.log(updatingTodo);
    }, [updatingTodo]);

    function deleteTodo(id: string) {
        client.models.Todo.delete({id});
    }

    function updateTodoSubmitHandler(event: any) {
        event.preventDefault();
        const formData: FormData = new FormData(event.target);
        const newContent = formData.get('content') as string;
        const newTitle = formData.get('title') as string;
        const newCategory = formData.get('category') as string;
        const newPriority = formData.get('priority') as any;
        if (isUpdating) {
            client.models.Todo.update({
                id: isUpdating,
                content: newContent,
                title: newTitle,
                category: newCategory,
                priority: newPriority,
            });
        }
        setIsUpdating(null);
    }

    function createTodoSubmitHandler(event: any) {
        event.preventDefault();
        const formData: FormData = new FormData(event.target);
        const newContent = formData.get('content') as string;
        const newTitle = formData.get('title') as string;
        const newCategory = formData.get('category') as string;
        const newPriority = formData.get('priority') as any;
        client.models.Todo.create({
            content: newContent,
            title: newTitle,
            category: newCategory,
            priority: newPriority,
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
                        <ul className="todos-list">
                            {todos.map((todo) => (
                                <li key={todo.id}>
                                    <p className="todo.title">{todo.title ? todo.title : todo.content ? todo.content.substring(0, 25) : ''}</p>
                                    <p className="todo-category">{categories.find(category => category.value === todo.category)?.displayName}</p>
                                    <p className="todo-priority">{todo.priority}</p>
                                    <div className="button-row">
                                        <button
                                            onClick={() => {
                                                setIsUpdating(todo.id);
                                                setUpdatingTodo(todo);
                                                setIsCreating(false);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </>
                <>
                    {
                        isUpdating &&
                        <form onSubmit={(event) => updateTodoSubmitHandler(event)}>
                            <Stack spacing="small">
                                <h2>Update plan {updatingTodo?.title || 'no title'}</h2>
                                <InputGroup>
                                    <label htmlFor="update-title">Title</label>
                                    <input
                                        defaultValue={updatingTodo?.title || ''}
                                        id="update-title"
                                        name="title"
                                        type="text"
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <label htmlFor="update-content">Content</label>
                                    <input
                                        defaultValue={updatingTodo?.content || ''}
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
                                        <label htmlFor="create-priority">Priority</label>
                                        <select
                                            id="create-priority"
                                            name="priority"
                                            defaultValue={updatingTodo?.priority || ''}
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
                                        defaultValue={updatingTodo?.content || ''}
                                        id="update-place"
                                        name="place"
                                        type="text"
                                    />
                                </InputGroup>
                                <div className="button-row">
                                    <button>Submit</button>
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
                        <form onSubmit={(event) => createTodoSubmitHandler(event)}>
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
                                </Stack>
                                <div className="button-row">
                                    <button>Submit</button>
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
