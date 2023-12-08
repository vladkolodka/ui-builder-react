import {useSelector} from "react-redux";
import {selectDataDocument} from "modules/constructor/data/constructorSlice";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  display: inline-block;

  padding: 5px;
  background-color: rgba(211, 211, 211, 0.5);
  font-size: 12px;
`;

export default function DataDocumentHelper() {
  const data = useSelector(selectDataDocument)

  return <Wrapper>
    <h3>Data document</h3>
    <pre>{JSON.stringify(data, null, 4)}</pre>
  </Wrapper>;
}
