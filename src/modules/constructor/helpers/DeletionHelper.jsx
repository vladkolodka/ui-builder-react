import {useState, useCallback} from "react";
import {useDispatch} from "react-redux";
import {deleteDescriptors} from "modules/constructor/data/constructorSlice";

export default function DeletionHelper() {
  const [ids, setIds] = useState('qwerty-1.2.1,qwerty-1.2.2,qwerty-1.3');

  const dispatch = useDispatch();
  const onDelete = useCallback(() => {
    dispatch(deleteDescriptors({
      descriptorIds: ids.split(','),
      clearDataDocument: true
    }));
  }, [ids, dispatch]);

  return <div>
    Delete:
    <input type="text" value={ids} onChange={e => setIds(e.target.value)}/>
    <button onClick={onDelete}>Delete</button>
  </div>;
}
