import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import type { Schema } from '../../../amplify/data/resource';
import { client } from '../../client';
import { usePlanContext } from '../../context';
import PlanForm, { PlanInput } from 'components/molecules/PlanForm/PlanForm';

const UpdatePlan = () => {
    const {id} = useParams();
    const {center, flyTo} = usePlanContext();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<Schema['Plan']['type'] | null>(null);

    useEffect(() => {
        if (!id) {
            return;
        }
        client.models.Plan.get({id}).then(({data}) => {
            setPlan(data);
            if (data?.location?.long != null && data?.location?.lat != null) {
                flyTo([data.location.long, data.location.lat]);
            }
        });
    }, [id, flyTo]);

    const handleSubmit = (input: PlanInput) => {
        if (!id) {
            return;
        }
        client.models.Plan.update({id, ...input});
        navigate('/');
    };

    if (!plan) {
        return <p>Loading…</p>;
    }

    return (
        <PlanForm
            plan={plan}
            center={center}
            heading={`Update plan ${plan.title || 'no title'}`}
            submitLabel="Update plan"
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
        />
    );
};

export default UpdatePlan;
