import { PressableStateCallbackType, ViewStyle } from 'react-native';

import * as Types from '../../types';

import { formatStyle } from '../helper';

import { viewStyleMethods } from './methods';

export function getThemeViewStyle<cT extends Types.CustomTheme>(
  Themer: Types.ThemerClass<cT>,
  props: Types.HoC.View.Props<cT>,
): ViewStyle | undefined {
  if (!props) return undefined;

  return formatStyle<cT>(Themer, props, viewStyleMethods);
}

export function getThemePressStyle<cT extends Types.CustomTheme>(
  Themer: Types.ThemerClass<cT>,
  props: Types.HoC.View.PressProps<cT>,
) {
  if (typeof props === 'function') {
    return (pressState: PressableStateCallbackType) =>
      getThemeViewStyle<cT>(Themer, props(pressState));
  }

  return getThemeViewStyle<cT>(Themer, props);
}
