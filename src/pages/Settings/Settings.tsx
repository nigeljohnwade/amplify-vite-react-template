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
import FormRow from 'components/atoms/FormRow/FormRow';

const Settings = () => {
    const {center, flyTo} = usePlanContext();
    const [settings, setSettings] = useState<Partial<Schema['Setting']['type']> | null>(null);
    const [updatedSettings, setUpdatedSettings] = useState<Partial<Schema['Setting']['type']> | null>(null);
    const {user} = useAuthenticator();
    const mapboxStyles = [
        {name: 'Monochrome', id: 'ck6t9mbdx2osp1in0fnb3xd1c'},
        {name: 'Basic', id: 'cmo1iwffr012a01qv3fntaemc'},
    ];

    useEffect(() => {
        client.models.Setting.get({id: user.userId}).then(data => {
            setSettings(data.data);
            setUpdatedSettings(data.data);
            if (data.data?.defaultMapCenter?.lat && data.data?.defaultMapCenter?.long) {
                flyTo([data.data.defaultMapCenter.long, data.data.defaultMapCenter.lat]);
            }
        });
    }, [user.userId]);

    useEffect(() => {
        setUpdatedSettings((settings) => {
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
        const mapboxStyleId = formData.get('mapboxStyleId')?.toString();
        client.models.Setting.update({
            id: user.userId,
            defaultMapCenter: {
                lat: lat,
                long: long,
            },
            mapboxStyle: {
                name: mapboxStyles.find(item => item.id === mapboxStyleId)?.name,
                username: 'nigeljohnwade',
                styleId: mapboxStyleId || undefined,
            },
        }).then(() => {
            client.models.Setting.get({id: user.userId}).then(data => {
                setSettings(data.data);
                if (data.data?.defaultMapCenter?.lat && data.data?.defaultMapCenter?.long) {
                    flyTo([data.data.defaultMapCenter.long, data.data.defaultMapCenter.lat]);
                }
            });
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
                        {
                            settings?.theme &&
                            <li>
                                <span className="key">
                                    Theme
                                </span>
                                <span className="value">
                                    {settings.theme}
                                </span>
                            </li>
                        }
                        {
                            settings?.mapboxStyle &&
                            <>
                                <li>
                                    <span className="key">
                                        Mapbox style ID
                                    </span>
                                    <span className="value">
                                        {settings.mapboxStyle.styleId}
                                    </span>
                                </li>
                                <li>
                                    <span className="key">
                                        Mapbox username
                                    </span>
                                    <span className="value">
                                            {settings.mapboxStyle.username}
                                    </span>
                                </li>
                                <li>
                                    <span className="key">
                                        Mapbox style name
                                    </span>
                                    <span className="value">
                                            {settings.mapboxStyle.name}
                                    </span>
                                </li>
                            </>
                        }
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
                    <h2>Update settings</h2>
                    {
                        settings &&
                        <form
                            onSubmit={(e: SubmitEvent<HTMLFormElement>) => {
                                updateSettings(e);
                            }}
                        >
                            <h3>Mapbox style</h3>
                            <FormRow>
                                <InputGroup>
                                    <label htmlFor="mapbox-style-id">
                                        Preconfigured mapbox style
                                    </label>
                                    <select
                                        id="mapbox-style-id"
                                        name="mapboxStyleId"
                                        onChange={(event) => {
                                            setUpdatedSettings((settings) => {
                                                return {
                                                    ...settings,
                                                    mapboxStyle: {
                                                        name: settings?.mapboxStyle?.name,
                                                        styleId: event.target.value,
                                                        username: settings?.mapboxStyle?.username,
                                                    }
                                                };
                                            });
                                        }}
                                        value={updatedSettings?.mapboxStyle?.styleId || ''}
                                    >
                                        <option value="">Select</option>
                                        {
                                            mapboxStyles && mapboxStyles.map((item) => {
                                                return (<option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </option>);
                                            })
                                        }
                                    </select>
                                </InputGroup>
                            </FormRow>
                            <fieldset>
                                <legend>Custom mapbox style</legend>
                                <FormRow>
                                    <InputGroup>
                                        <label htmlFor="mapbox-style-id">Mapbox style ID</label>
                                        <input
                                            type="text"
                                            name="mapboxStyleId"
                                            id="mapbox-style-id"
                                            value={updatedSettings?.mapboxStyle?.styleId || ''}
                                            onChange={(event) => {
                                                setUpdatedSettings((settings) => {
                                                    return {
                                                        ...settings,
                                                        mapboxStyle: {
                                                            ...settings!.mapboxStyle,
                                                            styleId: event.target.value,
                                                        }
                                                    };
                                                });
                                            }}
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="mapbox-username">Mapbox style username</label>
                                        <input
                                            type="text"
                                            name="mapboxStyleUsername"
                                            id="mapbox-style-username"
                                            value={updatedSettings?.mapboxStyle?.username || ''}
                                            onChange={(event) => {
                                                setUpdatedSettings((settings) => {
                                                    return {
                                                        ...settings,
                                                        mapboxStyle: {
                                                            ...settings!.mapboxStyle,
                                                            username: event.target.value,
                                                        }
                                                    };
                                                });
                                            }}

                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <label htmlFor="mapbox-style-name">Mapbox style name</label>
                                        <input
                                            type="text"
                                            name="mapboxStylename"
                                            id="mapbox-style-name"
                                            value={updatedSettings?.mapboxStyle?.name || ''}
                                            onChange={(event) => {
                                                setUpdatedSettings((settings) => {
                                                    return {
                                                        ...settings,
                                                        mapboxStyle: {
                                                            ...settings!.mapboxStyle,
                                                            name: event.target.value,
                                                        }
                                                    };
                                                });
                                            }}
                                        />
                                    </InputGroup>
                                </FormRow>
                            </fieldset>
                            <FormRow>
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
                            </FormRow>
                            <InteractionControl type="submit">Update settings</InteractionControl>
                        </form>
                    }
                </>
            }
        </Stack>
    );
};
export default Settings;