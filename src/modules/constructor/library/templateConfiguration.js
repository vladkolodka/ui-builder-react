import * as templates from './templateNames';
import TemplateBuilder from "./TemplateBuilder";
import * as components from "./componentNames";

const TEMPLATE_CONFIGURATION = {
  [templates.HEADER]: {
    template: args => TemplateBuilder.forParent(args).addDescriptor(components.HEADER).build()
  },
  [templates.LIST_WITH_ITEMS]: {
    template: args => TemplateBuilder.forParent(args)
      .addDescriptor(components.LIST)
      .withChildren(b => b
        .addDescriptor(components.LIST_ITEM)
        .addDescriptor(components.LIST_ITEM)
        .addDescriptor(components.LIST_ITEM)
      )
      .build()
  },
  [templates.LIST_ITEM]: {
    template: args => TemplateBuilder.forParent(args).addDescriptor(components.LIST_ITEM).build()
  },
  [templates.GROUP]: {
    template: args => TemplateBuilder.forParent(args).addDescriptor(components.GROUP).build()
  }
};

export default TEMPLATE_CONFIGURATION;
