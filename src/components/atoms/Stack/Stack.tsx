import { ReactElement } from 'react';

import './Stack.css';

const Stack = ({
    children,
    spacing = 'content',
}: {
    children: ReactElement | ReactElement[],
    spacing?: 'content' | 'containers' | 'components',
}) => {
    return (
        <div className={['stack', spacing].join(' ')}>
            {children}
        </div>
    );
};
export default Stack;