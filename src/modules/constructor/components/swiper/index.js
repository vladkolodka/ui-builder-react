import {CAROUSEL} from 'modules/constructor/library/componentNames';
import * as ItemImport from './item'

import Edit from './EditSwiper';
import View from './ViewSwiper';

export const name = CAROUSEL;
export const Item = ItemImport;

const component = {Edit, View};

export default component;
