import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";
import {loadDescriptors} from "modules/constructor/data/constructorSlice";
import Constructor from "modules/constructor/Constructor";
import {CONSTRUCTOR_MODE} from "modules/constructor/data/constants";

export default function ViewerPage() {
  const dispatch = useDispatch();
  const {id} = useParams();

  useEffect(() => {
    dispatch(loadDescriptors(id));
  }, [id, dispatch]);

  return <div>
    <h1>Viewer page</h1>

    <Constructor initialMode={CONSTRUCTOR_MODE.VIEW} allowModeSwitch={false}/>
  </div>;
}
