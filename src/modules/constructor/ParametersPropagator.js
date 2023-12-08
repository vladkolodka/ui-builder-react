import {useMemo, useContext, createContext} from "react";

const defaultContext = {};
export const propagationContext = createContext(defaultContext);

const ContextProvider = propagationContext.Provider;

export default function ParametersPropagator({type, paramsToPropagate, children}) {
  const context = useContext(propagationContext);

  const mergedContext = useMemo(() => {

    if(Object.keys(paramsToPropagate).length === 0){
      return null;
    }

    return {
      ...context,
      [type]: paramsToPropagate
    }

  }, [context, paramsToPropagate, type]);

  return mergedContext === null
    ? children
    : <ContextProvider value={mergedContext}>{children}</ContextProvider>
}
