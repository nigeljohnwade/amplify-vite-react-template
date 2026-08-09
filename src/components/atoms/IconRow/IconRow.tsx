import { FC, ReactNode } from 'react';

import './IconRow.css';

interface IconRowProps {
    children: ReactNode[];
}

export const IconRow: FC<IconRowProps> = ({
    children
}) => {
    return (
        <div className="icon-row">
            {children}
        </div>
    );
};