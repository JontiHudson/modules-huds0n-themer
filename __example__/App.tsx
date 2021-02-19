import React from 'react';
import { SafeAreaView, Text } from 'react-native';

import { Button } from '@huds0n/components';

import { $Button, $ButtonModified, $ButtonStyled } from './Components';
import { Themer } from './Themer';

export default function ThemerPlayground() {
  Themer.useColorScheme();

  const onClick = () => {
    console.log('click');
  };

  return (
    <SafeAreaView style={$styles.$view}>
      <Button onPress={onClick}>Unthemed Button</Button>

      <$Button onPress={onClick}>Themed But No Props</$Button>

      <$ButtonStyled onPress={onClick}>Themed With Props</$ButtonStyled>

      <$ButtonModified outline="SECONDARY" onPress={onClick}>
        Outline Button
      </$ButtonModified>

      <$ButtonModified link="SECONDARY" onPress={onClick}>
        Link Button
      </$ButtonModified>

      <Text style={$styles.$text}>Toggle device night mode to see changes</Text>
    </SafeAreaView>
  );
}

const $styles = Themer.getStyles({
  $text: {
    alignSelf: 'center',
    color: 'TEXT',
    fontSize: 'BODY',
    paddingTop: 'L',
  },
  $view: {
    backgroundColor: 'BACKGROUND',
  },
});
