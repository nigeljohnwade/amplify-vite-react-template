import { Link } from 'react-router';
import { InteractionControl } from '../../atoms/InteractionControl/InteractionControl.tsx';
import { useAuthenticator } from '@aws-amplify/ui-react';

import './Header.css';

const Header = () => {
    const {user, signOut} = useAuthenticator();

    return (
        <header className="header">
            <h1>
                {user?.signInDetails?.loginId}'s plans
            </h1>
            <div className="button-row">
                <Link
                    className="button"
                    to="/"
                >
                    Plans
                </Link>
                <Link
                    className="button"
                    to="/manage-categories"
                >
                    Manage categories
                </Link>
                <Link
                    className="button"
                    to="/settings"
                >
                    Settings
                </Link>
                <InteractionControl
                    onClick={signOut}
                >
                    Sign out
                </InteractionControl>
            </div>
        </header>
    );
};

export default Header;