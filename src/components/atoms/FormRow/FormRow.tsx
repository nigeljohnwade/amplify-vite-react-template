import {
    FC,
    ReactNode
} from 'react';

import './FormRow.css';

interface FormRowProps {
    children: ReactNode | ReactNode[];
}

const FormRow: FC<FormRowProps> = ({children}) => {
    return (
        <div className="form-row">
            {children}
        </div>
    );
};

export default FormRow;