import {
    FC,
    ReactNode
} from 'react';

import './ButtonRow.css';

interface ButtonRowProps {
    children: ReactNode | ReactNode[];
}

const ButtonRow: FC<ButtonRowProps> = ({
    children
}) => {
    return (
        <div className="button-row">
            {children}
        </div>
    );
};

export default ButtonRow;