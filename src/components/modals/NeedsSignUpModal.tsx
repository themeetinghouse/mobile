import React, { useState } from 'react';
import { View, Text } from 'native-base';
import { Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Theme from '../../Theme.style';
import WhiteButton from '../buttons/WhiteButton';
import { MainStackParamList } from '../../navigation/AppNavigator';

interface Params {
  initState: boolean;
}

export default function NeedsSignUpModal({ initState }: Params): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [visible, setVisible] = useState(true);

  return (
    <Modal
      testID="modal"
      animationType="none"
      visible={initState && visible}
      transparent
    >
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
              fontSize: 24,
              lineHeight: 32,
              color: 'black',
              width: '75%',
              alignSelf: 'center',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            You need an account to add comments
          </Text>
          <View style={{ height: 56, marginBottom: 16 }}>
            <WhiteButton
              solidBlack
              label="Go back"
              onPress={() => {
                setVisible(false);
                navigation.goBack();
              }}
            />
          </View>
          <View style={{ height: 56, marginBottom: 8 }}>
            <WhiteButton
              solidBlack
              label="Create an account"
              onPress={() => {
                setVisible(false);
                navigation.push('Auth', { screen: 'SignUpScreen' });
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
