import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { client } from '../../client';
import { INITIAL_CENTER } from '../../constants';
import { usePlanContext } from '../../context';
import PlanForm, { PlanInput } from '../../components/molecules/PlanForm/PlanForm';

const CreatePlan = () => {
    const {center, flyTo} = usePlanContext();
    const navigate = useNavigate();

    useEffect(() => {
        flyTo(INITIAL_CENTER);
    }, [flyTo]);

    const handleSubmit = (input: PlanInput) => {
        client.models.Plan.create(input);
        navigate('/');
    };

    return (
        <PlanForm
            center={center}
            heading="Create new plan"
            submitLabel="Create plan"
            onSubmit={handleSubmit}
            onCancel={() => navigate('/')}
        />
    );
};

export default CreatePlan;
