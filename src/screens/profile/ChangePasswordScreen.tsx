import React, { useState, useContext, useLayoutEffect } from 'react';
import {
  Container,
  Content,
  Text,
  Button,
  View,
  Thumbnail,
  List,
  ListItem,
} from 'native-base';
import Theme, { Style, HeaderStyle } from '../../Theme.style';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Auth } from '@aws-amplify/auth';
import { TextInput } from 'react-native-gesture-handler';
import UserContext, { TMHCognitoUser } from '../../contexts/UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import { MainStackParamList } from '../../navigation/AppNavigator';
import {
  CommonActions,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: 'black',
    },
  },
  header: {
    backgroundColor: Theme.colors.header,
  },
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerBody: {
    flexGrow: 3,
    justifyContent: 'center',
  },
  headerRight: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
    right: 6,
  },
  headerTitle: {
    ...HeaderStyle.title,
    ...{
      width: '100%',
    },
  },
  title: {
    ...Style.title,
    ...{
      marginTop: 130,
      marginBottom: 16,
    },
  },
  body: {
    ...Style.body,
    ...{
      marginBottom: 40,
    },
  },
  listItem: {
    marginLeft: 0,
    borderColor: Theme.colors.gray2,
    backgroundColor: Theme.colors.background,
  },
  listText: {
    fontSize: Theme.fonts.medium,
    color: Theme.colors.grey5,
    fontFamily: Theme.fonts.fontFamilyRegular,
    marginLeft: 16,
    lineHeight: 24,
  },
  listSubtext: {
    fontSize: Theme.fonts.smallMedium,
    color: Theme.colors.grey4,
    fontFamily: Theme.fonts.fontFamilyRegular,
    marginLeft: 16,
    marginTop: 10,
  },
  listIcon: {
    ...Style.icon,
    ...{
      marginRight: 16,
      marginLeft: 16,
    },
  },
  listArrowIcon: Style.icon,
  headerText: {
    fontSize: 16,
    fontFamily: Theme.fonts.fontFamilyRegular,
    color: 'white',
    lineHeight: 24,
  },
  input: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    color: 'white',
    fontSize: 24,
    paddingLeft: 16,
  },
});

interface Params {
  navigation: CompositeNavigationProp<
    StackNavigationProp<HomeStackParamList>,
    StackNavigationProp<MainStackParamList>
  >;
}

export default function ChangePass({ navigation }: Params): JSX.Element {
  const userContext = useContext(UserContext);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [error, setError] = useState('');
  const safeArea = useSafeAreaInsets();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Password',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return (
          <Button transparent onPress={() => navigation.goBack()}>
            <Thumbnail
              style={Style.icon}
              source={Theme.icons.white.arrowLeft}
              square
            ></Thumbnail>
          </Button>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return (
          <TouchableOpacity
            disabled={!(currentPass && newPass)}
            onPress={changePassword}
          >
            <Text
              style={
                currentPass && newPass
                  ? HeaderStyle.linkText
                  : HeaderStyle.linkTextInactive
              }
            >
              Save
            </Text>
          </TouchableOpacity>
        );
      },
      headerRightContainerStyle: { right: 16 },
    });
  }, []);

  function forgotPass(): void {
    setCurrentPass('');
    setNewPass('');
    setError('');
    navigation.navigate('Auth', { screen: 'ForgotPasswordScreen' });
  }

  const signOut = async () => {
    await Auth.signOut().then(() => {
      userContext?.setUserData(null);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'Auth' }],
        })
      );
    });
  };

  const changePassword = async (): Promise<void> => {
    try {
      const user: TMHCognitoUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, currentPass, newPass);
      signOut();
    } catch (e) {
      console.debug(e);
      if (e.code === 'NotAuthorizedException')
        setError('Current password incorrect');
      else if (e.code === 'InvalidPasswordException')
        setError(e.message.split(': ')[1]);
      else if (e.code === 'InvalidParameterException')
        if (e.message.includes('previousPassword'))
          setError('Current password incorrect');
        else setError('Password not long enough');
      else setError(e.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container
        style={{
          backgroundColor: Theme.colors.black,
          paddingBottom: safeArea.bottom,
        }}
      >
        <Content style={style.content}>
          <View>
            <List>
              <View
                style={{
                  height: 15,
                  backgroundColor: Theme.colors.black,
                  padding: 0,
                }}
              />
              <ListItem style={style.listItem}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text style={style.listText}>Current Password</Text>
                    <View
                      style={{ width: Dimensions.get('window').width - 150 }}
                    >
                      <TextInput
                        secureTextEntry
                        autoCompleteType="password"
                        textContentType="password"
                        keyboardAppearance="dark"
                        style={style.input}
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.nativeEvent.text)}
                      ></TextInput>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Text
                      onPress={() => forgotPass()}
                      style={style.listSubtext}
                    >
                      Forgot password?
                    </Text>
                  </View>
                </View>
              </ListItem>
              <View
                style={{
                  height: 15,
                  backgroundColor: Theme.colors.black,
                  padding: 0,
                }}
              />
              <ListItem style={style.listItem}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text style={style.listText}>New Password</Text>
                  <View style={{ width: Dimensions.get('window').width - 150 }}>
                    <TextInput
                      textContentType="newPassword"
                      passwordRules="required: lower; required: upper; required: digit; required: special; minlength: 8;"
                      secureTextEntry
                      keyboardAppearance="dark"
                      style={style.input}
                      value={newPass}
                      onChange={(e) => setNewPass(e.nativeEvent.text)}
                    ></TextInput>
                  </View>
                </View>
              </ListItem>
              <View style={{ marginTop: 12 }}>
                <Text
                  style={{
                    color: Theme.colors.red,
                    alignSelf: 'center',
                    fontFamily: Theme.fonts.fontFamilyRegular,
                    fontSize: 12,
                    height: 12,
                  }}
                >
                  {error}
                </Text>
              </View>
            </List>
          </View>
        </Content>
      </Container>
    </TouchableWithoutFeedback>
  );
}
