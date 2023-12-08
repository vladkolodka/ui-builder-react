import {VIEW_MODE} from './constants';

export default function EditList(params) {
  const {
    // value, setValue,
    viewMode: {value: viewMode, setValue: setViewMode},
    children
  } = params;

  return <>
    <p>EditList: {viewMode}</p>

    <button onClick={() => setViewMode(VIEW_MODE.STANDARD)}>{VIEW_MODE.STANDARD}</button>
    <button onClick={() => setViewMode(VIEW_MODE.ADVANCED)}>{VIEW_MODE.ADVANCED}</button>
    {children}
  </>;
}
