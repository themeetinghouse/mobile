import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { Auth } from '@aws-amplify/auth';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  RouteProp,
  useRoute,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PasswordRequirements from '../../components/auth/PasswordRequirements';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import NoMedia from '../../components/NoMedia';

import WhiteButton, {
  WhiteButtonAsync,
} from '../../components/buttons/WhiteButton';
import { Theme, Style } from '../../Theme.style';

const style = StyleSheet.create({
  title: {
    ...Style.cardTitle,
    ...{
      paddingLeft: 0,
      paddingTop: 26,
      lineHeight: 24,
    },
  },
  locationSelector: {
    backgroundColor: Theme.colors.gray1,
    borderColor: Theme.colors.grey3,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  locationText: {
    height: 56,
    lineHeight: 56,
    color: 'white',
    fontSize: 16,
  },
  input: {
    backgroundColor: Theme.colors.gray1,
    borderColor: Theme.colors.grey3,
    borderWidth: 1,
    height: 56,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  inputSelected: {
    backgroundColor: Theme.colors.gray1,
    borderColor: 'white',
    borderWidth: 3,
    height: 56,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  picker: {
    backgroundColor: Theme.colors.gray1,
    borderColor: Theme.colors.grey3,
    borderWidth: 1,
    height: 56,
    borderRadius: 0,
  },
  headerTextActive: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Theme.fonts.fontFamilyBold,
    paddingHorizontal: 16,
  },
  headerTextInactive: {
    color: Theme.colors.grey4,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Theme.fonts.fontFamilyBold,
    paddingHorizontal: 16,
  },
  forgotPassText: {
    color: Theme.colors.grey5,
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 8,
  },
});

interface Params {
  navigation: CompositeNavigationProp<
    StackNavigationProp<AuthStackParamList>,
    StackNavigationProp<MainStackParamList>
  >;
}

export default function SignUp({ navigation }: Params): JSX.Element {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [site, setSite] = useState({
    locationName: 'unknown',
    locationId: 'unknown',
  });
  const [error, setError] = useState('');
  const route = useRoute<RouteProp<AuthStackParamList, 'SignUpScreen'>>();
  const safeArea = useSafeAreaInsets();
  const [sending, setSending] = useState(false);

  const locationName = route.params?.locationName;
  const locationId = route.params?.locationId;

  useEffect(() => {
    if (locationName && locationId)
      setSite({
        locationName,
        locationId,
      });
  }, [locationName, locationId]);

  function navigateInAuthStack(screen: keyof AuthStackParamList): void {
    setUser('');
    setPass('');
    setSite({ locationName: 'unknown', locationId: 'unknown' });
    setError('');
    navigation.push(screen);
  }

  function confirmUser(): void {
    setPass('');
    setSite({ locationName: 'unknown', locationId: 'unknown' });
    setError('');
    navigation.push('ConfirmSignUpScreen', { email: user });
  }

  function navigateHome() {
    setUser('');
    setPass('');
    setSite({ locationName: 'unknown', locationId: 'unknown' });
    setError('');
    navigation.push('Main', {
      screen: 'Home',
    });
  }

  const signUp = async () => {
    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(user)) {
      setError('Invalid email address');
      return;
    }
    setSending(true);
    try {
      await Auth.signUp({
        username: user,
        password: pass,
        attributes: { email: user, 'custom:home_location': site.locationId },
      }).then(() => confirmUser());
    } catch (e: any) {
      if (e?.code === 'InvalidPasswordException')
        setError(e?.message?.split(': ')?.[1]);
      else if (e?.code === 'InvalidParameterException')
        setError('Password not long enough');
      else setError(e?.message ?? 'An unknown error occurred');
    }
    setSending(false);
  };

  return (
    <NoMedia>
      <ScrollView
        style={{ width: '100%', paddingTop: safeArea.top }}
        contentContainerStyle={{
          minHeight:
            Platform.OS === 'android'
              ? Dimensions.get('window').height -
                (StatusBar.currentHeight ?? 24)
              : Dimensions.get('screen').height - safeArea.top,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            backgroundColor: 'black',
          }}
        >
          <TouchableOpacity
            style={{ position: 'absolute', left: '5%', paddingTop: 4 }}
            onPress={() => navigateHome()}
          >
            <Image
              accessibilityLabel="Close Button"
              source={Theme.icons.white.closeCancel}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <Text
            onPress={() => navigateInAuthStack('LoginScreen')}
            style={style.headerTextInactive}
          >
            Login
          </Text>
          <Text style={style.headerTextActive}>Sign Up</Text>
        </View>
        <View
          style={{
            flexGrow: 1,
            backgroundColor: 'black',
            width: '100%',
            paddingHorizontal: '5%',
            paddingBottom: 56,
          }}
        >
          <Text style={style.title}>Email</Text>
          <TextInput
            accessibilityLabel="Email Address"
            keyboardAppearance="dark"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            style={style.input}
            value={user}
            onChange={(e) => setUser(e.nativeEvent.text.toLowerCase())}
          />
          <Text style={style.title}>Password</Text>
          <TextInput
            accessibilityLabel="Password"
            textContentType="newPassword"
            passwordRules="required: lower; required: upper; required: digit; required: special; minlength: 8;"
            keyboardAppearance="dark"
            onSubmitEditing={signUp}
            value={pass}
            onChange={(e) => setPass(e.nativeEvent.text)}
            secureTextEntry
            style={style.input}
          />
          <PasswordRequirements password={pass} />
          <Text style={style.title}>Choose Your Location</Text>
          <TouchableOpacity
            style={style.locationSelector}
            onPress={() => navigation.push('LocationSelectionScreen')}
          >
            <Text style={style.locationText}>
              {site.locationName && site.locationName !== 'unknown'
                ? site.locationName
                : 'None Selected'}
            </Text>
            <AntDesign name="caretdown" size={8} color="white" />
          </TouchableOpacity>
          <View style={{ marginTop: 12 }}>
            <Text
              style={{
                color: Theme.colors.red,
                alignSelf: 'center',
                fontFamily: Theme.fonts.fontFamilyRegular,
                fontSize: 12,
              }}
            >
              {error}
            </Text>
          </View>
          <WhiteButtonAsync
            isLoading={sending}
            label="Create Account"
            onPress={signUp}
            style={{ marginTop: 12, height: 56 }}
          />
          <TouchableOpacity
            onPress={() => navigateInAuthStack('ConfirmSignUpScreen')}
            style={{ alignSelf: 'flex-end' }}
          >
            <Text style={style.forgotPassText}>Verify a Code</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexGrow: 0,
            paddingTop: 16,
            paddingBottom: 52,
            backgroundColor: Theme.colors.background,
            paddingHorizontal: '5%',
          }}
        >
          <Text
            style={{
              color: Theme.colors.grey5,
              alignSelf: 'center',
              fontSize: 16,
              fontFamily: Theme.fonts.fontFamilyRegular,
            }}
          >
            Already have an account?
          </Text>
          <WhiteButton
            outlined
            label="Login"
            onPress={() => navigateInAuthStack('LoginScreen')}
            style={{ marginTop: 12, height: 56 }}
          />
        </View>
      </ScrollView>
    </NoMedia>
  );
}
