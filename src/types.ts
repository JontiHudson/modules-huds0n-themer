import { ElementType } from 'react';
import {
  Animated,
  PressableStateCallbackType,
  Text,
  TextStyle as TextStyleRN,
  View,
  ViewStyle as ViewStyleRN,
} from 'react-native';

import { SharedState } from '@huds0n/shared-state';
import { InheriterTypes } from '@huds0n/inheriter';

import { defaultTheme } from './theme/defaults';

type DefaultTheme = typeof defaultTheme;

export type CustomTheme = {
  colors?: Record<string, string>;
  dimensions?: Record<string, number | string>;
  fontSizes?: Record<string, number>;
  spacings?: Record<string, number>;
};

export type Theme<cT extends CustomTheme> = cT & DefaultTheme;

namespace Names {
  export type Colors<cT extends CustomTheme> = keyof Theme<cT>['colors'];
  export type Dimensions<
    cT extends CustomTheme
  > = keyof Theme<cT>['dimensions'];
  export type FontSizes<cT extends CustomTheme> = keyof Theme<cT>['fontSizes'];
  export type Spacings<cT extends CustomTheme> = keyof Theme<cT>['spacings'];
}

export type Color<cT extends CustomTheme> = Names.Colors<cT>;
export type Dimension<cT extends CustomTheme> = Names.Dimensions<cT> | number;
export type Spacing<cT extends CustomTheme> = Names.Spacings<cT> | number;
export type FontSize<cT extends CustomTheme> =
  | Names.FontSizes<cT>
  | undefined
  | number;

export type Shadow<cT extends CustomTheme> =
  | boolean
  | {
      color?: Color<cT>;
      offset?: number;
      offsetX?: number;
      offsetY?: number;
      opacity?: number;
      radius?: number;
    };

export type TextStyle<cT extends CustomTheme> = HoC.Text.Props<Theme<cT>>;
export type ViewStyle<cT extends CustomTheme> = HoC.View.Props<Theme<cT>>;

export type PropTheming = {
  [key: string]:
    | 'color'
    | 'dimension'
    | 'spacing'
    | 'textStyle'
    | 'viewStyle'
    | 'pressStyle'
    | 'animatedViewStyle'
    | 'animatedTextStyle'
    | PropTheming;
};

export enum ThemedPropEnum {
  color = 1,
  dimension = 2,
  spacing = 3,
  textStyle = 4,
  viewStyle = 5,
  pressStyle = 6,
  animatedViewStyle = 7,
  animatedTextStyle = 8,
}

export type NewColorScheme<cT extends CustomTheme> =
  | Theme<cT>['colors']
  | Partial<Record<keyof cT['colors'], string>>;

export type ListenerRemoveFn = SharedState.ListenerRemoveFn;
export type ListenerCallback = (newScheme: string) => void;

export type ThemedComponent<
  E extends ElementType,
  cT extends CustomTheme,
  Pt extends PropTheming
> = InheriterTypes.InheritableComponent<
  E,
  ThemedProps<
    InheriterTypes.ComponentProps<InheriterTypes.GetProps<E>>,
    cT,
    Pt
  > & {
    useColorScheme?: boolean;
  }
>;

export type ThemedProps<
  P extends InheriterTypes.Props,
  cT extends CustomTheme,
  Pt extends PropTheming
> = Pick<P, Exclude<keyof P, keyof Pt>> & GetThemedProps<cT, Pt>;

export type GetThemedProps<
  cT extends CustomTheme,
  Pt extends PropTheming
> = Partial<{ [K in keyof Pt]: GetThemedProp<cT, Pt[K]> }>;

type GetThemedProp<cT extends CustomTheme, Value> = Value extends 'color'
  ? Color<cT>
  : Value extends 'dimension'
  ? Dimension<cT>
  : Value extends 'spacing'
  ? Spacing<cT>
  : Value extends 'textStyle'
  ? HoC.Text.Props<cT>
  : Value extends 'viewStyle'
  ? HoC.View.Props<cT>
  : Value extends 'pressStyle'
  ? HoC.View.PressProps<cT>
  : Value extends 'animatedTextStyle'
  ? HoC.Text.AnimatedProps<cT>
  : Value extends 'animatedViewStyle'
  ? HoC.View.AnimatedProps<cT>
  : Value extends PropTheming
  ? GetThemedProps<cT, Value> & InheriterTypes.Props
  : never;

export namespace HoC {
  export namespace Text {
    export type Methods<cT extends CustomTheme> = {
      color: (value: Color<cT>, Themer: ThemerClass<cT>) => TextStyleRN;
      fontSize: (value: FontSize<cT>, Themer: ThemerClass<cT>) => TextStyleRN;
      textShadow: (value: Shadow<cT>, Themer: ThemerClass<cT>) => TextStyleRN;
    };

    export type MethodsProps<cT extends CustomTheme> = {
      [K in keyof Methods<cT>]: Parameters<Methods<cT>[K]>[0];
    } &
      View.MethodsProps<cT>;

    export type Props<cT extends CustomTheme> = Partial<MethodsProps<cT>> &
      Omit<TextStyleRN, keyof MethodsProps<cT>>;

    export type AnimatedProps<cT extends CustomTheme> = Partial<
      MethodsProps<cT>
    > &
      Omit<Animated.AnimatedProps<TextStyleRN>, keyof MethodsProps<cT>>;
  }

  export namespace View {
    export namespace MethodFns {
      export type BooleanFn = (value: boolean) => ViewStyleRN;

      export type ColorFn<cT extends CustomTheme> = (
        value: Color<cT>,
        Themer: ThemerClass<cT>,
      ) => ViewStyleRN;

      export type DimensionFn<cT extends CustomTheme> = (
        value: Dimension<cT>,
        Themer: ThemerClass<cT>,
      ) => ViewStyleRN;

      export type SpacingFn<cT extends CustomTheme> = (
        value: Spacing<cT>,
        Themer: ThemerClass<cT>,
      ) => ViewStyleRN;

      export type ShadowFn<cT extends CustomTheme> = (
        value: Shadow<cT>,
        Themer: ThemerClass<cT>,
      ) => ViewStyleRN;

      export type NumberFn = (value: number) => ViewStyleRN;
    }

    export type Methods<cT extends CustomTheme> = {
      backgroundColor: MethodFns.ColorFn<cT>;

      borderColor: MethodFns.ColorFn<cT>;
      borderBottomColor: MethodFns.ColorFn<cT>;
      borderTopColor: MethodFns.ColorFn<cT>;
      borderLeftColor: MethodFns.ColorFn<cT>;
      borderRightColor: MethodFns.ColorFn<cT>;
      borderStartColor: MethodFns.ColorFn<cT>;
      borderEndColor: MethodFns.ColorFn<cT>;

      borderRadius: MethodFns.SpacingFn<cT>;
      borderBottomLeftRadius: MethodFns.SpacingFn<cT>;
      borderBottomRightRadius: MethodFns.SpacingFn<cT>;
      borderBottomStartRadius: MethodFns.SpacingFn<cT>;
      borderBottomEndRadius: MethodFns.SpacingFn<cT>;
      borderTopLeftRadius: MethodFns.SpacingFn<cT>;
      borderTopRightRadius: MethodFns.SpacingFn<cT>;
      borderTopStartRadius: MethodFns.SpacingFn<cT>;
      borderTopEndRadius: MethodFns.SpacingFn<cT>;

      borderWidth: MethodFns.SpacingFn<cT>;
      borderBottomWidth: MethodFns.SpacingFn<cT>;
      borderTopWidth: MethodFns.SpacingFn<cT>;
      borderLeftWidth: MethodFns.SpacingFn<cT>;
      borderRightWidth: MethodFns.SpacingFn<cT>;
      borderStartWidth: MethodFns.SpacingFn<cT>;
      borderEndWidth: MethodFns.SpacingFn<cT>;

      margin: MethodFns.SpacingFn<cT>;
      marginBottom: MethodFns.SpacingFn<cT>;
      marginTop: MethodFns.SpacingFn<cT>;
      marginLeft: MethodFns.SpacingFn<cT>;
      marginRight: MethodFns.SpacingFn<cT>;
      marginStart: MethodFns.SpacingFn<cT>;
      marginEnd: MethodFns.SpacingFn<cT>;
      marginHorizontal: MethodFns.SpacingFn<cT>;
      marginVertical: MethodFns.SpacingFn<cT>;

      padding: MethodFns.SpacingFn<cT>;
      paddingBottom: MethodFns.SpacingFn<cT>;
      paddingTop: MethodFns.SpacingFn<cT>;
      paddingLeft: MethodFns.SpacingFn<cT>;
      paddingRight: MethodFns.SpacingFn<cT>;
      paddingStart: MethodFns.SpacingFn<cT>;
      paddingEnd: MethodFns.SpacingFn<cT>;
      paddingHorizontal: MethodFns.SpacingFn<cT>;
      paddingVertical: MethodFns.SpacingFn<cT>;

      height: MethodFns.DimensionFn<cT>;
      width: MethodFns.DimensionFn<cT>;
      maxHeight: MethodFns.DimensionFn<cT>;
      maxWidth: MethodFns.DimensionFn<cT>;
      minHeight: MethodFns.DimensionFn<cT>;
      minWidth: MethodFns.DimensionFn<cT>;

      top: MethodFns.DimensionFn<cT>;
      left: MethodFns.DimensionFn<cT>;
      bottom: MethodFns.DimensionFn<cT>;
      right: MethodFns.DimensionFn<cT>;

      center: MethodFns.BooleanFn;
      fill: MethodFns.BooleanFn;
      invisible: MethodFns.BooleanFn;
      square: MethodFns.BooleanFn;

      shadow: MethodFns.ShadowFn<cT>;

      circle: MethodFns.NumberFn;
    };

    export type MethodsProps<cT extends CustomTheme> = {
      [K in keyof Methods<cT>]: Parameters<Methods<cT>[K]>[0];
    };

    export type Props<cT extends CustomTheme> = Partial<MethodsProps<cT>> &
      Omit<ViewStyleRN, keyof MethodsProps<cT>>;

    export type PressProps<cT extends CustomTheme> =
      | Props<cT>
      | ((pressState: PressableStateCallbackType) => Props<cT>);

    export type AnimatedProps<cT extends CustomTheme> = Partial<
      MethodsProps<cT>
    > &
      Omit<Animated.AnimatedProps<ViewStyleRN>, keyof MethodsProps<cT>>;
  }
}

export interface ThemerClass<cT extends CustomTheme> {
  Text: ThemedComponent<typeof Text, cT, { style: 'textStyle' }>;
  View: ThemedComponent<typeof View, cT, { style: 'viewStyle' }>;

  readonly currentScheme: string;

  readonly theme: Theme<cT>;
  readonly dimensions: Theme<cT>['dimensions'];
  readonly fontSizes: Theme<cT>['fontSizes'];
  readonly spacings: Theme<cT>['spacings'];

  addListener(
    name: 'onColorSchemeChange',
    callback: ListenerCallback,
  ): ListenerRemoveFn;

  addColorScheme(
    schemeName: string,
    colors: NewColorScheme<cT>,
    isDark?: boolean,
  ): void;

  addDarkMode(darkColors: NewColorScheme<cT>): void;

  changeColorScheme(schemeName: string): void;

  createComponent<E extends ElementType, Pt extends PropTheming = {}>(
    Component: E,
    themedProps?: Pt,
  ): ThemedComponent<E, cT, Pt>;

  getColor(color: Names.Colors<cT>): string;

  getTextStyle(style: HoC.Text.Props<cT>): TextStyleRN | undefined;

  getViewStyle(style: HoC.View.Props<cT>): ViewStyleRN | undefined;

  getProps<
    Pt extends PropTheming,
    P extends GetThemedProps<cT, Pt> & InheriterTypes.Props
  >(
    propsTheming: Pt,
    themedProps: P,
  ): any;

  getStyles<S extends Record<string, TextStyle<cT>>>(
    themedStyles: S,
  ): Record<keyof S, TextStyleRN | ViewStyleRN>;

  styleSheet<S extends Record<string, TextStyle<cT>>>(themedStyles: S): S;

  useColorScheme(): string;
}
