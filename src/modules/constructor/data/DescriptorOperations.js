/*
To whoever will be making modifications to this file, my message to you is: keep going, best wishes, and don't forget to stay positive!
-- Vlad.
*/

import jp from "jsonpath";
import TEMPLATE_CONFIGURATION from "../library/templateConfiguration";
import DESCRIPTOR_CONFIGURATION from "../library/descriptorConfiguration";

export default class DescriptorOperations {

  /***
   * Creates a key->value collection where key is the descriptor id and value is the descriptor itself
   * @param descriptorsList list of descriptor objects from the server
   * @param targetMap target map
   * @returns {*}
   */
  static buildMap(descriptorsList, targetMap = {}) {
    return descriptorsList.reduce((byId, descriptor) => {
      byId[descriptor.id] = descriptor;
      return byId
    }, targetMap);
  }

  /***
   * Builds Parent->Children relations index
   * @param descriptorsList list of descriptor objects from the server
   * @param index initial index
   * @param ignoreLevels parent ids to ignore
   * @returns {{levels, relations, pcIndex}}
   */
  static buildPCIndex(descriptorsList, index = {}, ignoreLevels = new Set()) {
    const levels = new Set();
    const relations = new Map();

    descriptorsList.forEach(descriptor => {
      if (!!descriptor.prevId) {
        levels.add(descriptor.parentId);
        relations.set(descriptor.prevId, descriptor.id);
      }

      if (descriptor.parentId !== undefined && !ignoreLevels.has(descriptor.parentId)) {
        index[descriptor.parentId] = index[descriptor.parentId] || [];
        index[descriptor.parentId].push(descriptor.id);
      }
    });

    return {index, levels, relations};
  }

  /***
   * Puts descriptors on each nesting level in the correct order
   * @param pcIndex parentChildren index and relations information
   * @param descriptorsMap key-value descriptors map
   */
  static reorderPCIndex(pcIndex, descriptorsMap) {
    const {levels, relations, index} = pcIndex;

    /* TODO calculate relations when they are not calculated?
     Sometimes it could be easier to set links for the entire level based on the index instead of manually setting them
     in case of insertions, deletions, etc.
     But this can be less efficient.
     */

    for (const levelId of Array.from(levels)) {
      const levelIndex = index[levelId];
      const newLevelIndex = [];

      for (let i = 0; i < levelIndex.length; i++) {
        const descriptor = descriptorsMap[levelIndex[i]];

        // descriptor is part of the chain
        if (!!descriptor.prevId) {
          continue;
        }

        if (relations.has(descriptor.id)) {
          // chain root

          let idCursor = descriptor.id;

          while (idCursor !== undefined) {
            newLevelIndex.push(idCursor);
            idCursor = relations.get(idCursor);
          }

        } else {
          // anchor

          newLevelIndex.push(descriptor.id);
        }
      }

      index[levelId] = newLevelIndex;
    }
  }

  /***
   * For each descriptor builds a key->value collection, where key is descriptor id  and value is a calculated
   * binding expression for that descriptor
   * @param descriptorIds
   * @param descriptorsMap
   * @param parentChildrenIndex
   * @param bindings map
   * @returns {{}}
   */
  static calculateBindingExpressions(descriptorIds, descriptorsMap, parentChildrenIndex, bindings = {}) {
    function calculateBinding(descriptor, bindingsCollection) {
      // binding is not set
      if (!!!descriptor.binding) {

        if (descriptor.parentId !== null) {
          return bindingsCollection[descriptor.parentId];
        }

        return '$';
      }

      if (descriptor.binding.startsWith('$')) {
        return bindingsCollection[descriptor.id] = descriptor.binding; // binding from root
      }

      if (!!!descriptor.parentId) {
        return `$.${descriptor.binding}`;
      }

      return descriptor.binding.startsWith('[')
        ? `${bindingsCollection[descriptor.parentId]}${descriptor.binding}`
        : `${bindingsCollection[descriptor.parentId]}.${descriptor.binding}`;
    }

    if (Object.keys(parentChildrenIndex).length === 0) {
      return bindings;
    }

    let toDoStack = descriptorIds === null
      ? [...parentChildrenIndex[null]]
      : descriptorIds;

    for (let i = 0; i < toDoStack.length; i++) {
      let descriptor = descriptorsMap[toDoStack[i]];

      // if descriptor has children
      if (parentChildrenIndex[descriptor.id] !== undefined) {
        toDoStack.push(...parentChildrenIndex[descriptor.id]);
      }

      bindings[descriptor.id] = calculateBinding(descriptor, bindings);
    }

    return bindings;
  }

  /***
   * For each binding queries the data document and stores the value.
   * Returns a key->value collection where key is binding and value is query result
   * @param dataDocument data document
   * @param bindingExpressions binding expressions
   * @param cache data cache
   * @returns {unknown}
   */
  static allocateDataCache(dataDocument, bindingExpressions, cache = {}) {
    return Object.values(bindingExpressions).reduce((c, binding) => {
      c[binding] = jp.value(dataDocument, binding);
      return c;
    }, cache);
  }

  /***
   * Based on the insertion index and the previous descriptor id, calculates the insertion position in the level
   * @param placementConfig desired position configuration
   * @param parentChildrenIndex parent->children index
   * @returns {number} insertion position integer for the level
   */
  static calculateLevelInsertionPosition(placementConfig, parentChildrenIndex) {
    const {parentId, insertPosition = -1, insertAfterDescriptor = ''} = placementConfig;

    let index = insertPosition;

    if (insertAfterDescriptor !== '') {
      if (insertAfterDescriptor === null) {
        index = 0;
      }

      const searchIndex = parentChildrenIndex[parentId].indexOf(insertAfterDescriptor);

      if (searchIndex !== -1) {
        index = searchIndex + 1;
      }
    }

    return index;
  }

  /***
   * Inserts a new descriptor chain at the specified position
   * @param parentId parent id
   * @param newDescriptorsChainIds new descriptors chain to insert
   * @param insertPosition insertion position integer
   * @param descriptorMap key->value descriptors map
   * @param parentChildrenIndex parent->children index (PCIndex)
   */
  static insertChainAtPosition(parentId, newDescriptorsChainIds, insertPosition, descriptorMap, parentChildrenIndex) {
    // if the level is empty
    if (parentChildrenIndex[parentId] === undefined) {
      parentChildrenIndex[parentId] = [];
    }

    // TODO descriptors connection?

    const indexLevel = parentChildrenIndex[parentId];

    // insert at the end
    if (insertPosition === -1) {
      insertPosition = indexLevel.length;
    }

    // we need to create links with siblings descriptors on the level
    if (indexLevel.length !== 0) {

      // new descriptor chain should go after existing descriptors
      if (insertPosition > 0) {
        const prevDescriptorPosition = insertPosition - 1;

        // link the first descriptor in the chain with the previous descriptor on the level
        descriptorMap[newDescriptorsChainIds[0]].prevId =
          descriptorMap[indexLevel[prevDescriptorPosition]].id
      }

      // there are some existing descriptors on the level that should go after the new chain
      if (insertPosition < indexLevel.length) {
        // link the descriptor that goes after the new chain to the last element of the descriptor chain
        descriptorMap[indexLevel[insertPosition]].prevId = newDescriptorsChainIds[newDescriptorsChainIds.length - 1]
      }

      indexLevel.splice(insertPosition, 0, ...newDescriptorsChainIds);
    } else {
      // as the level is empty, we just add the new chain to the level
      indexLevel.push(...newDescriptorsChainIds);
    }
  }

  /***
   * Builds a descriptor chain from the given template by templateName
   * @param templateName template name
   * @param parentId parent id
   * @param descriptorsMap key->value descriptors map
   * @param parentChildrenIndex parent->children index (PCIndex)
   * @returns {descriptors,rootIds}
   */
  static buildTemplate(templateName, parentId, descriptorsMap, parentChildrenIndex) {
    let template = TEMPLATE_CONFIGURATION[templateName].template;

    let binding = null;

    const isCollection = parentId === null
      ? false
      : DESCRIPTOR_CONFIGURATION[descriptorsMap[parentId].component.name].isCollection;

    if (isCollection) {
      binding = Array.isArray(parentChildrenIndex[parentId])
        ? parentChildrenIndex[parentId].filter(id => descriptorsMap[id].binding.startsWith("[")).length
        : 0;
    }

    return template({parentId, binding});
  }

  /***
   * Scans the descriptor hierarchy from the given roots to the bottom and returns the list of all found descriptors
   * @param descriptorIds List of descriptor ids. So-called roots from which the method will start scanning the hierarchy to the bottom
   * @param descriptorMap descriptor key->value object
   * @param parentChildrenIndex PCIndex
   * @returns {(*[]|Set<unknown>)[]} Array of descriptor ids and set of level ids (parent descriptor ids)
   */
  static scanDescriptorLevelHierarchy(descriptorIds, descriptorMap, parentChildrenIndex) {
    const fountDescriptorIds = [...descriptorIds];
    const levels = new Set();

    for (let i = 0; i < fountDescriptorIds.length; i++) {
      let descriptor = descriptorMap[fountDescriptorIds[i]];

      if (parentChildrenIndex[descriptor.id] !== undefined) {
        levels.add(descriptor.id);
        fountDescriptorIds.push(...parentChildrenIndex[descriptor.id]);
      }
    }

    return [fountDescriptorIds, levels];
  }

  /***
   * Groups descriptors IDs by their parent id
   * @param descriptorIds array of descriptor ids
   * @param descriptorMap descriptor key->value object
   * @returns {*} grouping object
   */
  static groupDescriptorsByParent(descriptorIds, descriptorMap) {
    return descriptorIds.reduce((res, id) => {
      const parentId = descriptorMap[id].parentId || null;

      res[parentId] = (res[parentId] || new Set()).add(id);

      return res;
    }, {});
  }

  /***
   * Deletes the descriptor with the given id from the PCIndex level
   * @param descriptorToDeleteId descriptor id to delete
   * @param parentId parent id
   * @param descriptorsMap descriptor key->value object
   * @param parentChildrenIndex PCIndex
   */
  static deleteSingleDescriptorOnLevel(descriptorToDeleteId, parentId, descriptorsMap, parentChildrenIndex) {
    // manually delete descriptor from level and relink descriptors in the map

    const index = parentChildrenIndex[parentId].indexOf(descriptorToDeleteId);

    if (parentChildrenIndex[parentId].length > 1) {
      // the descriptor-for-deletion is not the only descriptor on the level

      const nextIndex = index + 1;

      const prevDescriptorId = parentChildrenIndex[parentId][index - 1];
      const nextDescriptorId = parentChildrenIndex[parentId][nextIndex];

      if (index === 0) {
        // deletion of the first descriptor on the level
        delete descriptorsMap[nextDescriptorId].prevId;
      } else {
        if (nextIndex < parentChildrenIndex[parentId].length && !!descriptorsMap[nextDescriptorId].prevId) {
          descriptorsMap[nextDescriptorId].prevId = prevDescriptorId;
        }
      }

      parentChildrenIndex[parentId].splice(index, 1);
    } else {
      // the descriptor-for-deletion is the only descriptor on the level
      delete parentChildrenIndex[parentId];
    }
  }

  /***
   * Deletes multiple descriptors from the PCIndex level
   * @param descriptorsToDelete set of descriptor ids to delete
   * @param parentId parent id
   * @param descriptorsMap descriptor key->value object
   * @param parentChildrenIndex PCIndex
   */
  static deleteMultipleDescriptorsOnLevel(descriptorsToDelete, parentId, descriptorsMap, parentChildrenIndex) {
    let prevId = null;

    parentChildrenIndex[parentId] = parentChildrenIndex[parentId].filter(id => {

        if (!descriptorsToDelete.has(id)) {
          // the descriptor is not for deletion

          if (prevId === null) {
            // the descriptor is the first descriptor on the level

            delete descriptorsMap[id].prevId;
          } else {
            if (!!descriptorsMap[id].prevId && descriptorsMap[id].prevId !== prevId) {
              // relink the descriptor to the previous descriptor if it has relation and it is not equal to the previous descriptor
              descriptorsMap[id].prevId = prevId;
            }
          }

          prevId = id;

          // keep descriptor
          return true;
        }

        // delete descriptor
        return false;
      }
    );
  }

  /***
   * Deletes descriptors from the PCIndex
   * @param descriptorIds array of descriptor ids to delete
   * @param indexLevelsToDelete set of level ids (parent descriptor ids) to delete
   * @param descriptorsMap descriptor key->value object
   * @param parentChildrenIndex PCIndex
   */
  static deleteDescriptorsFromParentChildrenIndex(descriptorIds, indexLevelsToDelete, descriptorsMap, parentChildrenIndex) {

    const descriptorsToDeleteByParent = DescriptorOperations.groupDescriptorsByParent(descriptorIds, descriptorsMap);

    // delete descriptors or entire levels from the parentChildrenIndex
    for (const parentId in descriptorsToDeleteByParent) {
      if (indexLevelsToDelete.has(parentId)) {
        // the level itself will be completely deleted, no need to relink descriptors in map

        delete parentChildrenIndex[parentId];
      } else {

        /*
        Individual descriptors should be deleted on the parent level this is done for optimization, if
        the descriptor is the only descriptor on the level to delete then there is no need to rebuild the full level
        */
        if (descriptorsToDeleteByParent[parentId].size === 1) {
          // manually delete descriptor from level and relink descriptors in the map
          const [descriptorToDeleteId] = descriptorsToDeleteByParent[parentId];
          DescriptorOperations.deleteSingleDescriptorOnLevel(descriptorToDeleteId, parentId, descriptorsMap, parentChildrenIndex);
        } else {
          // recreate the level my ignoring descriptors-to-remove and relink descriptors in map
          DescriptorOperations.deleteMultipleDescriptorsOnLevel(descriptorsToDeleteByParent[parentId], parentId, descriptorsMap, parentChildrenIndex);
        }
      }
    }
  }
}
