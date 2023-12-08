import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import mainSaga from './rootSaga';

import counterReducer from 'components/counter/counterSlice';
import {addConstructorReducer} from "modules/constructor/data/constructorSlice";

const sagaMiddleware = createSagaMiddleware();

const reducer = {
  counter: counterReducer
};

addConstructorReducer(reducer);

export const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware)
});

// TODO dynamic injection for store
// TODO dynamic injection for saga

sagaMiddleware.run(mainSaga);
