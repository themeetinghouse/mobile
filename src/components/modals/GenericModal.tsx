import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { useModalContext } from '../../contexts/ModalContext/ModalContext';
import Theme from '../../Theme.style';
import WhiteButton from '../buttons/WhiteButton';

const Styles = StyleSheet.create({
  ModalBackdropContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  WhiteBoxContainer: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 24,
    paddingBottom: 30,
    width: '96%',
    alignSelf: 'center',
  },
  DismissButtonContainer: {
    height: 56,
    borderWidth: 3,
  },
  SubmitButtonContainer: {
    height: 56,
    marginBottom: 16,
  },
  Title: {
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: 24,
    lineHeight: 32,
    color: 'black',
    textAlign: 'left',
    marginBottom: 16,
  },
  Body: {
    fontFamily: Theme.fonts.fontFamilyMedium,
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
    textAlign: 'left',
    marginBottom: 40,
  },
});

export default function GenericModal(): JSX.Element {
  const { state, dismissModal } = useModalContext();
  return (
    <Modal
      testID="modal"
      animationType="slide"
      visible={state.isVisible}
      transparent
    >
      <View style={Styles.ModalBackdropContainer}>
        <View style={Styles.WhiteBoxContainer}>
          <Text style={Styles.Title}>{state.title}</Text>
          <Text style={Styles.Body}>{state.body}</Text>
          {state.actionLabel ? (
            <View style={Styles.SubmitButtonContainer}>
              <WhiteButton
                solidBlack
                label={state.actionLabel ?? 'OK'}
                onPress={state.action}
              />
            </View>
          ) : null}
          {state.dismissActionLabel ? (
            <View style={Styles.DismissButtonContainer}>
              <WhiteButton
                label={state.dismissActionLabel ?? 'Back'}
                onPress={dismissModal}
              />
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
