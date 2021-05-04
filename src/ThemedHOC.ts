// @ts-nocheck

import { createComponent } from '@huds0n/inheriter/src/createComponent';
import {
  addEnumerableGetter,
  mapObject,
  flattenPressableStyle,
  useMemo,
} from '@huds0n/utilities';

import {
  getThemeTextStyle,
  getThemeViewStyle,
  getThemePressStyle,
} from './styles';

import { getThemeDimension } from './theme/dimensions';
import { getThemeSpacing } from './theme/spacings';

import * as Types from './types';

const ThemedPropType = Types.ThemedPropEnum;

export function themedPropsToEnum(theming) {
  if (theming) {
    return mapObject(
      theming,
      (prop) =>
        ThemedPropType[prop] ||
        (typeof prop === 'object' && themedPropsToEnum(prop)) ||
        undefined,
    );
  }
}

export function createThemeComponent(Component, theming, Themer) {
  const enumedTheming = themedPropsToEnum(theming);

  const mergePropsFn = getMergePropsFn(enumedTheming);

  return createComponent(Component, { mergePropsFn }).inject(
    (unThemedProps) => {
      unThemedProps.useColorScheme && Themer.useColorScheme();

      if (enumedTheming) {
        const themedProps = useMemo(
          () => ({
            ...mergeThemePropsWithProps(unThemedProps, enumedTheming, Themer),
            __overwrite: true,
          }),
          [...Object.values(unThemedProps), Themer.currentScheme],
        );

        unThemedProps.__debug &&
          console.log({ unThemedProps, theming, themedProps });

        return themedProps;
      }
    },
  );
}

function getMergePropsFn(enumedTheming) {
  return function mergeProps(props1, props2) {
    if (!props1) return props2;

    const oldProps = {} as any;
    const newProps = { ...props2 };

    Object.entries(props1).forEach(([key, value]: [keyof P, any]) => {
      if (enumedTheming?.[key] === ThemedPropType.pressStyle && props1[key]) {
        newProps[key] = flattenPressableStyle([props1[key], props2[key]]);
      } else if (
        typeof value === 'object' &&
        typeof props1[key] === 'object' &&
        value?.constructor.name === 'Object' &&
        props1[key]?.constructor.name === 'Object'
      ) {
        newProps[key] = { ...value, ...props2[key] };
      } else {
        oldProps[key] = value;
      }
    });

    return { ...oldProps, ...newProps };
  };
}

function mergeThemePropsWithProps(props, enumedTheming, Themer) {
  function propReducer(acc, [key, value]) {
    if (enumedTheming[key]) {
      addThemeProp(acc, key, value, enumedTheming[key], Themer);

      if (key === 'style' && typeof value === 'object') {
        Object.defineProperty(acc, 'style', {
          enumerable: true,
          writable: true,
          value: { ...acc.style },
        });
        acc.style = { ...acc.style };
      }
      return acc;
    }

    return { ...acc, [key]: value };
  }
  return Object.entries(props).reduce(propReducer, {});
}

function addThemeProp(target, key, prop, type, Themer) {
  switch (type) {
    case ThemedPropType.viewStyle:
    case ThemedPropType.animatedViewStyle:
      return addEnumerableGetter(target, key, () =>
        getThemeViewStyle(Themer, prop),
      );

    case ThemedPropType.textStyle:
    case ThemedPropType.animatedTextStyle:
      return addEnumerableGetter(target, key, () =>
        getThemeTextStyle(Themer, prop),
      );

    case ThemedPropType.color:
      return addEnumerableGetter(target, key, () => Themer.colors[prop]);

    case ThemedPropType.dimension:
      return (target[key] = getThemeDimension(Themer, prop));

    case ThemedPropType.spacing:
      return (target[key] = getThemeSpacing(Themer, prop));

    case ThemedPropType.pressStyle:
      return (target[key] = getThemePressStyle(Themer, prop));

    default:
      if (typeof type === 'object' && typeof prop === 'object') {
        return (target[key] = getThemeProps(prop, type, Themer));
      }

      return (target[key] = prop);
  }
}

export function getThemeProps(props, type, Themer): any {
  const _props = {};

  Object.entries(props).forEach(([key, value]) => {
    addThemeProp(_props, key, value, type[key], Themer);
  });

  return _props;
}
