import {delay, call, takeEvery, all} from 'redux-saga/effects';

import {increment} from 'components/counter/counterSlice';

import constructorSaga from 'modules/constructor/data/constructorSaga';

function* incrementCounter(action) {
  console.log(call(console.log, "I am here", action));

  yield delay(1000);
  yield call(console.log, "I am here", action);
}

function* saga() {
  yield all([
    takeEvery(increment.type, incrementCounter),
    call(constructorSaga)
  ]);
}


export default saga;
