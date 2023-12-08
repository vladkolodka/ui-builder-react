import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider} from 'react-redux';
import {store} from './data/rootStore';

import reportWebVitals from './reportWebVitals';
import './index.css';

import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import routes from './routes';

import Layout from "./components/Layout";
import CounterPage from "./pages/CounterPage";
import ConstructorPage from "./pages/ConstructorPage";
import ViewerPage from "./pages/ViewerPage";
import TestPage from "./pages/TestPage";

const container = document.getElementById('root');
const root = createRoot(container);

const createRouteElements = () =>
  <Route path={routes.root} element={<Layout/>}>
    <Route path={routes.root} element={<CounterPage/>}/>
    <Route path={routes.constructor} element={<ConstructorPage/>}/>
    <Route path={routes.viewer} element={<ViewerPage/>}/>
    <Route path={routes.test} element={<TestPage/>}/>
  </Route>;

let router = createBrowserRouter(
  createRoutesFromElements(
    createRouteElements()
  )
);

root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  // </React.StrictMode>
);

reportWebVitals(/*console.log*/); // Learn more: https://bit.ly/CRA-vitals

