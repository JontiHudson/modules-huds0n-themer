import { TextStyle } from 'react-native';

import * as Types from '../../types';

import { formatStyle } from '../helper';
import { viewStyleMethods } from '../view/methods';

import { textStyleMethods } from './methods';

const styleMethods = { ...viewStyleMethods, ...textStyleMethods };

export function getThemeTextStyle<cT extends Types.CustomTheme>(
  Themer: Types.ThemerClass<cT>,
  props: Types.TextStyle<cT>,
): TextStyle | undefined {
  if (!props) return undefined;

  return formatStyle<cT>(Themer, props, styleMethods);
}
