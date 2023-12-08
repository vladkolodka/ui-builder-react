import styled from "@emotion/styled";
import Descriptor from "./Descriptor";
import useDescriptorsOnLevel from "./hooks/useDescriptorsOnLevel";
import DESCRIPTOR_CONFIGURATION from "./library/descriptorConfiguration";
import DescriptorActions from "./DescriptorActions";
import {defaultConfiguration} from "./library/defaults";
import {CONSTRUCTOR_MODE} from "./data/constants";

const Wrapper = styled.div`
  border: 2px solid rgba(38, 38, 176, 0.84);
  margin: 25px;
  padding: 5px;
`;

const DescriptorWrapper = styled.div`
  border: 2px dashed red;
  margin: 3px;
  padding: 3px;
`;

const NoDescriptorActions = ({children}) => children;

export default function DescriptorsContainer({parentId = null, parentType = null, mode}) {
  let parentConfig = DESCRIPTOR_CONFIGURATION[parentType];

  if (!!!parentConfig) {
    // TODO skip?
    console.warn('No configuration found for descriptor type', parentType);
    parentConfig = defaultConfiguration;
  }

  const isContainer = parentConfig.isContainer;

  const descriptors = useDescriptorsOnLevel(parentId);

  if (!isContainer) {
    return null;
  }

  const ContextActions = mode === CONSTRUCTOR_MODE.EDIT
    ? DescriptorActions
    : NoDescriptorActions;

  if (!!!descriptors || descriptors.length === 0) {
    return <ContextActions parentId={parentId} parentType={parentType} insertPosition={0} />;
  }

  return <Wrapper>
    <h4>Container in {parentId}</h4>
    <ul>
      {descriptors.map((d, i) => <li key={d.id}>
        <DescriptorWrapper>
          <ContextActions parentId={parentId} parentType={parentType}
                          insertPosition={i} type={d.type} descriptorId={d.id}>
            <Descriptor id={d.id} type={d.type} mode={mode}>
              <DescriptorsContainer parentId={d.id} parentType={d.type} mode={mode}/>
            </Descriptor>
          </ContextActions>
        </DescriptorWrapper>
      </li>)}
    </ul>
  </Wrapper>;
}
