import {put, fork, takeEvery, select, delay} from 'redux-saga/effects';

import {
  reset,
  setDocument,
  loadDescriptors,
  saveDescriptors,
  selectDescriptors,
  selectVersion,
  selectDataDocument
} from "./constructorSlice";

import db from './db';

function* loadDocument(action) {
  yield put(reset({fullReset: false}));
  yield put(setDocument({version: 1, ...db[action.payload]}));
}

function* saveDocument() {
  const data = yield select(selectDataDocument);
  const descriptors = yield select(selectDescriptors);
  const version = yield select(selectVersion);

  const document = {version, data, descriptors: Object.values(descriptors)};

  yield put(reset());

  yield delay(1500);

  yield put(setDocument(document));
}

function* background() {
  yield takeEvery(loadDescriptors.type, loadDocument);
  yield takeEvery(saveDescriptors.type, saveDocument);
}

function* saga() {
  yield fork(background);
}


export default saga;
