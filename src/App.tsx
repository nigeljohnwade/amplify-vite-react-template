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
    const {user, signOut} = useAuthenticator();

    const categories = [
        {id: 0, value: 'home', displayName: 'Home'},
        {id: 1, value: 'work', displayName: 'Work'},
    ];

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    function deleteTodo(id: string) {
        client.models.Todo.delete({id});
    }

    function updateTodoSubmitHandler(e: any) {
        e.preventDefault();
        const formData: FormData = new FormData(e.target);
        const newContent = formData.get('content') as string;
        const newTitle = formData.get('title') as string;
        const newCategory = formData.get('category') as string;
        if (isUpdating) {
            client.models.Todo.update({
                id: isUpdating,
                content: newContent,
                title: newTitle,
                category: newCategory,
            });
        }
        setIsUpdating(null);
    }

    function createTodoSubmitHandler(e: any) {
        e.preventDefault();
        const formData: FormData = new FormData(e.target);
        const newContent = formData.get('content') as string;
        const newTitle = formData.get('title') as string;
        const newCategory = formData.get('category') as string;
        client.models.Todo.create({
            content: newContent,
            title: newTitle,
            category: newCategory,
        });
        setIsCreating(false);
    }

    return (
        <main className="main">
            <h1>{user?.signInDetails?.loginId}'s todos <button onClick={signOut}>Sign out</button></h1>
            <button onClick={() => setIsCreating(true)}>+ Add</button>
            {
                !isCreating && isUpdating === null &&
                <ul className="todos-list">
                    {todos.map((todo) => (
                        <li key={todo.id}>
                            <p className="todo.title">{todo.title ? todo.title : todo.content ? todo.content.substring(0, 25) : ''}</p>
                            <p className="todo-category">{todo.category}</p>
                            <div className="button-row">
                                <button onClick={() => setIsUpdating(todo.id)}>Edit</button>
                                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            }
            {
                isUpdating &&
                <form onSubmit={(e) => updateTodoSubmitHandler(e)}>
                    <Stack>

                        <p>Update {todos.find(todo => todo.id === isUpdating)?.title || 'no title'}</p>
                        <InputGroup>
                            <label htmlFor="update-title">Title</label>
                            <input
                                defaultValue={todos.find(todo => todo.id === isUpdating)?.title || ''}
                                id="update-title"
                                name="title"
                                type="text"
                            />
                        </InputGroup>
                        <InputGroup>
                            <label htmlFor="update-content">Content</label>
                            <input
                                defaultValue={todos.find(todo => todo.id === isUpdating)?.content || ''}
                                id="update-content"
                                name="content"
                                type="text"
                            />
                        </InputGroup>
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
                            <label htmlFor="update-place">Place</label>
                            <input
                                defaultValue={todos.find(todo => todo.id === isUpdating)?.content || ''}
                                id="update-place"
                                name="place"
                                type="text"
                            />
                        </InputGroup>
                        <button>Submit</button>
                    </Stack>
                </form>
            }
            {
                isCreating &&
                <form onSubmit={(e) => createTodoSubmitHandler(e)}>
                    <Stack>

                        <p>Update {todos.find(todo => todo.id === isUpdating)?.title || 'no title'}</p>
                        <InputGroup>
                            <label htmlFor="create-title">Title</label>
                            <input
                                defaultValue={todos.find(todo => todo.id === isUpdating)?.title || ''}
                                id="update-title"
                                name="title"
                                type="text"
                            />
                        </InputGroup>
                        <InputGroup>
                            <label htmlFor="create-content">Content</label>
                            <input
                                defaultValue={todos.find(todo => todo.id === isUpdating)?.content || ''}
                                id="create-content"
                                name="content"
                                type="text"
                            />
                        </InputGroup>
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
                            <label htmlFor="create-place">Place</label>
                            <input
                                defaultValue={todos.find(todo => todo.id === isUpdating)?.place || ''}
                                id="update-place"
                                name="place"
                                type="text"
                            />
                        </InputGroup>
                        <button>Submit</button>
                    </Stack>
                </form>
            }
        </main>
    );
}

export default App;
