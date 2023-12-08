import {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {moveDescriptors} from "modules/constructor/data/constructorSlice";

export default function MovementsHelper() {
  const [parentId, setParentId] = useState('qwerty-1');
  const [value, setValue] = useState('qwerty-1.2,qwerty-1.2.2,qwerty-1.3.2');

  const dispatch = useDispatch();
  const onMove = useCallback(() => {
    const action = moveDescriptors({
      descriptorIds: value.split(','),
      position: {
        parentId,
        insertPosition: -1
      }
    });

    dispatch(action);
  }, [value, parentId, dispatch]);

  return <div>
    Move: <input placeholder="IDs" value={value} onChange={e => setValue(e.target.value)}/>
    <input placeholder="New Parent ID" value={parentId} onChange={e => setParentId(e.target.value)}/>
    <button onClick={onMove}>Move</button>
  </div>;
}
