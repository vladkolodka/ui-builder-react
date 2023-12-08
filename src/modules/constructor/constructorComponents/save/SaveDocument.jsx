import {useCallback} from "react";
import {useDispatch} from "react-redux";
import {saveDescriptors} from "modules/constructor/data/constructorSlice";

export default function SaveDocument() {
  const dispatch = useDispatch();

  const onSave = useCallback(() => {
    dispatch(saveDescriptors());
  }, [dispatch]);


  return <div>
    <button onClick={onSave}>Save product</button>
  </div>
}
