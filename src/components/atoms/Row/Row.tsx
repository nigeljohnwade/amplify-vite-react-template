import {
    FC,
    ReactNode
} from 'react';

import './Row.css';

interface RowProps {
    children: ReactNode | ReactNode[];
}

const Row: FC<RowProps> = ({
    children
}) => {
    return (
        <div className="row">
            {children}
        </div>
    );
};

export default Row;