import { ReactElement } from 'react';

import './Stack.css';

const Stack = ({
    children,
}: {
    children: ReactElement | ReactElement[],
}) => {
    return (
        <div className="stack">
            {children}
        </div>
    );
};
export default Stack;