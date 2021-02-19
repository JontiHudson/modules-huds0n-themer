import { Button } from '@huds0n/components';

import { Themer, Color } from './Themer';

export const $Button = Themer.createComponent(Button, {
  color: 'color',
  disabledLabelStyle: 'textStyle',
  disabledStyle: 'viewStyle',
  labelStyle: 'textStyle',
  pressedStyle: 'viewStyle',
  pressedLabelStyle: 'textStyle',
  spinnerColor: 'color',
  spinnerStyle: 'viewStyle',
  style: 'viewStyle',
});

export const $ButtonStyled = $Button.addProps({
  android_ripple: true,
  color: 'PRIMARY',
  disabledStyle: { backgroundColor: 'DISABLED' },
  labelStyle: { color: 'BACKGROUND', fontSize: 'LABEL' },
  spinnerColor: 'BACKGROUND',
  style: {
    alignSelf: 'center',
    borderColor: 'BORDER',
    margin: 'BUTTON_MARGIN',
    width: 'BUTTON_WIDTH',
  },
});

type NewProps = {
  outline?: boolean | Color;
  link?: boolean | Color;
};

export const $ButtonModified = $ButtonStyled.inject(
  ({ outline, link }: NewProps) => {
    if (link) {
      return {
        android_ripple: false,
        color: 'TRANSPARENT',
        disabledLabelStyle: { color: 'DISABLED' },
        disabledStyle: { backgroundColor: 'TRANSPARENT' },
        feedback: 'fade',
        labelStyle: {
          color: link === true ? 'TEXT' : link,
          fontSize: 'NOTE',
          textDecorationLine: 'underline',
        },
        spinnerColor: 'TEXT',
        style: {
          borderWidth: 'NONE',
          minWidth: undefined,
          padding: 'S',
          width: undefined,
        },
      };
    }
    if (outline) {
      const color = outline === true ? 'TEXT' : outline;
      return {
        android_ripple: false,
        color: 'TRANSPARENT',
        disabledLabelStyle: { color: 'DISABLED' },
        disabledStyle: {
          backgroundColor: 'TRANSPARENT',
          borderColor: 'DISABLED',
        },
        feedback: 'fade',
        labelStyle: { color },
        spinnerColor: 'PRIMARY',
        style: {
          borderWidth: 2,
          borderColor: color,
        },
      };
    }
  },
);
