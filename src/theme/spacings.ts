import Error from '@huds0n/error';

import * as Types from '../types';

export function getThemeSpacing<cT extends Types.CustomTheme>(
  Themer: Types.ThemerClass<cT>,
  value: Types.Spacing<cT>,
) {
  if (!value) return 0;

  if (typeof value === 'number') return value;

  // @ts-ignore
  const { spacings } = Themer._theme;

  if (typeof value === 'string') {
    const spacing = spacings[value];
    if (typeof spacing === 'number') return spacing;
  }

  throw new Error({
    name: 'Themer Error',
    code: 'SPACING_NOT_FOUND',
    message: 'Spacing not found',
    severity: 'HIGH',
    info: { spacingName: value, availableSpacings: Object.keys(spacings) },
  });
}
