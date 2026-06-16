import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import type { Schema } from '../../../amplify/data/resource';
import { client } from '../../client';
import { categories, INITIAL_CENTER } from '../../constants';
import { usePlanContext } from '../../context';
import { InteractionControl } from '../../components/atoms/InteractionControl/InteractionControl.tsx';

const PlanList = () => {
    const {plans, flyTo} = usePlanContext();
    const [tileView, setTileView] = useState<boolean>(true);

    useEffect(() => {
        flyTo(INITIAL_CENTER);
    }, [flyTo]);

    function deletePlan(id: string) {
        client.models.Plan.delete({id});
    }

    const sortByCategory = (a: Schema['Plan']['type'], b: Schema['Plan']['type']) => {
        if (a.category && b.category) {
            const _a = categories.find(category => category.value === a.category)!.id;
            const _b = categories.find(category => category.value === b.category)!.id;
            return _a > _b ? 1 : -1;
        } else if (a.category && !b.category) {
            return -1;
        } else if (!a.category && b.category) {
            return 1;
        } else {
            return 0;
        }
    };

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
            </div>

            <ul
                className={[
                    'plan-list',
                    tileView ? 'tile-view' : 'list-view',
                ].join(' ')}
            >
                {
                    plans
                        .sort(sortByCategory)
                        .map((plan) => (
                            <li
                                key={plan.id}
                                className={[
                                    plan.location !== null ? 'wide' : '',
                                    plan.date !== null ? 'tall' : '',
                                ].join(' ')}
                            >
                                <p className="todo-title">{plan.title ? plan.title : plan.content ? plan.content.substring(0, 35) : ''}</p>
                                <p className="todo-category">{categories.find(category => category.value === plan.category)?.displayName}</p>
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
