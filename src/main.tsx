import React from 'react';
import ReactDOM from 'react-dom/client';
import { Authenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Route, Routes } from 'react-router';

import './index.css';

import App from './App';
import PlanList from 'pages/PlanList/PlanList';
import CreatePlan from 'pages/CreatePlan/CreatePlan';
import UpdatePlan from 'pages/UpdatePlan/UpdatePlan';
import ManageCategories from 'pages/ManageCategories/ManageCategories';
import { ViewPlan } from './pages/ViewPlan/ViewPlan.tsx';

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
                        <Route
                            path="view/:id"
                            element={<ViewPlan/>}
                        />
                        <Route
                            path="manage-categories"
                            element={<ManageCategories/>}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Authenticator>
    </React.StrictMode>
);