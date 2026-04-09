import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

import './App.css';

import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

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

    function updateTodo(id: string) {
        setIsUpdating(id);
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
        <main>
            <h1>{user?.signInDetails?.loginId}'s todos <button onClick={signOut}>Sign out</button></h1>
            <button onClick={() => setIsCreating(true)}>+ Add</button>
            {
                !isCreating && isUpdating === null &&
                <ul>
                    {todos.map((todo) => (
                        <li key={todo.id}>
                            <p>{todo.title ? todo.title : todo.content ? todo.content.substring(0, 25) : ''}</p>
                            <button onClick={() => updateTodo(todo.id)}>Edit</button>
                            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            }
            {
                isUpdating &&
                <form onSubmit={(e) => updateTodoSubmitHandler(e)}>
                    <p>Update {todos.find(todo => todo.id === isUpdating)?.title || 'no title'}</p>
                    <input
                        type="text"
                        name="title"
                        defaultValue={todos.find(todo => todo.id === isUpdating)?.title || ''}
                    />
                    <input
                        type="text"
                        name="content"
                        defaultValue={todos.find(todo => todo.id === isUpdating)?.content || ''}
                    />
                    <select name="category">
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
                    <button>Submit</button>
                </form>
            }
            {
                isCreating &&
                <form onSubmit={(e) => createTodoSubmitHandler(e)}>
                    <p>Update {todos.find(todo => todo.id === isUpdating)?.title || 'no title'}</p>
                    <input
                        type="text"
                        name="title"
                        defaultValue={''}
                    />
                    <input
                        type="text"
                        name="content"
                        defaultValue={''}
                    />
                    <select name="category">
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
                    <button>Submit</button>
                </form>
            }
        </main>
    );
}

export default App;
