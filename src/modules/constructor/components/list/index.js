import {LIST} from 'modules/constructor/library/componentNames';

import * as ItemImport from './item'
import * as constantsImport from './constants';

import Edit from './EditList';
import View from './ViewList';

export const name = LIST;
export const constants = constantsImport;
export const Item = ItemImport;
const component = {Edit, View};

export default component;

