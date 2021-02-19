import Error from '@huds0n/error';

import * as Types from '../types';

export function getThemeColor<cT extends Types.CustomTheme>(
  Themer: Types.ThemerClass<cT>,
  value: Types.Color<cT>,
) {
  if (!value) return undefined;

  // @ts-ignore
  const { colors } = Themer._theme;

  if (typeof value === 'string') {
    const color = colors[value];
    if (typeof color === 'string') return color;
  }

  throw new Error({
    name: 'Themer Error',
    code: 'COLOR_NOT_FOUND',
    message: 'Color not found',
    severity: 'HIGH',
    info: {
      availableColors: Object.keys(colors),
      colorName: value,
    },
  });
}
