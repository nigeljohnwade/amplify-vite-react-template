import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { client } from '../../amplify/client.ts';
import { Plan, usePlanContext } from 'contexts/planContext.ts';
import PlanForm, { PlanInput } from 'components/molecules/PlanForm/PlanForm';

const UpdatePlan = () => {
    const {id} = useParams();
    const {center, flyTo} = usePlanContext();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<Plan | null>(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        client.models.Plan.get(
            {id}, {
                selectionSet: [
                    'category.*',
                    'categoryId',
                    'content',
                    'date',
                    'id',
                    'isDone',
                    'location.*',
                    'place',
                    'priority',
                    'status',
                    'time',
                    'title',
                ]
            },
        ).then(({data}) => {
            setPlan(data as Plan);
            if (data?.location?.long != null && data?.location?.lat != null) {
                flyTo([data.location.long, data.location.lat]);
            }
        });
    }, [id, flyTo]);

    const handleSubmit = (input: PlanInput) => {
        if (!id) {
            return;
        }
        client.models.Plan.update({id, ...input}).then(() => {
            client.models.Plan.get(
                {id: id},
                {
                    selectionSet: [
                        'category.*',
                        'categoryId',
                        'content',
                        'date',
                        'id',
                        'isDone',
                        'location.*',
                        'place',
                        'priority',
                        'status',
                        'time',
                        'title',
                    ]
                },
            );
            navigate(-1);
        });
    };

    if (!plan) {
        return <p>Loading…</p>;
    }

    return (
        <PlanForm
            plan={plan as Plan}
            center={center}
            heading={`Update plan ${plan.title || 'no title'}`}
            submitLabel="Update plan"
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
        />
    );
};

export default UpdatePlan;
