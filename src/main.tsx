import React from 'react';
import ReactDOM from 'react-dom/client';
import { Authenticator } from '@aws-amplify/ui-react';
import {
    BrowserRouter,
    Route,
    Routes
} from 'react-router';

import './index.css';

import PlanManagementWrapper from 'PlanManagementWrapper';
import PlanList from 'pages/PlanList/PlanList';
import CreatePlan from 'pages/CreatePlan/CreatePlan';
import UpdatePlan from 'pages/UpdatePlan/UpdatePlan';
import ManageCategories from 'pages/ManageCategories/ManageCategories';
import { ViewPlan } from './pages/ViewPlan/ViewPlan.tsx';
import Settings from 'pages/Settings/Settings';
import Stack from 'components/atoms/Stack/Stack';
import Header from 'components/organisms/Header/Header';
import ManageImages from 'pages/ManageCategories/ManageImages';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Authenticator>
            <BrowserRouter>
                <Stack spacing="containers">
                    <Header/>
                    <Routes>
                        <Route
                            path="/"
                            element={<PlanManagementWrapper/>}
                        >
                            <Route
                                index
                                element={<PlanList/>}
                            />
                            <Route
                                path="/create"
                                element={<CreatePlan/>}
                            />
                            <Route
                                path="/update/:id"
                                element={<UpdatePlan/>}
                            />
                            <Route
                                path="/view/:id"
                                element={<ViewPlan/>}
                            />
                            <Route
                                path="/settings"
                                element={<Settings/>}
                            />
                        </Route>
                        <Route
                            path="manage-categories"
                            element={<ManageCategories/>}
                        />
                        <Route
                            path="manage-images"
                            element={<ManageImages/>}
                        />
                    </Routes>
                </Stack>
            </BrowserRouter>
        </Authenticator>
    </React.StrictMode>
);