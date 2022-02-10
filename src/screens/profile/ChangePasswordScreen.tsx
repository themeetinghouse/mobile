import React, { useState, useContext, useLayoutEffect } from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  View,
  Text,
  Keyboard,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Auth } from '@aws-amplify/auth';
import { TextInput } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  CommonActions,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PasswordRequirements from '../../components/auth/PasswordRequirements';
import UserContext, { TMHCognitoUser } from '../../contexts/UserContext';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import { MainStackParamList } from '../../navigation/AppNavigator';
import Theme, { Style, HeaderStyle } from '../../Theme.style';

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
    paddingVertical: 16,
    paddingRight: 16,
    borderColor: Theme.colors.gray2,
    backgroundColor: Theme.colors.background,
  },
  listText: {
    fontSize: Theme.fonts.medium,
    flex: 1,
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
    borderBottomColor: '#54565A',
    borderBottomWidth: 1,
    flex: 1,
    fontFamily: Theme.fonts.fontFamilyRegular,
    color: 'white',
    fontSize: 24,
    marginLeft: 16,
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

  const { setUserData } = userContext;

  useLayoutEffect(() => {
    const signOut = async () => {
      await Auth.signOut().then(() => {
        setUserData(null);
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
        if (e instanceof Error) {
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
      }
    };

    navigation.setOptions({
      headerShown: true,
      title: 'Password',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image style={Style.icon} source={Theme.icons.white.arrowLeft} />
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return (
          <TouchableOpacity
            disabled={!(currentPass && newPass)}
            onPress={() => changePassword()}
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
  }, [currentPass, navigation, newPass, setUserData]);

  function forgotPass(): void {
    setCurrentPass('');
    setNewPass('');
    setError('');
    navigation.navigate('Auth', { screen: 'ForgotPasswordScreen' });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          flex: 1,
          backgroundColor: Theme.colors.black,
          paddingBottom: safeArea.bottom,
        }}
      >
        <ScrollView style={style.content}>
          <View>
            <View
              style={{
                height: 15,
                backgroundColor: Theme.colors.black,
                padding: 0,
              }}
            />
            <View style={style.listItem}>
              <View style={{ display: 'flex', flexDirection: 'column' }}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text numberOfLines={1} style={style.listText}>
                    Current Password
                  </Text>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      secureTextEntry
                      autoCompleteType="password"
                      textContentType="password"
                      keyboardAppearance="dark"
                      style={style.input}
                      value={currentPass}
                      autoFocus
                      onChange={(e) => setCurrentPass(e.nativeEvent.text)}
                    />
                  </View>
                </View>
                <View style={{ alignItems: 'flex-start' }}>
                  <TouchableOpacity onPress={() => forgotPass()}>
                    <Text style={style.listSubtext}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                height: 15,
                backgroundColor: Theme.colors.black,
                padding: 0,
              }}
            />
            <View style={style.listItem}>
              <View style={{ flexDirection: 'row' }}>
                <Text numberOfLines={1} style={style.listText}>
                  New Password
                </Text>
                <View style={{ flex: 1 }}>
                  <TextInput
                    textContentType="newPassword"
                    passwordRules="required: lower; required: upper; required: digit; required: special; minlength: 8;"
                    secureTextEntry
                    keyboardAppearance="dark"
                    style={style.input}
                    value={newPass}
                    onChange={(e) => setNewPass(e.nativeEvent.text)}
                  />
                </View>
              </View>
            </View>
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

            <PasswordRequirements
              password={newPass}
              style={{ marginHorizontal: '5%' }}
            />
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
