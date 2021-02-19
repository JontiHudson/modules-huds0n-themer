import Error from '@huds0n/error';

import * as Types from '../types';

export function getThemeDimension<cT extends Types.CustomTheme>(
  Themer: Types.ThemerClass<cT>,
  value: Types.Dimension<cT>,
) {
  if (typeof value === 'number') return value;

  // @ts-ignore
  const { dimensions } = Themer._theme;

  if (typeof value === 'string') {
    const dimension = dimensions[value];
    if (typeof dimension === 'number' || typeof dimension === 'string')
      return dimension;
  }

  throw new Error({
    name: 'Themer Error',
    code: 'SPACING_NOT_FOUND',
    message: 'Dimension not found',
    severity: 'HIGH',
    info: {
      dimensionName: value,
      availableDimensions: Object.keys(dimensions),
    },
  });
}
