import {useMemo} from 'react';
import {useSelector} from 'react-redux';
import {selectDescriptorsOnLevel, selectDescriptors} from 'modules/constructor/data/constructorSlice'

/***
 * Selects all descriptor on a specific level
 * @param levelId id of the descriptor indicating the level
 * @returns Descriptors list
 */
export default function useDescriptorsOnLevel(levelId) {
  const descriptorsOnLevel = useSelector(s => selectDescriptorsOnLevel(s, levelId));
  const allDescriptors = useSelector(selectDescriptors);

  return useMemo(() => descriptorsOnLevel.map(id => ({
    id,
    type: allDescriptors[id].component.name
  })), [descriptorsOnLevel, allDescriptors]);
}
