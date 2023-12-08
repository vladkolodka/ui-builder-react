import {useLayoutEffect, useCallback} from "react";
import DescriptorsContainer from "./DescriptorsContainer";
import {CONSTRUCTOR_MODE} from "./data/constants";
import {useDispatch, useSelector} from "react-redux";
import styled from "@emotion/styled";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {selectConstructorMode, setConstructorMode} from "./data/constructorSlice";
import DataDocumentHelper from "./helpers/DataDocumentHelper";
import TemplateInsertionHelper from "./helpers/TemplateInsertionHelper";
import DeletionHelper from "./helpers/DeletionHelper";
import MovementsHelper from "./helpers/MovementsHelper";
import SaveDocument from "./constructorComponents/save/SaveDocument";

const StyledSwitcher = styled.div`
  border: 2px dashed black;

  border-radius: 5px;
  background-color: white;
  display: inline-block;
  padding: 5px;

  position: fixed;
  right: 5px;
  top: 5px;
`;

function ConstructorModeSwitcher({mode}) {
  const dispatch = useDispatch();

  const handleModeChange = useCallback(e => {
    dispatch(setConstructorMode(e.target.value));
  }, [dispatch]);

  return <StyledSwitcher>
    <ToggleButtonGroup
      color="primary"
      value={mode}
      exclusive
      onChange={handleModeChange}
      aria-label="Platform">
      <ToggleButton value={CONSTRUCTOR_MODE.VIEW}>View Mode</ToggleButton>
      <ToggleButton value={CONSTRUCTOR_MODE.EDIT}>Edit Mode</ToggleButton>
    </ToggleButtonGroup>
  </StyledSwitcher>;
}

function useConstructorMode(initialMode) {
  const mode = useSelector(selectConstructorMode);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (mode === null) {
      dispatch(setConstructorMode(initialMode));
    }
  }, [initialMode, dispatch, mode]);

  return mode;
}

export default function Constructor({initialMode = CONSTRUCTOR_MODE.VIEW, allowModeSwitch = false}) {
  const mode = useConstructorMode(initialMode);

  return <>
    {allowModeSwitch && <ConstructorModeSwitcher mode={mode}/>}

    {mode === CONSTRUCTOR_MODE.EDIT && <div style={{border: "2px solid orange", margin: "10px"}}>
      <SaveDocument/>
      <TemplateInsertionHelper/>
      <DeletionHelper/>
      <MovementsHelper/>
    </div>}
    <DataDocumentHelper/>
    {mode !== null && <DescriptorsContainer mode={mode} parentId={null}/>}
  </>
}
