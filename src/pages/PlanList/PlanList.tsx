import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { client } from 'amplify/client';
import { INITIAL_CENTER } from 'configuration/constants';
import { usePlanContext } from 'contexts/planContext';
import { InteractionControl } from 'components/atoms/InteractionControl/InteractionControl';
import { StatusChip } from 'components/atoms/StatusChip/StatusChip';
import { ButtonRow } from 'components/atoms/ButtonRow/ButtonRow';
import { IconRow } from 'components/atoms/IconRow/IconRow';

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
            <ButtonRow>
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
            </ButtonRow>
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
                                <a href={`/view/${plan.id}`}>
                                    <p className="todo-title">{plan.title}</p>
                                </a>
                                <p className="todo-category">{plan.category.displayName}</p>
                                {
                                    !tileView &&
                                    <>
                                        <p className="todo-priority">{plan.priority}</p>
                                        {/*<p>{plan.date} {plan.time}</p>*/}
                                    </>
                                }
                                <IconRow>
                                    {
                                        plan.location !== null &&
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 24 24"
                                        >
                                            //https://opensvg.dev/icons
                                            <path
                                                fill="currentColor"
                                                d="M17.657 5.304c-3.124-3.073-8.189-3.073-11.313 0a7.78 7.78 0 0 0 0 11.13L12 21.999l5.657-5.565a7.78 7.78 0 0 0 0-11.13M12 13.499c-.668 0-1.295-.26-1.768-.732a2.503 2.503 0 0 1 0-3.536c.472-.472 1.1-.732 1.768-.732s1.296.26 1.768.732a2.503 2.503 0 0 1 0 3.536c-.472.472-1.1.732-1.768.732"
                                            />
                                        </svg>
                                    }
                                    {
                                        plan.date !== null &&
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 24 24"
                                        >
                                            <g fill="none">
                                                <path
                                                    fill="currentColor"
                                                    d="M2 9c0-1.886 0-2.828.586-3.414S4.114 5 6 5h12c1.886 0 2.828 0 3.414.586S22 7.114 22 9c0 .471 0 .707-.146.854C21.707 10 21.47 10 21 10H3c-.471 0-.707 0-.854-.146C2 9.707 2 9.47 2 9m0 9c0 1.886 0 2.828.586 3.414S4.114 22 6 22h12c1.886 0 2.828 0 3.414-.586S22 19.886 22 18v-5c0-.471 0-.707-.146-.854C21.707 12 21.47 12 21 12H3c-.471 0-.707 0-.854.146C2 12.293 2 12.53 2 13z"
                                                />
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeWidth="2"
                                                    d="M7 3v3m10-3v3"
                                                />
                                            </g>
                                        </svg>
                                    }
                                    {
                                        plan.time !== null &&
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 48 48"
                                        >
                                            <defs>
                                                <mask id="iconifyReact183">
                                                    <g
                                                        fill="none"
                                                        strokeLinejoin="round"
                                                        strokeWidth="4"
                                                    >
                                                        <path
                                                            fill="#fff"
                                                            stroke="#fff"
                                                            d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"
                                                        ></path>
                                                        <path
                                                            stroke="#000"
                                                            strokeLinecap="round"
                                                            d="M24.008 12v12.01l8.479 8.48"
                                                        ></path>
                                                    </g>
                                                </mask>
                                            </defs>
                                            <path
                                                fill="currentColor"
                                                d="M0 0h48v48H0z"
                                                mask="url(#iconifyReact183)"
                                            ></path>
                                        </svg>
                                    }
                                </IconRow>
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
