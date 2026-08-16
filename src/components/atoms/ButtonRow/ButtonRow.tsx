import {
    FC,
    ReactNode
} from 'react';

import './ButtonRow.css';

interface ButtonRowProps {
    children: ReactNode[];
}

export const ButtonRow: FC<ButtonRowProps> = ({
    children
}) => {
    return (
        <div className="button-row">
            {children}
        </div>
    );
};