import { ReactElement } from 'react';

import './Stack.css';

const Stack = ({
    children,
    spacing = 'medium',
}: {
    children: ReactElement | ReactElement[],
    spacing?: 'small' | 'medium' | 'large',
}) => {
    return (
        <div className={['stack', spacing].join(' ')}>
            {children}
        </div>
    );
};
export default Stack;