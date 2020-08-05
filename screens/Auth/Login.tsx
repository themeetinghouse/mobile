import React, { useState } from 'react';
import { View, Text, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import { Auth } from 'aws-amplify';
import { Theme, Style } from '../../Theme.style';
import WhiteButton from '../../components/buttons/WhiteButton'
import { NavigationScreenProp } from 'react-navigation';

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
        lineHeight: 24,
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
        lineHeight: 24,
        paddingHorizontal: 20
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
    authState: string;
    onStateChange: (state: string) => any;
    navigation: NavigationScreenProp<any, any>;
}

export default function Login(props: Props): JSX.Element | null {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    function changeAuthState(state: string): void {
        setUser('');
        setPass('');
        setError('');
        props.onStateChange(state);
    }

    function handleEnter(keyEvent: NativeSyntheticEvent<TextInputKeyPressEventData>, cb: () => any): void {
        if (keyEvent.nativeEvent.key === 'Enter')
            cb();
    }

    const signIn = async () => {
        try {
            const result = await Auth.signIn(user, pass).then(() => props.navigation.navigate('Main'))
            console.log(result)
        } catch (e) {
            setError(e.message)
        }
    }

    const signUp = async () => {
        try {
            const result = await Auth.signUp(user, pass).then(() => changeAuthState('SignIn'))
            console.log(result)
        } catch (e) {
            setError(e.message)
        }
    }

    return (props.authState === 'signIn' || props.authState === 'signUp' ?
        <View style={{ minHeight: '100%', width: '100%' }}>
            <View style={{ flexGrow: 1, backgroundColor: 'black', width: '100%', paddingHorizontal: '5%' }}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
                    <Text style={props.authState === 'signIn' ? style.headerTextActive : style.headerTextInactive}>Login</Text>
                    <Text style={props.authState === 'signUp' ? style.headerTextActive : style.headerTextInactive}>Sign Up</Text>
                </View>
                <Text style={style.title}>Email</Text>
                <TextInput autoCompleteType="email" textContentType="emailAddress" autoFocus keyboardType="email-address" style={style.input} value={user} onChange={(e) => setUser(e.nativeEvent.text)} />
                <Text style={style.title}>Password</Text>
                {props.authState === 'signIn' ?
                    <TextInput autoCompleteType="password" textContentType="password" onKeyPress={(e) => handleEnter(e, signIn)} value={pass} onChange={e => setPass(e.nativeEvent.text)} secureTextEntry={true} style={style.input} />
                    : <TextInput onKeyPress={(e) => handleEnter(e, signUp)} value={pass} onChange={e => setPass(e.nativeEvent.text)} secureTextEntry={true} style={style.input} />}
                {props.authState === 'signIn' ? <Text style={{ color: Theme.colors.grey5 }}>Forgot Password?</Text> : null}
                <WhiteButton label={props.authState === 'signIn' ? "Log In" : "Create Account"} onPress={props.authState === 'signIn' ? signIn : signUp} style={{ marginTop: 24, height: 56 }} />
                {props.authState === 'signUp' ? <Text style={{ color: Theme.colors.grey5 }}>Verify a Code</Text> : null}
            </View>
            {props.authState === 'signIn' ?
                <View style={{ flexGrow: 0, paddingBottom: 39, paddingTop: 16, backgroundColor: Theme.colors.background, paddingHorizontal: '5%' }}>
                    <Text style={{ color: Theme.colors.grey5, alignSelf: 'center', fontSize: 16, fontFamily: Theme.fonts.fontFamilyRegular }}>Don&apos;t have an account?</Text>
                    <WhiteButton outlined label="Sign Up" onPress={() => changeAuthState('signUp')} style={{ marginTop: 12, height: 56 }} />
                    <WhiteButton outlined label="Continue as Guest" onPress={() => props.navigation.navigate('Main')} style={{ marginTop: 24, height: 56 }} />
                </View>
                : <View style={{ flexGrow: 0, paddingBottom: 39, paddingTop: 16, backgroundColor: Theme.colors.background, paddingHorizontal: '5%' }}>
                    <Text style={{ color: Theme.colors.grey5, alignSelf: 'center', fontSize: 16, fontFamily: Theme.fonts.fontFamilyRegular }}>Already have an account?</Text>
                    <WhiteButton outlined label="Login" onPress={() => changeAuthState('signIn')} style={{ marginTop: 12, height: 56 }} />
                    <WhiteButton outlined label="Continue as Guest" onPress={() => props.navigation.navigate('Main')} style={{ marginTop: 24, height: 56 }} />
                </View>}
        </View >
        : null)
}