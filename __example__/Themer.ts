import { createThemer, ThemerTypes } from '@huds0n/themer';

const BLACK = '#101010';
const BROWN = '#ae5a41';
const BLUE = '#1b85b8';
const WHITE = '#eeeeee';
const GREY = '#5a5255';
const DARK_GREEN = '#559e83';
const LIGHT_GREEN = '#c3cb71';

const LIGHT_THEME = {
  colors: {
    BACKGROUND: WHITE,
    BLACK,
    BORDER: BLACK,
    GREY,
    PRIMARY: BLUE,
    SECONDARY: DARK_GREEN,
    TEXT: BLACK,
    WHITE,
  },
  fontSizes: {
    LABEL: 14,
  },
  spacings: {
    BUTTON_MARGIN: 10,
  },
};

export const Themer = createThemer(LIGHT_THEME);

Themer.addDarkMode({
  BACKGROUND: BLACK,
  BORDER: WHITE,
  PRIMARY: BROWN,
  SECONDARY: LIGHT_GREEN,
  TEXT: WHITE,
});

export type CustomTheme = typeof LIGHT_THEME;
export type Color = ThemerTypes.Color<CustomTheme>;
export type Spacing = ThemerTypes.Color<CustomTheme>;
export type TextStyle = ThemerTypes.TextStyle<CustomTheme>;
export type ViewStyle = ThemerTypes.ViewStyle<CustomTheme>;
