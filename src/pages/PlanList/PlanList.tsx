import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { client } from 'amplify/client';
import { INITIAL_CENTER } from 'configuration/constants';
import { usePlanContext } from 'contexts/planContext';
import { InteractionControl } from 'components/atoms/InteractionControl/InteractionControl';
import { StatusChip } from 'components/atoms/StatusChip/StatusChip';

const PlanList = () => {
    const {plans, flyTo} = usePlanContext();
    const [tileView, setTileView] = useState<boolean>(true);

    useEffect(() => {
        flyTo(INITIAL_CENTER);
    }, [flyTo]);

    function deletePlan(id: string) {
        client.models.Plan.delete({id});
    }

    return (
        <>
            <div className="button-row">
                <Link
                    className="button"
                    to="/create"
                >
                    Make a new plan
                </Link>
                <InteractionControl
                    onClick={() => setTileView(!tileView)}
                >
                    Toggle view
                </InteractionControl>
                <StatusChip>
                    <span>{tileView ? 'Tile' : 'List'} view</span>
                </StatusChip>
                <StatusChip>
                    <span>Not sorted</span>
                </StatusChip>
                <StatusChip>
                    <span>No filters</span>
                </StatusChip>
            </div>

            <ul
                className={[
                    'plan-list',
                    tileView ? 'tile-view' : 'list-view',
                ].join(' ')}
            >
                {
                    plans
                        .map((plan) => (
                            <li
                                key={plan.id}
                                className={[
                                    plan.location !== null ? 'wide' : '',
                                    plan.date !== null ? 'tall' : '',
                                ].join(' ')}
                            >
                                <p className="todo-title">{plan.title ? plan.title : plan.content ? plan.content.substring(0, 35) : ''}</p>
                                <p className="todo-category">{plan.categoryId}</p>
                                {
                                    !tileView &&
                                    <>
                                        <p className="todo-priority">{plan.priority}</p>
                                        <p>{plan.date} {plan.time}</p>
                                    </>
                                }
                                <div className="button-row">
                                    <Link
                                        className="button"
                                        to={`/update/${plan.id}`}
                                    >
                                        Edit
                                    </Link>
                                    <InteractionControl
                                        onClick={() => deletePlan(plan.id)}
                                    >
                                        Delete
                                    </InteractionControl>
                                </div>
                            </li>
                        ))}
            </ul>
        </>
    );
};

export default PlanList;
