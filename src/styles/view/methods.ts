import { addEnumerableGetter } from '@huds0n/utilities';

import { getThemeColor, getThemeDimension, getThemeSpacing } from '../../theme';
import * as Types from '../../types';

function getColorMethod<cT extends Types.CustomTheme>(
  key: string,
): Types.HoC.View.MethodFns.ColorFn<cT> {
  return (value, Themer) =>
    addEnumerableGetter({} as any, key, () => getThemeColor<cT>(Themer, value));
}

function getDimensionMethod<cT extends Types.CustomTheme>(
  key: string,
): Types.HoC.View.MethodFns.DimensionFn<cT> {
  return (value, Themer) => ({ [key]: getThemeDimension(Themer, value) });
}

function getSpacingMethod<cT extends Types.CustomTheme>(
  key: string,
): Types.HoC.View.MethodFns.SpacingFn<cT> {
  return (value, Themer) => ({ [key]: getThemeSpacing(Themer, value) });
}

function getShadowMethod<
  cT extends Types.CustomTheme
>(): Types.HoC.View.MethodFns.ShadowFn<cT> {
  return (shadowProps, Themer) => {
    if (shadowProps === true) {
      return addEnumerableGetter(
        {
          shadowOffset: {
            width: 1,
            height: 1,
          },
          shadowOpacity: 1,
          shadowRadius: 1,
        } as any,
        'shadowColor',
        () => getThemeColor(Themer, 'BLACK'),
      );
    } else if (typeof shadowProps === 'object') {
      const {
        color = 'BLACK',
        offset = 1,
        offsetX,
        offsetY,
        opacity = 1,
        radius = 1,
      } = shadowProps;

      return addEnumerableGetter(
        {
          shadowOffset: {
            width: offsetX || offset,
            height: offsetY || offset,
          },
          shadowOpacity: opacity,
          shadowRadius: radius,
        } as any,
        'shadowColor',
        () => getThemeColor<cT>(Themer, color),
      );
    }

    return {};
  };
}

function assignMethodsToProps(
  method: (prop: string) => any,
  props: string[],
): any {
  return props.reduce(
    (acc, current) => ({ ...acc, [current]: method(current) }),
    {},
  );
}

export const viewStyleMethods: Types.HoC.View.Methods<Types.CustomTheme> = {
  ...assignMethodsToProps(getColorMethod, [
    'backgroundColor',

    'borderColor',
    'borderBottomColor',
    'borderTopColor',
    'borderLeftColor',
    'borderRightColor',
    'borderStartColor',
    'borderEndColor',
  ]),

  ...assignMethodsToProps(getSpacingMethod, [
    'borderRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderBottomStartRadius',
    'borderBottomEndRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderTopStartRadius',
    'borderTopEndRadius',

    'borderWidth',
    'borderBottomWidth',
    'borderTopWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderStartWidth',
    'borderEndWidth',

    'margin',
    'marginBottom',
    'marginTop',
    'marginLeft',
    'marginRight',
    'marginStart',
    'marginEnd',
    'marginHorizontal',
    'marginVertical',

    'padding',
    'paddingBottom',
    'paddingTop',
    'paddingLeft',
    'paddingRight',
    'paddingStart',
    'paddingEnd',
    'paddingHorizontal',
    'paddingVertical',
  ]),

  ...assignMethodsToProps(getDimensionMethod, [
    'height',
    'width',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',

    'top',
    'left',
    'bottom',
    'right',
  ]),

  shadow: getShadowMethod(),

  center: () => ({ alignItems: 'center', justifyContent: 'center' }),
  fill: () => ({ height: '100%', width: '100%' }),
  invisible: () => ({ opacity: 0 }),
  square: () => ({ aspectRatio: 1 }),

  circle: (value: number) => ({
    borderRadius: value && 0.5 * value,
    height: value,
    width: value,
  }),
};
