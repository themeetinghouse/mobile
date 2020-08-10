import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, TouchableOpacity, Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native'
import { Auth } from '@aws-amplify/auth'
import { Theme, Style } from '../../Theme.style';
import WhiteButton from '../../components/buttons/WhiteButton'
import UserContext from '../../contexts/UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/AppNavigator'

const style = {
    title: [Style.cardTitle, {
        paddingLeft: 0,
        paddingTop: 26,
        lineHeight: 24,
    }],
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
        paddingHorizontal: 20
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
    }
}


interface Props {
    navigation: CompositeNavigationProp<StackNavigationProp<AuthStackParamList>, StackNavigationProp<MainStackParamList>>;
}

type Screens = keyof AuthStackParamList | keyof MainStackParamList

export default function Login(props: Props): JSX.Element {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    const userContext = useContext(UserContext);

    useEffect(() => {
        if (userContext?.userData?.email_verified) {
            props.navigation.navigate('Main', { screen: 'Home', params: { screen: 'HomeScreen' } })
        }
    }, []);

    function navigate(screen: Screens, screenProps?: any): void {
        setUser('');
        setPass('');
        setError('');
        props.navigation.navigate(screen, screenProps)
    }

    function handleEnter(keyEvent: NativeSyntheticEvent<TextInputKeyPressEventData>, cb: () => any): void {
        if (keyEvent.nativeEvent.key === 'Enter')
            cb();
    }

    const signIn = async () => {
        try {
            await Auth.signIn(user, pass)
            const userSignedIn = await Auth.currentAuthenticatedUser();
            userContext?.setUserData(userSignedIn.attributes)
            navigate('Main', { screen: 'Home', params: { screen: 'HomeScreen' } })
        } catch (e) {
            setError(e.message)
        }
    }

    return <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ width: '100%', flex: 1 }}>
            <SafeAreaView style={{ backgroundColor: 'black' }} />
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 20, backgroundColor: 'black' }}>
                <Text style={style.headerTextActive}>Login</Text>
                <Text onPress={() => navigate('SignUpScreen')} style={style.headerTextInactive}>Sign Up</Text>
            </View>
            <View style={{ flexGrow: 1, backgroundColor: 'black', width: '100%', paddingHorizontal: '5%', paddingBottom: 56 }}>
                <Text style={style.title}>Email</Text>
                <TextInput keyboardAppearance="dark" autoCompleteType="email" textContentType="emailAddress" keyboardType="email-address" style={style.input} value={user} onChange={(e) => setUser(e.nativeEvent.text)} />
                <Text style={style.title}>Password</Text>
                <TextInput keyboardAppearance="dark" autoCompleteType="password" textContentType="password" onKeyPress={(e) => handleEnter(e, signIn)} value={pass} onChange={e => setPass(e.nativeEvent.text)} secureTextEntry={true} style={style.input} />
                <TouchableOpacity onPress={() => navigate('ForgotPasswordScreen')}><Text style={{ color: Theme.colors.grey5 }}>Forgot Password?</Text></TouchableOpacity>
                <WhiteButton label={"Log In"} onPress={signIn} style={{ marginTop: 24, height: 56 }} />
                <WhiteButton label="Continue as Guest" onPress={() => navigate('Main', { screen: 'Home', params: { screen: 'HomeScreen' } })} style={{ marginTop: 24, height: 56 }} />
            </View>
            <View style={{ flexGrow: 0, paddingTop: 16, paddingBottom: 52, backgroundColor: Theme.colors.background, paddingHorizontal: '5%' }}>
                <Text style={{ color: Theme.colors.grey5, alignSelf: 'center', fontSize: 16, fontFamily: Theme.fonts.fontFamilyRegular }}>Don&apos;t have an account?</Text>
                <WhiteButton outlined label="Sign Up" onPress={() => navigate('SignUpScreen')} style={{ marginTop: 12, height: 56 }} />
            </View>
        </View>
    </TouchableWithoutFeedback>
}