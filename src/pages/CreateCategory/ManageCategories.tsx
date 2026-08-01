import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { client } from '../../amplify/client.ts';
import type { Schema } from '../../../amplify/data/resource.ts';
import InputGroup from 'components/atoms/InputGroup/InputGroup.tsx';

const ManageCategories = () => {
    const [categories, setCategories] = useState<Array<Schema['Category']['type']>>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const categorySubscription = client.models.Category.observeQuery().subscribe({
            next: (data) => setCategories([...data.items]),
        });
        return () => {
            categorySubscription.unsubscribe();
        };
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const displayName = formData.get('displayName') as string;
        client.models.Category.create({displayName: displayName}).then(() => navigate('/'));
    };

    return (
        <div>
            <h2>Create a category</h2>
            <form onSubmit={handleSubmit}>
                <InputGroup>
                    <label htmlFor="displayName">Display name</label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                    />
                </InputGroup>
            </form>
            <h2>Categories</h2>
            <ul>
                {
                    categories.map(category => (
                        <li>{category.displayName}</li>
                    ))
                }
            </ul>
        </div>
    );
};

export default ManageCategories;