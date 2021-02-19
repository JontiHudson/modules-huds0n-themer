import Error from '@huds0n/error';

import * as Types from '../types';

export function getThemeFontSize<cT extends Types.CustomTheme>(
  Themer: Types.ThemerClass<cT>,
  value: Types.FontSize<cT>,
) {
  if (typeof value === 'number') return value;

  // @ts-ignore
  const { fontSizes } = Themer._theme;

  if (typeof value === 'string') {
    const fontSize = fontSizes[value];
    if (typeof fontSize === 'number') return fontSize;
  }

  throw new Error({
    name: 'Themer Error',
    code: 'FONT_SIZE_NOT_FOUND',
    message: 'FontSize not found',
    severity: 'HIGH',
    info: { fontSizeName: value, availableFontSizes: Object.keys(fontSizes) },
  });
}
