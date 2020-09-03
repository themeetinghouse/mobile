import React, { useState, useContext, useEffect } from 'react';
import { Auth } from '@aws-amplify/auth'
import { StyleSheet, View, TextInput, Text, NativeSyntheticEvent, TextInputKeyPressEventData, TouchableWithoutFeedback, SafeAreaView, Keyboard, TouchableOpacity } from 'react-native';
import WhiteButton from '../../components/buttons/WhiteButton'
import { Theme, Style } from '../../Theme.style';
import UserContext from '../../contexts/UserContext';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { MainStackParamList } from '../../navigation/AppNavigator';
import MediaContext from '../../contexts/MediaContext';

const style = StyleSheet.create({
    title: {
        ...Style.cardTitle, ...{
            paddingLeft: 0,
            paddingTop: 26,
            lineHeight: 24,
        }
    },
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
    forgotPassText: {
        color: Theme.colors.grey5,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 8
    }
})

interface Params {
    navigation: CompositeNavigationProp<
        StackNavigationProp<AuthStackParamList, 'ForgotPasswordScreen'>,
        StackNavigationProp<MainStackParamList, 'Auth'>
    >;
}

export default function Login({ navigation }: Params): JSX.Element {
    const userContext = useContext(UserContext);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const media = useContext(MediaContext);

    useEffect(() => {
        async function closeMedia() {
            if (media.media.audio) {
                try {
                    await media.media.audio?.sound.unloadAsync();
                } catch (e) {
                    console.debug(e)
                }
            }
            media.setMedia({ video: null, videoTime: 0, audio: null, playerType: 'none', playing: false, series: '', episode: '' });
        }
        closeMedia();
    }, [])

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
        navigation.push("LoginScreen")
    }

    function toHome(): void {
        setUser('');
        setPass('');
        setCode('');
        setError('');
        setCodeSent(false);
        navigation.push("Main", { screen: "Home", params: { screen: "HomeScreen" } })
    }

    function handleEnter(keyEvent: NativeSyntheticEvent<TextInputKeyPressEventData>, cb: () => any): void {
        if (keyEvent.nativeEvent.key === 'Enter')
            cb();
    }

    const sendCode = async () => {
        try {
            await Auth.forgotPassword(user).then(() => updateCodeState(true))
        } catch (e) {
            console.error(e)
            if (e.code === "UserNotFoundException")
                setError('Username not found.')
            else if (e.code === 'InvalidPasswordException')
                setError(e.message.split(': ')[1])
            else if (e.code === 'InvalidParameterException')
                setError('Password not long enough')
            else
                setError(e.message)
        }
    }

    const reset = async () => {
        try {
            await Auth.forgotPasswordSubmit(user, code, pass).then(() => updateCodeState(true))
        } catch (e) {
            console.error(e)
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
                <TextInput onKeyPress={(e) => handleEnter(e, sendCode)} keyboardAppearance="dark" autoCompleteType="email" textContentType="emailAddress" keyboardType="email-address" style={style.input} value={user} autoCapitalize="none" onChange={(e) => setUser(e.nativeEvent.text)} />
                <View style={{ marginTop: 12 }}>
                    <Text style={{ color: Theme.colors.red, alignSelf: 'center', fontFamily: Theme.fonts.fontFamilyRegular, fontSize: 12, height: 12 }}>{error}</Text>
                </View>
                <WhiteButton label={"Submit"} onPress={sendCode} style={{ marginTop: 12, height: 56 }} />
                <TouchableOpacity onPress={() => updateCodeState(true)} style={{ alignSelf: 'flex-end' }}><Text style={style.forgotPassText}>Submit a Code</Text></TouchableOpacity>
            </View>
                : <View style={{ flexGrow: 1, backgroundColor: 'black', width: '100%', paddingHorizontal: '5%', paddingBottom: 56 }}>
                    <Text style={style.title}>Email</Text>
                    <TextInput keyboardAppearance="dark" autoCompleteType="email" textContentType="emailAddress" keyboardType="email-address" style={style.input} value={user} autoCapitalize="none" onChange={(e) => setUser(e.nativeEvent.text)} />
                    <Text style={style.title}>One-Time Security Code</Text>
                    <TextInput keyboardAppearance="dark" textContentType="oneTimeCode" keyboardType="number-pad" style={style.input} value={code} onChange={(e) => setCode(e.nativeEvent.text)} />
                    <Text style={style.title}>New Password</Text>
                    <TextInput textContentType="newPassword" passwordRules="required: lower; required: upper; required: digit; required: special; minlength: 8;" keyboardAppearance="dark" onKeyPress={(e) => handleEnter(e, reset)} value={pass} onChange={e => setPass(e.nativeEvent.text)} secureTextEntry={true} style={style.input} />
                    <View style={{ marginTop: 12 }}>
                        <Text style={{ color: Theme.colors.red, alignSelf: 'center', fontFamily: Theme.fonts.fontFamilyRegular, fontSize: 12, height: 12 }}>{error}</Text>
                    </View>
                    <WhiteButton label={"Submit"} onPress={reset} style={{ marginTop: 12, height: 56 }} />
                </View>}
            <View style={{ flexGrow: 0, paddingBottom: 52, backgroundColor: Theme.colors.background, paddingHorizontal: '5%' }}>
                <WhiteButton outlined label={userContext?.userData?.email_verified ? "Back to home" : "Back to login"}
                    onPress={userContext?.userData?.email_verified ? () => toHome() : () => toLogin()} style={{ marginTop: 24, height: 56 }}
                />
            </View>
        </View>
    </TouchableWithoutFeedback>
}