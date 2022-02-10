import React from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Theme } from '../../Theme.style';

const style = StyleSheet.create({
  button: {
    borderRadius: 50,
    flex: 1,
    marginVertical: 2,
    marginHorizontal: 3,
    backgroundColor: '#1A1A1A',
  },
  selectedButton: {
    borderRadius: 50,
    flex: 1,
    marginVertical: 2,
    marginHorizontal: 3,
    backgroundColor: '#646469',
  },
  buttonText: {
    color: '#C8C8C8',
    alignSelf: 'center',
    textAlignVertical: 'center',
    lineHeight: 40,
    flex: 1,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.small,
  },
  selectedButtonText: {
    color: 'white',
  },
  buttonContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
    height: 40,
    borderRadius: 50,
    backgroundColor: '#1A1A1A',
  },
});
interface Params {
  currentToggle: boolean;
  toggle: (current: boolean) => void;
  btnTextOne: string;
  btnTextTwo: string;
}

export default function ToggleButton({
  currentToggle,
  toggle,
  btnTextOne,
  btnTextTwo,
}: Params): JSX.Element {
  return (
    <View style={style.buttonContainer}>
      <TouchableHighlight
        underlayColor="#646469"
        onPress={() => toggle(false)}
        style={!currentToggle ? style.selectedButton : style.button}
      >
        <Text
          style={
            !currentToggle
              ? [style.buttonText, style.selectedButtonText]
              : style.buttonText
          }
        >
          {btnTextOne}
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor="#646469"
        onPress={() => toggle(true)}
        style={currentToggle ? style.selectedButton : style.button}
      >
        <Text
          style={
            currentToggle
              ? [style.buttonText, style.selectedButtonText]
              : style.buttonText
          }
        >
          {btnTextTwo}
        </Text>
      </TouchableHighlight>
    </View>
  );
}
