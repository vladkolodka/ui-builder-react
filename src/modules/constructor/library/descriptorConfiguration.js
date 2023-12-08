import * as components from '../components';
import * as templateNames from "./templateNames";
import {defineDescriptor} from './utils';
import {ALLOW_EVERYTHING} from "./constants";
import {defaultConfiguration} from "./defaults";

const DESCRIPTOR_CONFIGURATION = {
  // root level
  [null]: {
    ...defaultConfiguration,
    isContainer: true,
    allowedChildren: ALLOW_EVERYTHING,
    canDelete: false,
    canMove: false,
  },

  [components.Group.name]: defineDescriptor(components.Group, null, {
    allowedChildren: ALLOW_EVERYTHING
  }),

  [components.Header.name]: defineDescriptor(components.Header, {
    "level": {
      default: 1
    }
  }),
  [components.Text.name]: defineDescriptor(components.Text),

  // Carousel

  [components.Swiper.name]: defineDescriptor(components.Swiper, {}, {
    isCollection: true
  }),
  [components.Swiper.Item.name]: defineDescriptor(components.Swiper.Item),

  // List

  [components.List.name]: defineDescriptor(components.List, {
    "viewMode": {
      default: components.List.constants.VIEW_MODE.STANDARD,
      shouldPropagate: true
    }
  }, {
    // canDelete: false,
    isCollection: true,
    allowedChildren: [
      templateNames.LIST_ITEM
    ]
  }),
  [components.List.Item.name]: defineDescriptor(components.List.Item),

  [components.MonoComponent.name]: defineDescriptor(components.MonoComponent),
};
export default DESCRIPTOR_CONFIGURATION;
