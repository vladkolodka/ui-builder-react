import {useCallback, useMemo} from "react";
import styled from "@emotion/styled";

import DESCRIPTOR_CONFIGURATION from "./library/descriptorConfiguration";
import TEMPLATE_CONFIGURATION from "./library/templateConfiguration";

import {ALLOW_EVERYTHING} from "./library/constants";

import {useDispatch} from "react-redux";
import {insertDescriptors, deleteDescriptors} from "./data/constructorSlice";

const Popup = styled.div`
  visibility: hidden;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 5px;
  position: absolute;
  z-index: 1;
`;

const InsertButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 6px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  position: relative;

  &:hover {
    color: red;
  }

  &:hover ${Popup} {
    visibility: visible;
  }
`;

const StyledDeleteButton = styled.button`
  float: right;
  opacity: 0.5;
  padding: 6px 12px;
  font-size: 1.02em;

  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`;

function useCalculatedTemplateTypes(config) {
  return useMemo(() => {
    if (config.allowedChildren === ALLOW_EVERYTHING) {
      return Object.keys(TEMPLATE_CONFIGURATION);
    }

    return config.allowedChildren;
  }, [config]);
}

function InsertComponent({parentId, templates, onInsert, insertPosition}) {
  return <section>
    <InsertButton>Insert to {parentId === null ? '[[root]]' : parentId}
      <Popup>
        <select onChange={e => onInsert(insertPosition, e.target.value)}>
          <option value="">Please select template</option>

          {templates.map(templateName =>
            <option key={templateName} value={templateName}>{templateName}</option>)}
        </select>
      </Popup>
    </InsertButton>
  </section>;
}

function InsertionAction({parentConfig, parentId, insertPosition, isWrapper, children}) {
  const templateList = useCalculatedTemplateTypes(parentConfig);

  const dispatch = useDispatch();
  const onInsert = useCallback((position, templateName) => {
    const action = insertDescriptors({
      templateName,
      position: {
        parentId,
        insertPosition: position
      }
    });

    dispatch(action);
  }, [parentId, dispatch]);

  if (templateList === null || templateList.length === 0) {
    return children;
  }

  if (isWrapper) {
    return <>
      <InsertComponent parentId={parentId} insertPosition={insertPosition}
                       onInsert={onInsert} templates={templateList}/>

      {children}

      <InsertComponent parentId={parentId} insertPosition={insertPosition + 1}
                       onInsert={onInsert} templates={templateList}/>
    </>;
  }

  return <InsertComponent parentId={parentId} insertPosition={insertPosition}
                          onInsert={onInsert} templates={templateList}/>;
}

function DeleteComponent({onDelete, canDelete}) {
  return <StyledDeleteButton disabled={!canDelete} onClick={onDelete}>Delete</StyledDeleteButton>;
}

function DeletionAction({config, descriptorId, children}) {
  const canDelete = config.canDelete;

  const dispatch = useDispatch();
  const onDelete = useCallback(() => {
    if(!canDelete) {
      return;
    }

    const action = deleteDescriptors({
      descriptorIds: [descriptorId],
      clearDataDocument: true
    });

    dispatch(action);
  }, [descriptorId, dispatch, canDelete]);

  return <>
    <DeleteComponent canDelete={canDelete} onDelete={onDelete}/>
    {children}
  </>;
}

export default function DescriptorActions({children, type, parentType, ...props}) {
  const newProps = useMemo(() => {
    const parentConfig = DESCRIPTOR_CONFIGURATION[parentType];
    const config = DESCRIPTOR_CONFIGURATION[type];
    const isWrapper = children !== undefined;

    return {
      ...props,
      parentConfig,
      config: config || {canDelete: false},
      isWrapper
    };
  }, [parentType, type, children, props]);

  if (!!!newProps.parentConfig || !!!newProps.config) {
    return children;
  }

  return <DeletionAction {...newProps}>
    <InsertionAction {...newProps}>
      {children}
    </InsertionAction>
  </DeletionAction>
;
}
