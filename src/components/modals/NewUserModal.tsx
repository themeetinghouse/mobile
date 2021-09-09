import React from 'react';
import { View, Text } from 'native-base';
import { Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Theme from '../../Theme.style';
import WhiteButton from '../buttons/WhiteButton';
import { MainStackParamList } from '../../navigation/AppNavigator';

interface Params {
  show: boolean;
  closeModal: () => void;
}

export default function NewUserModal({
  show,
  closeModal,
}: Params): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  return (
    <Modal animationType="slide" testID="modal" visible={show} transparent>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 32,
            width: '96%',
            alignSelf: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: Theme.fonts.fontFamilyBold,
              fontSize: 20,
              lineHeight: 32,
              color: 'black',
              alignSelf: 'center',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            For best user experience, please select a parish.
          </Text>
          <View style={{ height: 56, marginBottom: 8 }}>
            <WhiteButton
              solidBlack
              label="Select a parish"
              onPress={() => {
                closeModal();
                navigation.push('LocationSelectionScreen', { persist: true });
              }}
            />
          </View>
          <WhiteButton
            label="Dismiss"
            style={{ height: 56, borderWidth: 3 }}
            onPress={() => {
              closeModal();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
