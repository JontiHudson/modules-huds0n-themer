import { combineThemeWithDefaults } from './theme';
import { Themer } from './ThemerClass';
import * as Types from './types';

export function createThemer<
  cT extends Types.CustomTheme
>(): Types.ThemerClass<{}>;
export function createThemer<cT extends Types.CustomTheme>(
  theme: cT,
): Types.ThemerClass<cT>;
export function createThemer<cT extends Types.CustomTheme>(
  theme?: cT,
): Types.ThemerClass<cT | {}> {
  const themeWithDefaults = combineThemeWithDefaults(theme);

  // @ts-ignore
  return new Themer<Types.Theme<cT>>(themeWithDefaults);
}
