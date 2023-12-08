import DESCRIPTOR_CONFIGURATION from './descriptorConfiguration';

export default class TemplateBuilder {
  #descriptors = [];
  #childDescriptors = [];
  #parentDescriptorId;
  #customBinding;
  #nestingLevel;
  #parentDescriptorName;

  get latestDescriptor() {
    return this.#descriptors[this.#descriptors.length - 1];
  }

  // private constructor. use forParent() static method instead
  constructor(parentId, customBinding, nestingLevel, parentDescriptorType) {
    this.#parentDescriptorId = parentId;
    this.#customBinding = customBinding;
    this.#nestingLevel = nestingLevel;
    this.#parentDescriptorName = parentDescriptorType;
  }

  static forParent({parentId, binding = null}) {
    return new this(parentId, binding, 0, null);
  }

  addDescriptor(name) {
    const newId = this.#newDescriptorId();

    const newDescriptor = {
      id: newId,
      component: {
        name
      },
      binding: this.#calculateBinding(name),
      parentId: this.#parentDescriptorId
    };

    if (this.#descriptors.length !== 0) {
      newDescriptor.prevId = this.#descriptors[this.#descriptors.length - 1].id;
    }

    this.#descriptors.push(newDescriptor);
    return this;
  }

  withChildren(builderDelegate) {
    let parentDescriptor = this.latestDescriptor;

    if (parentDescriptor === undefined) {
      throw new Error("Can't add children for non-defined descriptor");
    }

    let nestedBuilder = new TemplateBuilder(parentDescriptor.id, null,
      this.#nestingLevel + 1, parentDescriptor.component.name);

    builderDelegate(nestedBuilder);

    let descriptors = nestedBuilder instanceof TemplateBuilder
      ? nestedBuilder.build().descriptors
      : nestedBuilder; // already built

    this.#childDescriptors.push(...descriptors);

    return this;
  }

  build(buildRoots = true) {
    const descriptors = [...this.#descriptors, ...this.#childDescriptors];
    const rootIds = buildRoots ? this.#descriptors.map(d => d.id) : null;

    return {rootIds, descriptors};
  }

  #newDescriptorId(size = 6) {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return Array.from({length: size}, () => S4()).join('');
  }

  #calculateBinding(newDescriptorName) {
    if (this.#nestingLevel === 0) {
      // root level

      // if custom binding defined
      if (!!this.#customBinding || this.#customBinding === '') {
        if (typeof this.#customBinding === 'number') {
          return `[${this.#customBinding + this.#descriptors.length}]`;
        }

        return this.#customBinding;
      }
    } else {
      const descriptorConfiguration = DESCRIPTOR_CONFIGURATION[newDescriptorName];
      const parentDescriptorConfiguration = DESCRIPTOR_CONFIGURATION[this.#parentDescriptorName];

      if (!!descriptorConfiguration.defaultBinding) {
        if(parentDescriptorConfiguration.isCollection) {
          return `[${this.#descriptors.length}].${descriptorConfiguration.defaultBinding}`;
        }

        return descriptorConfiguration.defaultBinding;
      }

      if(parentDescriptorConfiguration.isCollection) {
        return `[${this.#descriptors.length}]`;
      }
      else if(descriptorConfiguration.defaultBinding === ''){
        return '';
      }

    }

    return `${newDescriptorName}_${this.#newDescriptorId(4)}`;
  }
}
