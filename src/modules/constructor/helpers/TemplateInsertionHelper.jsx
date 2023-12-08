import {useCallback, useState} from "react";
import TemplateBuilder from "../library/TemplateBuilder";
import * as components from "modules/constructor/library/componentNames";
import {useDispatch} from "react-redux";
import {insertDescriptors} from '../data/constructorSlice';

const templates = {
  'header': (args) => TemplateBuilder.forParent(args)
    .addDescriptor(components.HEADER)
    .build(),
  'list_with_items': (args) => TemplateBuilder.forParent(args)
    .addDescriptor(components.LIST)
    .withChildren(b => b
      .addDescriptor(components.LIST_ITEM)
      .addDescriptor(components.LIST_ITEM)
      .addDescriptor(components.LIST_ITEM)
    )
    .build()
};

export default function TemplateInsertionHelper() {
  const [parentId, setParentId] = useState('id_root');
  const [templateName, setTemplateName] = useState('');
  const [insertPosition, setInsertPosition] = useState(-1);

  const dispatch = useDispatch();

  const onInsert = useCallback(() => {
    if (parentId === '' || templateName === '') {
      alert('Please set parent ID and template');
      return;
    }

    let template = templates[templateName]({parentId});

    console.log(template);

    dispatch(insertDescriptors({
      ...template,
      parentId,
      insertPosition
    }));

    console.log('insert', parentId, templateName);
  }, [parentId, templateName, dispatch, insertPosition]);

  return <div style={{border: '1px solid black'}}>
    Insert:
    <input type="text" value={parentId} onChange={e => setParentId(e.target.value)}
           placeholder="Parent ID"/>

    <input type="number" min="-1" value={insertPosition} onChange={e => setInsertPosition(parseInt(e.target.value))} />

    <select onChange={e => setTemplateName(e.target.value)}>
      <option value="">Please select template</option>

      {Object.keys(templates).map(templateName =>
        <option key={templateName} value={templateName}>{templateName}</option>)}
    </select>
    <button onClick={onInsert}>Insert</button>
  </div>;
}
