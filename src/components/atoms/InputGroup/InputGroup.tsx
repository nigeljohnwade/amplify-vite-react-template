import { ReactElement } from 'react';

import './InputGroup.css';

const InputGroup = ({
    children,
}: {
    children: ReactElement | ReactElement[],
}) => {
    return (
        <div className="input-group">
            {children}
        </div>
    );
};

export default InputGroup;