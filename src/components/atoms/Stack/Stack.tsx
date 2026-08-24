import { ReactNode } from 'react';

import './Stack.css';

const Stack = ({
    children,
    spacing = 'content',
}: {
    children: ReactNode | ReactNode[],
    spacing?: 'content' | 'containers' | 'components',
}) => {
    return (
        <div className={['stack', spacing].join(' ')}>
            {children}
        </div>
    );
};
export default Stack;