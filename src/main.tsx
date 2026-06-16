import React from 'react';
import ReactDOM from 'react-dom/client';
import { Authenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Route, Routes } from 'react-router';

import App from './App.tsx';
import PlanList from './pages/PlanList/PlanList.tsx';
import CreatePlan from './pages/CreatePlan/CreatePlan.tsx';
import UpdatePlan from './pages/UpdatePlan/UpdatePlan.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Authenticator>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<App/>}
                    >
                        <Route
                            index
                            element={<PlanList/>}
                        />
                        <Route
                            path="create"
                            element={<CreatePlan/>}
                        />
                        <Route
                            path="update/:id"
                            element={<UpdatePlan/>}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Authenticator>
    </React.StrictMode>
);
