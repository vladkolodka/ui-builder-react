import {useEffect} from 'react';
import Constructor from "modules/constructor";
import {CONSTRUCTOR_MODE} from "modules/constructor/data/constants";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loadDescriptors} from 'modules/constructor/data/constructorSlice'
import { css } from '@emotion/react';

export default function ConstructorPage() {
  const dispatch = useDispatch();
  const {id} = useParams();

  useEffect(() => {
    dispatch(loadDescriptors(id));
  }, [id, dispatch]);

  return <div>
    <h1 css={css`
      color: red;
    `}>Constructor page #{id}</h1>

    <Constructor initialMode={CONSTRUCTOR_MODE.EDIT} allowModeSwitch={true}/>
  </div>;
}
