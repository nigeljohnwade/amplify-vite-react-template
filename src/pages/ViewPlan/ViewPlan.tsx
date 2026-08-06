import { useEffect, useState } from 'react';
import { client } from '../../amplify/client.ts';
import { Link, useNavigate, useParams } from 'react-router';
import Markdown from 'react-markdown';
import Stack from 'components/atoms/Stack/Stack';
import { Plan } from '../../contexts/planContext.ts';
import { InteractionControl } from '../../components/atoms/InteractionControl/InteractionControl.tsx';

export const ViewPlan = () => {
    const navigate = useNavigate();
    const [planDetails, setPlanDetails] = useState<Plan>();
    const {id} = useParams();

    function deletePlan(id: string) {
        client.models.Plan.delete({id}).then(() => {
            navigate(-1);
        });
    }

    useEffect(() => {
        const getPlan = async (id: string) => {
            const plan = await client.models.Plan.get(
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
            return plan;
        };
        if (id) {
            getPlan(id).then((plan) => {
                setPlanDetails(plan.data as Plan);
                console.log(plan);
            });
        }
    }, [id]);

    return (
        <>
            {
                planDetails &&
                <Stack spacing="content">
                    <h1>{planDetails.title}</h1>
                    <Markdown>{planDetails.content}</Markdown>
                    <p>{planDetails.category.displayName}</p>
                    <p>{planDetails.place}</p>
                    <p>{planDetails.date}</p>
                    <p>{planDetails.time}</p>
                    <p>{planDetails.priority}</p>
                    <p>{planDetails.status}</p>
                    <p>{planDetails.isDone}</p>
                    {
                        planDetails.location &&
                        <>
                            <p>{planDetails.location.lat}</p>
                            <p>{planDetails.location.long}</p>
                        </>
                    }
                    <div className="button-row">
                        <Link
                            className="button"
                            to={`/update/${planDetails.id}`}
                        >
                            Edit
                        </Link>
                        <InteractionControl
                            onClick={() => deletePlan(planDetails.id)}
                        >
                            Delete
                        </InteractionControl>
                    </div>
                </Stack>
            }
        </>
    );
};