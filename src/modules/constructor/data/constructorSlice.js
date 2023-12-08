import {createSelector, createSlice, createAction} from '@reduxjs/toolkit';
import jp from 'jsonpath';

import DescriptorOperations from "./DescriptorOperations";

const initialState = {
  descriptors: {},
  parentChildrenIndex: {},
  bindings: {},
  dataCache: {},

  data: {},
  version: 0,
  mode: null
};

const reducerName = 'code_constructor';

const cleanupFn = () => undefined;

export function addConstructorReducer(rootReducer) {
  rootReducer[reducerName] = constructorSlice.reducer;
}

// TODO move to operations
function getDescriptorRoots(descriptorIds, descriptorMap) {
  const idsToInsert = new Set(descriptorIds);
  const rootIds = [];

  for (const descriptorId of descriptorIds) {
    let parentDescriptorId = descriptorMap[descriptorId].parentId;

    while (!!parentDescriptorId) {
      if (idsToInsert.has(parentDescriptorId)) {
        break;
      } else {

        parentDescriptorId = !!descriptorMap[parentDescriptorId]
          ? descriptorMap[parentDescriptorId].parentId
          : null;
      }
    }

    if (!!!parentDescriptorId) {
      rootIds.push(descriptorId);
    }
  }

  return rootIds;
}

export const constructorSlice = createSlice({
  name: reducerName,
  initialState,

  reducers: {
    reset: (prevState, action) => {
      const {fullReset = true} = action.payload || {};

      return ({
        ...initialState,
        ...(fullReset === true ? {} : {mode: prevState.mode})
      });
    },

    setConstructorMode: (state, action) => {
      state.mode = action.payload;
    },

    setDocument: (state, action) => {
      const {descriptors, version, data} = action.payload;

      state.version = version;
      state.data = data;

      DescriptorOperations.buildMap(descriptors, state.descriptors);

      const pcIndex = DescriptorOperations.buildPCIndex(descriptors, state.parentChildrenIndex);
      DescriptorOperations.reorderPCIndex(pcIndex, state.descriptors);

      DescriptorOperations.calculateBindingExpressions(null, state.descriptors, state.parentChildrenIndex, state.bindings);
      DescriptorOperations.allocateDataCache(state.data, state.bindings, state.dataCache);
    },

    insertDescriptors: (state, action) => {
      const {templateName, position} = action.payload;
      const parentId = position.parentId;

      let {descriptors, rootIds} = action.payload;
      // TODO do I need to validate descriptors length and parent descriptor type?

      // build descriptors from template
      if (!!templateName) {
        ({
          rootIds,
          descriptors
        } = DescriptorOperations.buildTemplate(templateName, parentId, state.descriptors, state.parentChildrenIndex));
      }

      DescriptorOperations.buildMap(descriptors, state.descriptors);

      const insertPosition = DescriptorOperations.calculateLevelInsertionPosition(position, state.parentChildrenIndex);
      DescriptorOperations.insertChainAtPosition(parentId, rootIds, insertPosition, state.descriptors, state.parentChildrenIndex);

      // this is just for building index for the nested descriptors
      DescriptorOperations.buildPCIndex(descriptors, state.parentChildrenIndex, new Set([parentId]));
      DescriptorOperations.calculateBindingExpressions(rootIds, state.descriptors, state.parentChildrenIndex, state.bindings);

      const newBindings = descriptors.map(d => state.bindings[d.id]);
      DescriptorOperations.allocateDataCache(state.data, newBindings, state.dataCache);
    },

    // TODO refactor to methods
    deleteDescriptors: (state, {payload}) => {
      const {descriptorIds, clearDataDocument = false} = payload;

      // get all descriptors down the hierarchy
      const [
        descriptorsToDelete,
        indexLevelsToDelete
      ] = DescriptorOperations.scanDescriptorLevelHierarchy(descriptorIds, state.descriptors, state.parentChildrenIndex);

      // delete descriptors or entire levels from the parentChildrenIndex. Relink descriptors in map
      DescriptorOperations.deleteDescriptorsFromParentChildrenIndex(descriptorsToDelete, indexLevelsToDelete, state.descriptors, state.parentChildrenIndex);

      // clear descriptor map, bindings, data cache and the data document
      for (const descriptorId of descriptorsToDelete) {
        const binding = state.bindings[descriptorId];

        delete state.descriptors[descriptorId];
        delete state.bindings[descriptorId];

        if (clearDataDocument) {
          delete state.dataCache[binding];
          jp.apply(state.data, binding === "$" ? "*" : binding, cleanupFn);
        }
      }
    },

    moveDescriptors: (state, {payload}) => {
      const {position, descriptorIds, respectHierarchy = true} = payload;

      const rootIds = respectHierarchy
        ? getDescriptorRoots(descriptorIds, state.descriptors)
        : descriptorIds;

      for (let i = 0; i < rootIds.length; i++) {
        const descriptorId = rootIds[i];
        const descriptor = state.descriptors[descriptorId];

        if (i === 0) {
          delete descriptor.prevId;
        } else {
          descriptor.prevId = rootIds[i - 1];
        }

        descriptor.binding = state.bindings[descriptorId];
      }

      DescriptorOperations.deleteDescriptorsFromParentChildrenIndex(rootIds, new Set(), state.descriptors, state.parentChildrenIndex);

      const insertPosition = DescriptorOperations.calculateLevelInsertionPosition(position, state.parentChildrenIndex);
      DescriptorOperations.insertChainAtPosition(position.parentId, rootIds, insertPosition, state.descriptors, state.parentChildrenIndex);
    },
    // TODO delete only from root levels

    setDescriptorParameter: (state, action) => {
      const {descriptorId, parameterName, parameterValue} = action.payload;

      if (state.descriptors[descriptorId].component.parameters === undefined) {
        state.descriptors[descriptorId].component.parameters = {};
      }

      state.descriptors[descriptorId].component.parameters[parameterName] = parameterValue;
    },

    setDataItem: (state, {payload: {descriptorId, value}}) => {
      const binding = state.bindings[descriptorId];
      state.dataCache[binding] = value;

      jp.value(state.data, binding, value);

      // TODO do I need to update parent cache(s) ?
    }
  },
});

export const {
  reset,
  setDocument,
  setDescriptorParameter,
  setConstructorMode,
  setDataItem,
  insertDescriptors,
  deleteDescriptors,
  moveDescriptors
} = constructorSlice.actions;
export const loadDescriptors = createAction(`${reducerName}/loadDescriptors`);

export const saveDescriptors = createAction(`${reducerName}/saveDescriptors`);

const selectReducer = state => state[reducerName];

export const selectConstructorMode = createSelector([selectReducer], s => s.mode);

export const selectDescriptors = createSelector([selectReducer], s => s.descriptors);
export const selectVersion = createSelector([selectReducer], s => s.version);

export const selectDataDocument = createSelector([selectReducer], s => s.data);

const emptyLevel = [];
export const selectDescriptorsOnLevel = createSelector(selectReducer, (_, levelId) => levelId,
  (state, levelId) => state.parentChildrenIndex[levelId] || emptyLevel);

const emptyParameters = {};
export const selectDescriptorParameters = createSelector([selectReducer, (_, descriptorId) => descriptorId],
  (state, descriptorId) => state.descriptors[descriptorId].component.parameters || emptyParameters);

export const selectDataDocumentValue = createSelector(selectReducer, (_, descriptorId) => descriptorId,
  (state, descriptorId) => state.dataCache[state.bindings[descriptorId]]);
