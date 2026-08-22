import {
    FC,
    ReactNode
} from 'react';

import './MapWrapper.css';

const MapWrapper: FC<{ children: ReactNode | ReactNode[] }> = ({children}) => {
    return (
        <div className="map-wrapper">
            {children}
        </div>
    );
};

export default MapWrapper;