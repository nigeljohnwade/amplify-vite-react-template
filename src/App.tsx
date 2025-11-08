import { useEffect, useState } from 'react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { useAuthenticator} from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

function App() {
    const [todos, setTodos] = useState<Array<Schema['Todo']['type']>>([]);
    const { user, signOut } = useAuthenticator();
    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    function createTodo() {
        client.models.Todo.create({content: window.prompt('Todo content')});
    }

    function deleteTodo(id: string) {
        client.models.Todo.delete({id});
    }

    return (
        <main>
            <h1>{user?.signInDetails?.loginId}'s todos <button onClick={signOut}>Sign out</button></h1>
            <button onClick={createTodo}>+ new</button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>{todo.content} <button onClick={() => deleteTodo(todo.id)}>Delete</button></li>
                ))}
            </ul>
        </main>
    );
}

export default App;
