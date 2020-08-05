import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { View, TextInput, Text, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import WhiteButton from '../../components/buttons/WhiteButton'
import { Theme, Style } from '../../Theme.style';

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
    }
}

interface Props {
    authState: string;
    onStateChange: (state: string) => any;
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

    function handleEnter(keyEvent: NativeSyntheticEvent<TextInputKeyPressEventData>): void {
        if (keyEvent.nativeEvent.key === 'Enter')
            signUp();
    }

    const signUp = async () => {
        try {
            const result = await Auth.signUp(user, pass).then(() => changeAuthState('SignIn'))
            console.log(result)
        } catch (e) {
            setError(e.message)
        }
    }

    return (props.authState === 'confirmSignUp' ?
        <View style={{ minHeight: '100%', width: '100%' }}>
            <View style={{ backgroundColor: 'black', minHeight: '100%', width: '100%', paddingHorizontal: '5%' }}>
                <Text style={style.title}>Email</Text>
                <TextInput autoCompleteType="email" textContentType="emailAddress" autoFocus keyboardType="email-address" style={style.input} value={user} onChange={(e) => setUser(e.nativeEvent.text)} />
                <Text style={style.title}>Password</Text>
                <TextInput autoCompleteType="password" textContentType="password" onKeyPress={(e) => handleEnter(e)} value={pass} onChange={e => setPass(e.nativeEvent.text)} secureTextEntry={true} style={style.input}></TextInput>
                <WhiteButton label="Create Account" onPress={signUp} style={{ marginTop: 24, height: 56 }} />
                <Text style={{ color: Theme.colors.grey5 }}>Verify a Code</Text>
            </View>
            <View style={{ position: 'absolute', width: '100%', bottom: 0, paddingBottom: 39, paddingTop: 16, backgroundColor: Theme.colors.background, paddingHorizontal: '5%' }}>
                <Text style={{ color: Theme.colors.grey5 }}>Already an account?</Text>
                <WhiteButton outlined label="Login" onPress={() => changeAuthState('signIn')} style={{ marginTop: 24, height: 56 }} />
            </View>
        </View>
        : null)
} 