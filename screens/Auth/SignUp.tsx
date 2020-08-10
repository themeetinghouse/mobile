import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, TouchableOpacity, Keyboard, TouchableWithoutFeedback, SafeAreaView } from 'react-native'
import { Auth } from '@aws-amplify/auth'
import { Theme, Style } from '../../Theme.style';
import WhiteButton from '../../components/buttons/WhiteButton'
import LocationService, { Location } from '../../services/LocationsService';
import { Icon, Picker } from 'native-base';
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
    navigation: StackNavigationProp<AuthStackParamList, 'SignUpScreen'>;
}

export default function Login(props: Props): JSX.Element {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [site, setSite] = useState('Oakville');
    const [error, setError] = useState('');
    const [siteList, setSiteList] = useState<Location[]>([]);

    useEffect(() => {
        async function loadData() {
            const locations = await LocationService.loadLocations();
            setSiteList(locations);
        }

        loadData();
    }, [])

    function navigate(screen: keyof AuthStackParamList, screenProps?: any): void {
        setUser('');
        setPass('');
        setSite('Oakville');
        setError('');
        props.navigation.navigate(screen, screenProps)
    }

    function handleEnter(keyEvent: NativeSyntheticEvent<TextInputKeyPressEventData>, cb: () => any): void {
        if (keyEvent.nativeEvent.key === 'Enter')
            cb();
    }

    const signUp = async () => {
        try {
            await Auth.signUp({ username: user, password: pass, attributes: { email: user } }).then(() => navigate('ConfirmSignUpScreen'))
        } catch (e) {
            setError(e.message)
        }
    }

    return <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ width: '100%', flex: 1 }}>
            <SafeAreaView style={{ backgroundColor: 'black' }} />
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 20, backgroundColor: 'black' }}>
                <Text onPress={() => navigate('LoginScreen')} style={style.headerTextInactive}>Login</Text>
                <Text style={style.headerTextActive}>Sign Up</Text>
            </View>
            <View style={{ flexGrow: 1, backgroundColor: 'black', width: '100%', paddingHorizontal: '5%', paddingBottom: 56 }}>
                <Text style={style.title}>Email</Text>
                <TextInput keyboardAppearance="dark" autoCompleteType="email" textContentType="emailAddress" keyboardType="email-address" style={style.input} value={user} onChange={(e) => setUser(e.nativeEvent.text)} />
                <Text style={style.title}>Password</Text>
                <TextInput keyboardAppearance="dark" onKeyPress={(e) => handleEnter(e, signUp)} value={pass} onChange={e => setPass(e.nativeEvent.text)} secureTextEntry={true} style={style.input} />
                <View>
                    <Text style={style.title}>Choose Your Home Site</Text>
                    <Picker
                        selectedValue={site}
                        onValueChange={e => setSite(e)}
                        textStyle={{ color: 'white', fontSize: 16 }}
                        style={style.picker}
                        placeholder="None Selected" mode="dropdown"
                        iosIcon={<Icon name="md-arrow-dropdown" style={{ color: "white" }} />}
                    >
                        {siteList.sort((a, b) => a.id.localeCompare(b.id)).map((site) => {
                            return <Picker.Item key={site.id} label={site.name} value={site.id} />
                        })}
                    </Picker>
                </View>
                <WhiteButton label={"Create Account"} onPress={signUp} style={{ marginTop: 24, height: 56 }} />
                <TouchableOpacity onPress={() => navigate('ConfirmSignUpScreen')}><Text style={{ color: Theme.colors.grey5 }}>Verify a Code</Text></TouchableOpacity>
            </View>
            <View style={{ flexGrow: 0, paddingTop: 16, paddingBottom: 52, backgroundColor: Theme.colors.background, paddingHorizontal: '5%' }}>
                <Text style={{ color: Theme.colors.grey5, alignSelf: 'center', fontSize: 16, fontFamily: Theme.fonts.fontFamilyRegular }}>Already have an account?</Text>
                <WhiteButton outlined label="Login" onPress={() => navigate('LoginScreen')} style={{ marginTop: 12, height: 56 }} />
            </View>
        </View>
    </TouchableWithoutFeedback>
}