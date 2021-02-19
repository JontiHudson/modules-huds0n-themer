import { defaultTheme } from './defaults';
import * as Types from '../types';

export function combineThemeWithDefaults<cT extends Types.CustomTheme>(
  customTheme?: cT,
): Types.Theme<cT> {
  // @ts-ignore
  return {
    colors: { ...defaultTheme.colors, ...customTheme?.colors },
    dimensions: { ...defaultTheme.dimensions, ...customTheme?.dimensions },
    fontSizes: { ...defaultTheme.fontSizes, ...customTheme?.fontSizes },
    spacings: { ...defaultTheme.spacings, ...customTheme?.spacings },
  };
}

export * from './colors';
export * from './defaults';
export * from './dimensions';
export * from './fontSizes';
export * from './spacings';
