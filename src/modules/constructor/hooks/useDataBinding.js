import {useDispatch, useSelector} from "react-redux";
import {selectDataDocumentValue, setDataItem} from "modules/constructor/data/constructorSlice";
import {useCallback} from "react";

/***
 * Creates getter and setter for the descriptor by the binding expression
 * @param descriptorId ID of the descriptor
 * @returns {{setValue: (function(*): any), value: *}}
 */
export default function useDataBinding(descriptorId) {
  const dispatch = useDispatch();

  const value = useSelector(s => selectDataDocumentValue(s, descriptorId));

  const setValue = useCallback(newValue => dispatch(setDataItem({descriptorId, value: newValue})),
    [descriptorId, dispatch]);

  return {value, setValue};
}
