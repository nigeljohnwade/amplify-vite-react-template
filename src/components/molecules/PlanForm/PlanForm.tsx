import {
    SubmitEvent,
    useState
} from 'react';

import type { Schema } from '../../../../amplify/data/resource';
import { client } from 'amplify/client';
import InputGroup from 'components/atoms/InputGroup/InputGroup';
import Stack from 'components/atoms/Stack/Stack';
import {
    Plan,
    usePlanContext
} from 'contexts/planContext';
import FormRow from 'components/atoms/FormRow/FormRow';
import ButtonRow from 'components/atoms/ButtonRow/ButtonRow';
import Markdown from 'react-markdown';
import Row from 'components/atoms/Row/Row';

export type PlanInput = {
    content: string;
    title: string;
    categoryId: string;
    priority: Schema['Plan']['type']['priority'];
    place: string | null;
    time: string | null;
    date: string | null;
    location: { lat: number; long: number } | null;
    status: string | null;
    isDone: boolean;
};

const PlanForm = ({
    plan,
    center,
    heading,
    submitLabel,
    onSubmit,
    onCancel,
}: {
    plan?: Plan | null;
    center: [number, number];
    heading: string;
    submitLabel: string;
    onSubmit: (input: PlanInput) => void;
    onCancel: () => void;
}) => {
    const {categories} = usePlanContext();
    const prioritiesEnum = client.enums.PlanPriority.values();
    const [contentPreview, setContentPreview] = useState(plan?.content);

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const content = (formData.get('content') as string) || '';
        const title = formData.get('title') as string;
        const categoryId = formData.get('categoryId') as string;
        const priority = formData.get('priority') as string;
        const place = formData.get('place') as string;
        const time = formData.get('time') as string;
        const date = formData.get('date') as string;
        const status = formData.get('status') as string;
        const isDone = formData.get('isDone');
        console.log(isDone);
        const saveLocation = formData.get('location-checkbox') === 'true';
        onSubmit({
            content,
            title,
            categoryId: categoryId,
            priority: (priority !== '' ? priority : null) as PlanInput['priority'],
            place: place !== '' ? place : null,
            time: time !== '' ? time : null,
            date: date !== '' ? date : null,
            location: saveLocation ? {lat: center[1], long: center[0]} : null,
            status: status !== '' ? status : null,
            isDone: isDone === 'true' ? true : false,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing="components">
                <h2>{heading}</h2>
                <Stack spacing="content">
                    <InputGroup>
                        <label htmlFor="plan-title">Title</label>
                        <input
                            defaultValue={plan?.title || ''}
                            id="plan-title"
                            name="title"
                            type="text"
                            required
                        />
                    </InputGroup>
                    <Row>
                        <InputGroup>
                            <label htmlFor="plan-content">Content</label>
                            <textarea
                                defaultValue={plan?.content || ''}
                                id="plan-content"
                                name="content"
                                onChange={(event) => setContentPreview(event.target.value)}
                            />
                        </InputGroup>
                        <div>
                            {
                                contentPreview &&
                                <Markdown>{contentPreview}</Markdown>
                            }
                        </div>
                    </Row>
                    <FormRow>
                        <InputGroup>
                            <label htmlFor="plan-category">Category</label>
                            <select
                                id="plan-category"
                                name="categoryId"
                                defaultValue={plan?.categoryId}
                                required
                            >
                                <option value={''}>None selected</option>
                                {
                                    categories.map(category => (
                                        <option
                                            key={category.value}
                                            value={category.value}
                                        >
                                            {category.displayName}
                                        </option>
                                    ))
                                }
                            </select>
                        </InputGroup>
                        <InputGroup>
                            <label htmlFor="plan-priority">Priority</label>
                            <select
                                id="plan-priority"
                                name="priority"
                                defaultValue={plan?.priority || ''}
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
                    </FormRow>
                    <FormRow>
                        <InputGroup>
                            <label htmlFor="plan-date">Date</label>
                            <input
                                defaultValue={plan?.date || ''}
                                id="plan-date"
                                name="date"
                                type="date"
                            />
                        </InputGroup>
                        <InputGroup>
                            <label htmlFor="plan-time">Time</label>
                            <input
                                defaultValue={plan?.time || ''}
                                id="plan-time"
                                name="time"
                                type="time"
                            />
                        </InputGroup>
                    </FormRow>
                    <InputGroup>
                        <label htmlFor="plan-place">Place</label>
                        <input
                            defaultValue={plan?.place || ''}
                            id="plan-place"
                            name="place"
                            type="text"
                        />
                    </InputGroup>
                    <FormRow>

                        <InputGroup>
                            <label htmlFor="plan-longitude">Longitude</label>
                            <input
                                value={plan?.location?.long || center[0]}
                                id="plan-longitude"
                                name="longitude"
                                type="number"
                                readOnly={true}
                            />
                        </InputGroup>
                        <InputGroup>
                            <label htmlFor="plan-latitude">Latitude</label>
                            <input
                                value={plan?.location?.lat || center[1]}
                                id="plan-latitude"
                                name="latitude"
                                type="number"
                                readOnly={true}
                            />
                        </InputGroup>
                    </FormRow>
                    <InputGroup>
                        <label htmlFor="plan-location-checkbox">Save location</label>
                        <input
                            type="checkbox"
                            id="plan-location-checkbox"
                            name="location-checkbox"
                            value="true"
                            defaultChecked={plan?.location != null}
                        />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="plan-status">Status</label>
                        <input
                            type="text"
                            name="status"
                            id="plan-status"
                            defaultValue={plan?.status || ''}
                        />
                    </InputGroup>
                    <InputGroup>
                        <label htmlFor="plan-is-done-checkbox">Done?</label>
                        <input
                            type="checkbox"
                            id="plan-is-done-checkbox"
                            name="isDone"
                            value="true"
                            defaultChecked={plan?.isDone !== null ? plan?.isDone : false}
                        />
                    </InputGroup>
                </Stack>
                <ButtonRow>
                    <button
                        className="button"
                        type="submit"
                    >
                        {submitLabel}
                    </button>
                    <button
                        className="button"
                        onClick={onCancel}
                        type="button"
                    >
                        Cancel
                    </button>
                </ButtonRow>
            </Stack>
        </form>
    );
};

export default PlanForm;
