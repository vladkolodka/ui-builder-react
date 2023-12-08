import {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectDescriptorParameters, setDescriptorParameter} from "modules/constructor/data/constructorSlice";
import DESCRIPTOR_CONFIGURATION from "modules/constructor/library/descriptorConfiguration";

const noParameters = {};

/***
 * Creates getters and setters for descriptor parameters by descriptor type.
 * It will use default values for non-defined parameters.
 *
 * New value will be returned if
 * @param descriptorId ID of the descriptor
 * @param type type of the descriptor
 * @returns for each parameter key returns setValue and getValue functions
 */
export default function useDescriptorParameters(descriptorId, type) {
  const dispatch = useDispatch();

  const definedParameters = useSelector(state => selectDescriptorParameters(state, descriptorId));
  const supportedParameters = (DESCRIPTOR_CONFIGURATION[type] || noParameters).parameters || noParameters;

  const parameterSetters = useMemo(() => {
    if (!!!DESCRIPTOR_CONFIGURATION[type]) {
      // TODO ???
      return {};
    }

    // TODO get props from context

    return Object.keys(supportedParameters).reduce((settersCollection, parameterName) => {
      settersCollection[parameterName] = newValue =>
        dispatch(setDescriptorParameter({
          descriptorId,
          parameterName: parameterName,
          parameterValue: newValue
        }));

      return settersCollection;
    }, {});

  }, [descriptorId, type, dispatch, supportedParameters]);

  const getSetParams = useMemo(() => {
    return Object.keys(supportedParameters).reduce((computedParams, parameterName) => {
      computedParams[parameterName] = {
        value: definedParameters[parameterName] || supportedParameters[parameterName].default,
        setValue: parameterSetters[parameterName]
      };

      return computedParams;
    }, {});
  }, [definedParameters, parameterSetters, supportedParameters]);

  const propagatedParams = useMemo(() => {
    return Object.keys(supportedParameters)
      .filter(p => supportedParameters[p].shouldPropagate)
      .reduce((computedParams, parameterName) => {
        computedParams[parameterName] = getSetParams[parameterName].value;
        return computedParams;
      }, {});

  }, [getSetParams, supportedParameters]);

  return [getSetParams, propagatedParams];
}
