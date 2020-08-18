import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, TouchableOpacity, Keyboard, TouchableWithoutFeedback, ViewStyle, ScrollView } from 'react-native'
import { Auth } from '@aws-amplify/auth'
import { Theme, Style } from '../../Theme.style';
import WhiteButton from '../../components/buttons/WhiteButton'
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { RouteProp, useRoute, CompositeNavigationProp } from '@react-navigation/native';
import { Thumbnail, Button } from 'native-base';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MediaContext from '../../contexts/MediaContext';

const style = {
    title: [Style.cardTitle, {
        paddingLeft: 0,
        paddingTop: 26,
        lineHeight: 24,
    }],
    locationSelector: {
        backgroundColor: Theme.colors.gray1,
        borderColor: Theme.colors.grey3,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    } as ViewStyle,
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
    },
    forgotPassText: {
        color: Theme.colors.grey5,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: 12,
        lineHeight: 18,
        marginTop: 8
    }
}


interface Props {
    navigation: CompositeNavigationProp<StackNavigationProp<AuthStackParamList>, StackNavigationProp<MainStackParamList>>;
}

export default function SignUp(props: Props): JSX.Element {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [site, setSite] = useState({ locationName: '', locationId: '' });
    const [error, setError] = useState('');
    const route = useRoute<RouteProp<AuthStackParamList, 'SignUpScreen'>>();
    const safeArea = useSafeAreaInsets();
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
    }, []);

    useEffect(() => {
        if (route.params?.locationName && route.params.locationId)
            setSite({ locationName: route.params.locationName, locationId: route.params.locationId })
    }, [route]);

    function navigate(screen: keyof AuthStackParamList | keyof MainStackParamList, screenProps?: any): void {
        setUser('');
        setPass('');
        setSite({ locationName: '', locationId: '' });
        setError('');
        props.navigation.navigate(screen, screenProps)
    }

    function handleEnter(keyEvent: NativeSyntheticEvent<TextInputKeyPressEventData>, cb: () => any): void {
        if (keyEvent.nativeEvent.key === 'Enter')
            cb();
    }

    const signUp = async () => {

        const regex = /\S+@\S+\.\S+/
        if (!regex.test(user)) {
            setError('Invalid email address');
            return
        }

        try {
            await Auth.signUp({ username: user, password: pass, attributes: { email: user, 'custom:home_location': site.locationId } }).then(() => navigate('ConfirmSignUpScreen'))
        } catch (e) {
            console.debug(e)
            if (e.code === 'InvalidPasswordException')
                setError(e.message.split(': ')[1])
            else if (e.code === 'InvalidParameterException')
                setError('Password not long enough')
            else
                setError(e.message)
        }
    }

    return <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={{ width: '100%', paddingTop: safeArea.top }} contentContainerStyle={{ flex: 1 }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 20, backgroundColor: 'black' }}>
                <Button transparent style={{ position: 'absolute', left: '5%' }} onPress={() => navigate('Main', { screen: 'Home', params: { screen: 'HomeScreen' } })} >
                    <Thumbnail square source={Theme.icons.white.closeCancel} style={{ width: 24, height: 24 }}></Thumbnail>
                </Button>
                <Text onPress={() => navigate('LoginScreen')} style={style.headerTextInactive}>Login</Text>
                <Text style={style.headerTextActive}>Sign Up</Text>
            </View>
            <View style={{ flexGrow: 1, backgroundColor: 'black', width: '100%', paddingHorizontal: '5%', paddingBottom: 56 }}>
                <Text style={style.title}>Email</Text>
                <TextInput keyboardAppearance="dark" autoCompleteType="email" textContentType="emailAddress" keyboardType="email-address" autoCapitalize="none" style={style.input} value={user} onChange={(e) => setUser(e.nativeEvent.text)} />
                <Text style={style.title}>Password</Text>
                <TextInput textContentType="newPassword" passwordRules="required: lower; required: upper; required: digit; required: special; minlength: 8;" keyboardAppearance="dark" onKeyPress={(e) => handleEnter(e, signUp)} value={pass} onChange={e => setPass(e.nativeEvent.text)} secureTextEntry={true} style={style.input} />
                <Text style={style.title}>Choose Your Location</Text>
                <TouchableOpacity style={style.locationSelector} onPress={() => props.navigation.navigate('LocationSelectionScreen')} >
                    <Text style={style.locationText}>{site.locationName ? site.locationName : 'None Selected'}</Text>
                    <AntDesign name="caretdown" size={8} color="white" />
                </TouchableOpacity>
                <View style={{ marginTop: 12 }}>
                    <Text style={{ color: Theme.colors.red, alignSelf: 'center', fontFamily: Theme.fonts.fontFamilyRegular, fontSize: 12, height: 12 }}>{error}</Text>
                </View>
                <WhiteButton label={"Create Account"} onPress={signUp} style={{ marginTop: 12, height: 56 }} />
                <TouchableOpacity onPress={() => navigate('ConfirmSignUpScreen')} style={{ alignSelf: 'flex-end' }} ><Text style={style.forgotPassText}>Verify a Code</Text></TouchableOpacity>
            </View>
            <View style={{ flexGrow: 0, paddingTop: 16, paddingBottom: 52, backgroundColor: Theme.colors.background, paddingHorizontal: '5%' }}>
                <Text style={{ color: Theme.colors.grey5, alignSelf: 'center', fontSize: 16, fontFamily: Theme.fonts.fontFamilyRegular }}>Already have an account?</Text>
                <WhiteButton outlined label="Login" onPress={() => navigate('LoginScreen')} style={{ marginTop: 12, height: 56 }} />
            </View>
        </ScrollView>
    </TouchableWithoutFeedback>
}