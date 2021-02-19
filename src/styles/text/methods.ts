import { addEnumerableGetter } from '@huds0n/utilities';

import { getThemeColor, getThemeFontSize } from '../../theme';
import * as Types from '../../types';

export const textStyleMethods: Types.HoC.Text.Methods<Types.CustomTheme> = {
  color: (value, Themer) =>
    addEnumerableGetter({} as any, 'color', () => getThemeColor(Themer, value)),
  fontSize: (value, Themer) => ({
    fontSize: getThemeFontSize(Themer, value),
  }),
  textShadow: (shadowProps, Themer) => {
    if (shadowProps === true) {
      return addEnumerableGetter(
        {
          textShadowOffset: {
            width: 1,
            height: 1,
          },
          textShadowRadius: 1,
        } as any,
        'textShadowColor',
        () => getThemeColor(Themer, 'BLACK'),
      );
    } else if (typeof shadowProps === 'object') {
      const {
        color = 'BLACK',
        offset = 1,
        offsetX,
        offsetY,
        radius = 1,
      } = shadowProps;

      return addEnumerableGetter(
        {
          shadowOffset: {
            width: offsetX || offset,
            height: offsetY || offset,
          },
          shadowRadius: radius,
        } as any,
        'textShadowColor',
        () => getThemeColor(Themer, color),
      );
    }
    return {};
  },
};
