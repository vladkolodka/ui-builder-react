import {defaultConfiguration, defaultParameterOptions} from './defaults';
import {ALLOW_EVERYTHING} from './constants';

function isContainer(descriptorDefinition) {
  if (descriptorDefinition.isCollection === true || descriptorDefinition.allowedChildren === ALLOW_EVERYTHING) {
    return true;
  }
  return Array.isArray(descriptorDefinition.allowedChildren) && descriptorDefinition.allowedChildren.length > 0;
}

export function defineDescriptor(componentOrGroup, parameters = {}, configuration = {}) {
  parameters = parameters || {};

  let descriptorDefinition = {
    name: componentOrGroup.name,

    parameters: Object.keys(parameters).reduce((result, key) => {
      result[key] = {...defaultParameterOptions, ...parameters[key]}
      return result;
    }, {}),

    ...defaultConfiguration,
    ...configuration
  };

  if (typeof componentOrGroup.default === 'function') {
    // single component for view and edit modes
    descriptorDefinition.component = componentOrGroup.default;
    descriptorDefinition.isMonoMode = true;
  } else {
    descriptorDefinition.components = {
      Editor: componentOrGroup.default.Edit,
      Viewer: componentOrGroup.default.View
    };
  }

  descriptorDefinition.isContainer = isContainer(descriptorDefinition);

  return descriptorDefinition;
}
