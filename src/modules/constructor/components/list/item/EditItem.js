import {LIST as parentComponentName} from 'modules/constructor/library/componentNames';
import {VIEW_MODE} from '../constants';

const colorMapping = {
  [undefined]: 'orange',
  [VIEW_MODE.STANDARD]: 'red',
  [VIEW_MODE.ADVANCED]: 'blue'
}

export default function EditListItem(params) {
  const {
    value, setValue,
    $parentParams
  } = params;

  const propagated = $parentParams[parentComponentName] || {};

  const color = colorMapping[propagated.viewMode];

  return <>
    <p style={{color: color}}>EditListItem: {value}</p>
    <input type="text" value={value || ''} onChange={e => setValue(e.target.value)} />
    <pre>
      {JSON.stringify($parentParams, 0, 2)}
    </pre>
  </>;
}
