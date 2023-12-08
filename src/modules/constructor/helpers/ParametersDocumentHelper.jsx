import styled from "@emotion/styled";
import {useSelector} from "react-redux";
import {selectDescriptorParameters} from "../data/constructorSlice";

const Wrapper = styled.div`
  display: inline-block;

  padding: 5px;
  background-color: rgba(211, 211, 211, 0.5);
  font-size: 12px;
`;

export default function ParametersDocumentHelper({id}) {
  const definedParameters = useSelector(state => selectDescriptorParameters(state, id));

  if (Object.keys(definedParameters).length === 0) {
    return <div>
      <Wrapper>
        <h3>No parameters</h3>
      </Wrapper>
    </div>;
  }

  return <div>
    <Wrapper>
      <h3>Parameters document</h3>
      <pre>{JSON.stringify(definedParameters, null, 4)}</pre>
    </Wrapper>
  </div>
}
