import { FC, ReactNode } from 'react';

import './InteractionControl.css';

interface InteractionControlProps {
    ariaLabel?: string;
    children: ReactNode | ReactNode[];
    href?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'linkButton' | 'textButton' | 'iconButton';
}

export const InteractionControl: FC<InteractionControlProps> = ({
    ariaLabel,
    children,
    href,
    onClick,
    type = 'button',
    variant,
}) => {
    return (
        <>
            {
                href &&
                <a
                    className={variant === 'linkButton' ? 'button' : 'link'}
                    href={href}
                >
                    {children}
                </a>
            }
            {
                !href &&
                <button
                    aria-label={ariaLabel}
                    className={variant === 'iconButton' ? 'button icon' : variant === 'textButton' ? 'button text' : 'button'}
                    onClick={onClick}
                    type={type}
                >
                    {children}
                </button>
            }
        </>
    );
};