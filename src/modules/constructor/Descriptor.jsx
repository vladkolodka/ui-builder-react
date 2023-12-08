import {useContext, useMemo} from 'react';

import DESCRIPTOR_CONFIGURATION from "./library/descriptorConfiguration";

import {CONSTRUCTOR_MODE} from "./data/constants";
import useDataBinding from "./hooks/useDataBinding";
import useDescriptorParameters from "./hooks/useDescriptorParameters";
import DescriptorInfoHelper from "./helpers/DescriptorInfoHelper";
import ParametersPropagator, {propagationContext} from "./ParametersPropagator";

export default function Descriptor({id, type, mode, children}) {
  const [parameters, paramsToPropagate] = useDescriptorParameters(id, type);
  const dataBinding = useDataBinding(id);
  const propagatedParams = useContext(propagationContext);

  const isEditMode = mode === CONSTRUCTOR_MODE.EDIT;
  const isMonoMode = DESCRIPTOR_CONFIGURATION[type]?.isMonoMode === true;

  // TODO get rid of fake components
  const Component = useMemo(() => {
    if (isMonoMode) {
      return DESCRIPTOR_CONFIGURATION[type]?.component || (({children}) => <><p>Fake mono component</p>{children}</>);
    }

    return DESCRIPTOR_CONFIGURATION[type]?.components || ({
      Editor: ({children}) => <><p>Editor fake component</p>{children}</>,
      Viewer: ({children}) => <><p>Viewer fake component</p>{children}</>
    });
  }, [type, isMonoMode]);

  // TODO memoize?
  const RenderComponent = isMonoMode
    ? Component
    : isEditMode
      ? Component.Editor
      : Component.Viewer;

  return <>
    {/*TODO remove*/}
    <DescriptorInfoHelper id={id} type={type}/>

    <RenderComponent {...parameters} {...dataBinding} $parentParams={propagatedParams} $isEditMode={isEditMode}>
      <ParametersPropagator type={type} paramsToPropagate={paramsToPropagate}>
        {children}
      </ParametersPropagator>
    </RenderComponent>
  </>;
}
