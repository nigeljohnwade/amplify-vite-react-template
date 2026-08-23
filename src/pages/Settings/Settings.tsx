import {
    useState,
    useEffect
} from 'react';
import { client } from 'amplify/client';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Schema } from '../../../amplify/data/resource';

import './Settings.css';
import Stack from 'components/atoms/Stack/Stack';

const Settings = () => {
    const [settings, setSettings] = useState<Schema['Setting']['type'] | null>(null);
    const {user} = useAuthenticator();

    useEffect(() => {
        client.models.Setting.get({id: user.userId}).then(data => setSettings(data.data));
    });

    return (
        <Stack spacing="content">
            <h2>Settings</h2>
            {
                settings &&
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
                </ul>
            }
        </Stack>
    );
};
export default Settings;