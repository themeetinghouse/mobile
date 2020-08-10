import React, { useState } from 'react';
import { Auth } from '@aws-amplify/auth'
import { View, TextInput, Text, NativeSyntheticEvent, TextInputKeyPressEventData, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import WhiteButton from '../../components/buttons/WhiteButton'
import { Theme, Style } from '../../Theme.style';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

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
    navigation: StackNavigationProp<AuthStackParamList, 'ConfirmSignUpScreen'>;
}

export default function Login(props: Props): JSX.Element {
    const [user, setUser] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    function toLogin(): void {
        setUser('');
        setError('');
        props.navigation.navigate('LoginScreen')
    }

    function handleEnter(keyEvent: NativeSyntheticEvent<TextInputKeyPressEventData>): void {
        if (keyEvent.nativeEvent.key === 'Enter')
            confirm();
    }

    const confirm = async () => {
        try {
            await Auth.confirmSignUp(user, code).then(() => toLogin())
        } catch (e) {
            console.error(e)
            setError(e.message)
        }
    }

    return <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ width: '100%', flex: 1 }}>
            <SafeAreaView style={{ backgroundColor: 'black' }} />
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 20, backgroundColor: 'black' }}>
                <Text style={style.headerTextActive}>Confirm your account</Text>
            </View>
            <View style={{ flexGrow: 1, backgroundColor: 'black', width: '100%', paddingHorizontal: '5%', paddingBottom: 56 }}>
                <Text style={style.title}>Email</Text>
                <TextInput keyboardAppearance="dark" autoCompleteType="email" textContentType="emailAddress" keyboardType="email-address" style={style.input} value={user} onChange={(e) => setUser(e.nativeEvent.text)} />
                <Text style={style.title}>One-Time Security Code</Text>
                <TextInput onKeyPress={(e) => handleEnter(e)} keyboardAppearance="dark" textContentType="oneTimeCode" keyboardType="number-pad" style={style.input} value={code} onChange={(e) => setCode(e.nativeEvent.text)} />
                <WhiteButton label={"Submit"} onPress={confirm} style={{ marginTop: 24, height: 56 }} />
            </View>
            <View style={{ flexGrow: 0, paddingBottom: 52, backgroundColor: Theme.colors.background, paddingHorizontal: '5%' }}>
                <WhiteButton outlined label="Back to login" onPress={() => toLogin()} style={{ marginTop: 24, height: 56 }} />
            </View>
        </View>
    </TouchableWithoutFeedback>
} 