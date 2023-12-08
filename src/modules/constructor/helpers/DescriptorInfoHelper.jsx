import styled from "@emotion/styled";
import ParametersDocumentHelper from "./ParametersDocumentHelper";
import useDataBinding from "modules/constructor/hooks/useDataBinding";

const StyledTable = styled.table`
  border-collapse: collapse;
  margin: 5px;
  max-width: 50%;

  tr:first-of-type {
    color: #299100;
  }

  th {
    background: #ccc;
    text-align: left;
  }

  td, th {
    border: 1px solid #800;
    padding: 4px;
  }
`;

export default function DescriptorInfoHelper({id, type}) {
  const dataBinding = useDataBinding(id);

  return <>
    <h4>Descriptor {id}</h4>

    <StyledTable>
      <thead>
      <tr>
        <th colSpan={2}>Descriptor details</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th>Descriptor ID</th>
        <td>{id}</td>
      </tr>
      <tr>
        <th>Type</th>
        <td>{type}</td>
      </tr>
      <tr>
        <th>Parameters</th>
        <td>
          <ParametersDocumentHelper id={id}/>
        </td>
      </tr>
      <tr>
        <th>Data binding</th>
        <td>{JSON.stringify(dataBinding.value)}</td>
      </tr>
      </tbody>
    </StyledTable>
  </>;
}
