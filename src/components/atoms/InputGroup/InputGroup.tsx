import { ReactNode } from 'react';

import './InputGroup.css';

const InputGroup = ({
    children,
}: {
    children: ReactNode | ReactNode[],
}) => {
    return (
        <div className="input-group">
            {children}
        </div>
    );
};

export default InputGroup;