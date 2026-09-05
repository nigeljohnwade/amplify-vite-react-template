import {
    useState,
    useEffect,
    SubmitEvent,
} from 'react';
import { client } from 'amplify/client';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Schema } from '../../../amplify/data/resource';

import './Settings.css';

import Stack from 'components/atoms/Stack/Stack';
import InputGroup from 'components/atoms/InputGroup/InputGroup';
import { usePlanContext } from 'contexts/planContext';
import { InteractionControl } from 'components/atoms/InteractionControl/InteractionControl';

const Settings = () => {
    const {center, flyTo} = usePlanContext();
    const [settings, setSettings] = useState<Partial<Schema['Setting']['type']> | null>(null);
    const {user} = useAuthenticator();

    useEffect(() => {
        client.models.Setting.get({id: user.userId}).then(data => {
            setSettings(data.data);
            if (data.data?.defaultMapCenter?.lat && data.data?.defaultMapCenter?.long) {
                flyTo([data.data.defaultMapCenter.long, data.data.defaultMapCenter.lat]);
            }
        });
    }, [user.userId]);

    useEffect(() => {
        console.log(center);
        setSettings((settings) => {
            return {
                ...settings,
                defaultMapCenter: {
                    lat: center[1],
                    long: center[0],
                },
            };
        });
    }, [center]);

    const updateSettings = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const lat = Number(formData.get('latitude'));
        const long = Number(formData.get('longitude'));
        console.log(lat, long);
        client.models.Setting.update({
            id: user.userId,
            defaultMapCenter: {
                lat: lat,
                long: long,
            }
        });
    };

    return (
        <Stack spacing="content">
            <h2>Settings</h2>
            {
                settings &&
                <>
                    <ul className="key-value-list">
                        <li>
                        <span className="key">
                            Plan view
                        </span>
                            <span className="value">
                            {settings.planView}
                        </span>
                        </li>
                        <li>
                        <span className="key">
                            Theme
                        </span>
                            <span className="value">
                            {settings.theme}
                        </span>
                        </li>
                        <li>
                        <span className="key">
                            Default latitude
                        </span>
                            <span className="value">
                            {settings.defaultMapCenter?.lat}
                        </span>
                        </li>
                        <li>
                        <span className="key">
                            Default longitude
                        </span>
                            <span className="value">
                            {settings.defaultMapCenter?.long}
                        </span>
                        </li>
                    </ul>
                    <form
                        onSubmit={(e: SubmitEvent<HTMLFormElement>) => {
                            updateSettings(e);
                        }}
                    >
                        <InputGroup>
                            <label htmlFor="plan-longitude">Longitude</label>
                            <input
                                value={center[0]}
                                id="longitude"
                                name="longitude"
                                type="number"
                                readOnly={true}
                            />
                        </InputGroup>
                        <InputGroup>
                            <label htmlFor="defaultPlanMapCenter-latitude">Latitude</label>
                            <input
                                value={center[1]}
                                id="latitude"
                                name="latitude"
                                type="number"
                                readOnly={true}
                            />
                        </InputGroup>
                        <InteractionControl type="submit">Update default map center</InteractionControl>
                    </form>
                </>
            }
        </Stack>
    );
};
export default Settings;