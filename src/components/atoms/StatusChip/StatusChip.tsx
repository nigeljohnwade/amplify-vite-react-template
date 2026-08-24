import {
    FC,
    ReactNode
} from 'react';

import './StatusChip.css';

interface StatusChipProps {
    children: ReactNode | ReactNode[];
}

export const StatusChip: FC<StatusChipProps> = ({
    children,
}) => {
    return (
        <div className="status-chip">
            <span>{children}</span>
        </div>
    );
};