import { ElementType } from 'react';
import { Appearance, Text, TextStyle, View, ViewStyle } from 'react-native';

import { Core } from '@huds0n/core';
import Error from '@huds0n/error';
import { SharedState } from '@huds0n/shared-state';
import { InheriterTypes } from '@huds0n/inheriter';
import { addEnumerableGetter } from '@huds0n/utilities';

import { getThemeTextStyle, getThemeViewStyle } from './styles';
import { combineThemeWithDefaults } from './theme';
import {
  createThemeComponent,
  themedPropsToEnum,
  getThemeProps,
} from './ThemedHOC';
import * as Types from './types';

export class Themer<cT extends Types.CustomTheme>
  implements Types.ThemerClass<cT> {
  private _themeColorSchemes: { [name: string]: Types.Theme<cT>['colors'] };
  private _themeColorState: SharedState<{ scheme: string }>;
  private _theme: Types.Theme<cT>;

  private _darkThemes: { [schemeName: string]: boolean };

  Text: Types.ThemedComponent<typeof Text, cT, { style: 'textStyle' }>;
  View: Types.ThemedComponent<typeof View, cT, { style: 'viewStyle' }>;

  constructor(customTheme: cT) {
    this._themeColorState = new SharedState({ scheme: 'DEFAULT' });

    this._theme = combineThemeWithDefaults(customTheme);
    this._themeColorSchemes = { DEFAULT: this._theme.colors };
    this._darkThemes = {};

    this.Text = this.createComponent(Text, { style: 'textStyle' });
    this.View = this.createComponent(View, { style: 'viewStyle' });

    this.addColorScheme = this.addColorScheme.bind(this);
    this.addDarkMode = this.addDarkMode.bind(this);
    this.addListener = this.addListener.bind(this);
    this.changeColorScheme = this.changeColorScheme.bind(this);
    this.createComponent = this.createComponent.bind(this);
    this.getColor = this.getColor.bind(this);
    this.getStyles = this.getStyles.bind(this);
    this.getTextStyle = this.getTextStyle.bind(this);
    this.getViewStyle = this.getViewStyle.bind(this);
    this.useColorScheme = this.useColorScheme.bind(this);
  }

  private _getColors(schemeName: string) {
    const scheme = this._themeColorSchemes[schemeName];

    if (scheme) return scheme;

    throw new Error({
      name: 'themer-error',
      code: 'SCHEME_NOT_FOUND',
      message: 'Color scheme not found',
      severity: 'HIGH',
      info: { scheme },
    });
  }

  get currentScheme() {
    return this._themeColorState.state.scheme;
  }

  get theme() {
    return this._theme;
  }

  get colors() {
    return this._theme.colors;
  }

  get dimensions() {
    return this._theme.dimensions;
  }

  get fontSizes() {
    return this._theme.fontSizes;
  }

  get spacings() {
    return this._theme.spacings;
  }

  addListener(
    name: 'onColorSchemeChange',
    callback: Types.ListenerCallback,
  ): Types.ListenerRemoveFn {
    return this._themeColorState.addListener('scheme', (state) =>
      callback(state.scheme),
    );
  }

  addColorScheme(
    schemeName: string,
    colors: Types.NewColorScheme<cT>,
    isDark?: boolean,
  ) {
    this._themeColorSchemes[schemeName] = {
      ...this._themeColorSchemes.DEFAULT,
      ...colors,
    };

    if (isDark) {
      this._darkThemes[schemeName] = true;
    }
  }

  addDarkMode(darkColors: Types.NewColorScheme<cT>) {
    const darkSchemeName = 'dark';
    const lightSchemeName = 'light';

    this.addColorScheme(darkSchemeName, darkColors, true);
    this.addColorScheme(lightSchemeName, this._getColors('DEFAULT'), false);

    const updateColorScheme = () => {
      this.changeColorScheme(
        Appearance.getColorScheme() === 'dark'
          ? darkSchemeName
          : lightSchemeName,
      );
    };

    updateColorScheme();
    Appearance.addChangeListener(updateColorScheme);
  }

  changeColorScheme(schemeName: string) {
    if (Object.keys(this._themeColorSchemes).includes(schemeName)) {
      this._theme = {
        ...this._theme,
        colors: this._themeColorSchemes[schemeName],
      };

      this._themeColorState.setState({ scheme: schemeName });

      Core.setDarkMode(!!this._darkThemes[schemeName]);
    } else {
      throw new Error({
        name: 'themer-error',
        code: 'SCHEME_NOT_FOUND',
        message: 'Color scheme not found',
        severity: 'HIGH',
        info: {
          missing: schemeName,
          available: Object.keys(this._themeColorSchemes),
        },
      });
    }
  }

  createComponent<E extends ElementType, Tp extends Types.PropTheming = {}>(
    Component: E,
    themedProps?: Tp,
  ): Types.ThemedComponent<E, cT, Tp> {
    //@ts-ignore
    return createThemeComponent(Component, themedProps, this);
  }

  getTextStyle(style: Types.TextStyle<cT>): TextStyle {
    return { ...getThemeTextStyle<cT>(this, style) };
  }

  getViewStyle(style: Types.ViewStyle<cT>): ViewStyle {
    return { ...getThemeViewStyle<cT>(this, style) };
  }

  getColor(color: Types.Color<cT>) {
    // @ts-ignore
    return this._theme.colors[color];
  }

  getProps<
    Pt extends Types.PropTheming,
    P extends Types.GetThemedProps<cT, Pt> & InheriterTypes.Props
  >(theming: Pt, themedProps: P): any {
    return getThemeProps(themedProps, themedPropsToEnum(theming), this);
  }

  getStyles<S extends Record<string, Types.TextStyle<cT>>>(
    themedStyles: S,
  ): Record<keyof S, ViewStyle | TextStyle> {
    const styles: any = {};

    Object.entries(themedStyles).forEach(([key, prop]) => {
      addEnumerableGetter(styles, key, () => this.getTextStyle(prop));
    });

    // @ts-ignore
    return styles;
  }

  styleSheet<S extends Record<string, Types.TextStyle<cT>>>(
    themedStyles: S,
  ): S {
    return themedStyles;
  }

  useColorScheme() {
    this._themeColorState.useState('scheme');
    return this.currentScheme;
  }
}
