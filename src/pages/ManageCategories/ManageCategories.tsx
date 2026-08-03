import { FormEvent, useEffect, useState } from 'react';

import './ManageCategories.css';

import { client } from '../../amplify/client.ts';
import type { Schema } from '../../../amplify/data/resource.ts';
import InputGroup from 'components/atoms/InputGroup/InputGroup';
import { InteractionControl } from '../../components/atoms/InteractionControl/InteractionControl';
import Stack from '../../components/atoms/Stack/Stack';

const ManageCategories = () => {
    const [categories, setCategories] = useState<Array<Schema['Category']['type']>>([]);

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
        const value = formData.get('value') as string;
        client.models.Category.create({
            displayName: displayName,
            value: value,
        }).then((response) => {
            if (!response.errors) {
                (event.target as HTMLFormElement).reset();
            } else {
                alert(`Unable to create category ${displayName}`);
            }
        });
    };

    const handleDelete = (value: string) => {
        client.models.Category.delete({value}).then((response) => {
            alert(`Deleted category ${response?.data?.displayName} (${response?.data?.value})`);
        });
    };

    return (
        <Stack spacing="components">
            <form onSubmit={handleSubmit}>
                <Stack spacing="content">
                    <h2>Create a category</h2>
                    <InputGroup>
                        <label htmlFor="displayName">Display name</label>
                        <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            required
                        />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="value">Value</label>
                        <input
                            type="text"
                            id="value"
                            name="value"
                            required
                        />
                    </InputGroup>
                    <InteractionControl type="submit">Create</InteractionControl>
                </Stack>
            </form>
            <Stack spacing="content">
                <h2>Categories</h2>
                <ul className="category-list">
                    {
                        categories.map(category => (
                            <li key={category.value}>
                            <span className="display-name">
                                {category.displayName} ({category.value})
                            </span>
                                <div className="button-row">
                                    <InteractionControl onClick={() => handleDelete(category.value)}>
                                        Delete
                                    </InteractionControl>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </Stack>
        </Stack>
    );
};

export default ManageCategories;