import { FC, ReactNode } from 'react';

interface StatusChipProps {
    children: ReactNode | ReactNode[];
}

export const StatusChip: FC<StatusChipProps> = ({
    children,
}) => {
    return (
        <div
            style={{
                padding: '0.25rem 1rem',
                backgroundColor: 'grey',
                color: 'white',
            }}
        >
            <span>{children}</span>
        </div>
    );
};