import React, { useState, useContext } from 'react';
import { Auth } from '@aws-amplify/auth'
import { View, TextInput, Text, NativeSyntheticEvent, TextInputKeyPressEventData, TouchableWithoutFeedback, SafeAreaView, Keyboard, TouchableOpacity } from 'react-native';
import WhiteButton from '../../components/buttons/WhiteButton'
import { Theme, Style } from '../../Theme.style';
import UserContext from '../../contexts/UserContext';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { MainStackParamList } from '../../navigation/AppNavigator';

const style = {
    title: [Style.cardTitle, {
        paddingLeft: 0,
        paddingTop: 26,
        lineHeight: 24,
    }],
    input: {
        backgroundColor: Theme.colors.gray1,
        borderColor: Theme.colors.grey3,
        fontFamily: Theme.fonts.fontFamilyRegular,
        borderWidth: 1,
        height: 56,
        color: 'white',
        fontSize: 16,
        paddingHorizontal: 20
    },
    inputSelected: {
        backgroundColor: Theme.colors.gray1,
        borderColor: 'white',
        fontFamily: Theme.fonts.fontFamilyRegular,
        borderWidth: 3,
        height: 56,
        color: 'white',
        fontSize: 16,
        paddingHorizontal: 20
    },
    headerTextActive: {
        color: 'white',
        fontSize: 16,
        lineHeight: 24,
        fontFamily: Theme.fonts.fontFamilyBold,
        paddingHorizontal: 16,
    },
}

interface Props {
    navigation: CompositeNavigationProp<
        StackNavigationProp<AuthStackParamList, 'ForgotPasswordScreen'>, 
        StackNavigationProp<MainStackParamList>
    >;
}

export default function Login(props: Props): JSX.Element {
    const userContext = useContext(UserContext);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    function updateCodeState(state: boolean): void {
        setPass('');
        setCode('');
        setError('');
        setCodeSent(state);
    }

    function toLogin(): void {
        setUser('');
        setPass('');
        setCode('');
        setError('');
        setCodeSent(false);
        props.navigation.navigate('LoginScreen')
    }

    function toHome(): void {
        setUser('');
        setPass('');
        setCode('');
        setError('');
        setCodeSent(false);
        props.navigation.navigate('Main', {screen: 'Home', params: { screen: 'HomeScreen' }})
    }

    function handleEnter(keyEvent: NativeSyntheticEvent<TextInputKeyPressEventData>, cb: () => any): void {
        if (keyEvent.nativeEvent.key === 'Enter')
            cb();
    }

    const sendCode = async () => {
        try {
            await Auth.forgotPassword(user).then(() => updateCodeState(true))
        } catch (e) {
            setError(e.message)
        }
    }

    const reset = async () => {
        try {
            await Auth.forgotPasswordSubmit(user, code, pass).then(() => updateCodeState(true))
        } catch (e) {
            setError(e.message)
        }
    }

    return <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ width: '100%', flex: 1 }}>
            <SafeAreaView style={{ backgroundColor: 'black' }} />
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 20, backgroundColor: 'black' }}>
                <Text style={style.headerTextActive}>Reset your password</Text>
            </View>
            {!codeSent ? <View style={{ flexGrow: 1, backgroundColor: 'black', width: '100%', paddingHorizontal: '5%', paddingBottom: 56 }}>
                <Text style={style.title}>Email</Text>
                <TextInput onKeyPress={(e) => handleEnter(e, sendCode)} keyboardAppearance="dark" autoCompleteType="email" textContentType="emailAddress" keyboardType="email-address" style={style.input} value={user} onChange={(e) => setUser(e.nativeEvent.text)} />
                <WhiteButton label={"Submit"} onPress={sendCode} style={{ marginTop: 24, height: 56 }} />
                <TouchableOpacity onPress={() => updateCodeState(true)}><Text style={{ color: Theme.colors.grey5 }}>Submit a Code</Text></TouchableOpacity>
            </View>
                : <View style={{ flexGrow: 1, backgroundColor: 'black', width: '100%', paddingHorizontal: '5%', paddingBottom: 56 }}>
                    <Text style={style.title}>Email</Text>
                    <TextInput keyboardAppearance="dark" autoCompleteType="email" textContentType="emailAddress" keyboardType="email-address" style={style.input} value={user} onChange={(e) => setUser(e.nativeEvent.text)} />
                    <Text style={style.title}>One-Time Security Code</Text>
                    <TextInput keyboardAppearance="dark" textContentType="oneTimeCode" keyboardType="number-pad" style={style.input} value={code} onChange={(e) => setCode(e.nativeEvent.text)} />
                    <Text style={style.title}>New Password</Text>
                    <TextInput keyboardAppearance="dark" autoCompleteType="password" textContentType="password" onKeyPress={(e) => handleEnter(e, reset)} value={pass} onChange={e => setPass(e.nativeEvent.text)} secureTextEntry={true} style={style.input} />
                    <WhiteButton label={"Submit"} onPress={reset} style={{ marginTop: 24, height: 56 }} />
                </View>}
            <View style={{ flexGrow: 0, paddingBottom: 52, backgroundColor: Theme.colors.background, paddingHorizontal: '5%' }}>
                <WhiteButton outlined label={userContext?.userData?.email_verified ? "Back to home" : "Back to login"} 
                    onPress={userContext?.userData?.email_verified ? () => toHome() : () => toLogin()} style={{ marginTop: 24, height: 56 }} 
                />
            </View>
        </View>
    </TouchableWithoutFeedback>
}