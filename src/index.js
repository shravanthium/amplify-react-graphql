import React from 'react';
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import ErrorPage from "./ErrorPage";
import DonorsList from './DonorsList';
import './index.css';
import App from './App';

import { Amplify } from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "donors",
    element: <DonorsList />,
  },
]);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);