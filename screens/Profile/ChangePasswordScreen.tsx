import React, { useState, useContext } from 'react';
import { Container, Header, Content, Text, Left, Button, Body, Right, View, Thumbnail, List, ListItem } from 'native-base';
import Theme, { Style } from '../../Theme.style';
import { StatusBar, ViewStyle, TextStyle, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { Auth } from '@aws-amplify/auth'
import { TextInput } from 'react-native-gesture-handler';
import UserContext from '../../contexts/UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { CommonActions, CompositeNavigationProp } from '@react-navigation/native';

const style = {
    content: [Style.cardContainer, {
        backgroundColor: Theme.colors.background,
    }],
    header: [Style.header, {}],
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerBody: {
        flexGrow: 3,
        justifyContent: "center",
    } as ViewStyle,
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50,
        right: 6,
    },
    headerTitle: [Style.header.title, {
        width: "100%",
    }] as TextStyle,
    title: [Style.title, {
        marginTop: 130,
        marginBottom: 16,
    }],
    body: [Style.body, {
        marginBottom: 40,
    }],
    listItem: {
        marginLeft: 0,
        borderColor: Theme.colors.gray2,
        backgroundColor: 'black'
    },
    listText: {
        fontSize: Theme.fonts.medium,
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
        marginTop: 10
    },
    listIcon: [Style.icon, {
        marginRight: 16,
        marginLeft: 16,
    }],
    listArrowIcon: [Style.icon, {
    }],
    headerText: {
        fontSize: 16,
        fontFamily: Theme.fonts.fontFamilyRegular,
        color: 'white',
        lineHeight: 24,
    },
    input: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        color: 'white',
        fontSize: 24,
        paddingLeft: 16
    }
}

interface Params {
    navigation: CompositeNavigationProp<StackNavigationProp<HomeStackParamList>, StackNavigationProp<MainStackParamList>>;
}

export default function ChangePass({ navigation }: Params): JSX.Element {

    const userContext = useContext(UserContext);

    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [error, setError] = useState('');

    function forgotPass(): void {
        setCurrentPass('');
        setNewPass('');
        setError('');
        navigation.navigate('Auth', { screen: 'ForgotPasswordScreen' })
    }

    const signOut = async () => {
        await Auth.signOut().then(() => {
            userContext?.setUserData(null);
            navigation.dispatch(
                CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: 'Auth' }
                    ]
                })
            )
        });
    }

    const deleteUser = async (): Promise<void> => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            const del = user.deleteUser();
            console.log(del)
            signOut();
        } catch (e) {
            setError(e)
            console.debug(e)
        }
    }

    const changePassword = async (): Promise<void> => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(user, currentPass, newPass);
            signOut();
        } catch (e) {
            setError(e)
            console.debug(e)
        }

    }

    return <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container>
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Thumbnail style={Style.icon} source={Theme.icons.white.arrowLeft} square></Thumbnail>
                    </Button>
                </Left>
                <Body style={style.headerBody}>
                    <Text style={style.headerTitle}>Change Password</Text>
                </Body>
                <Right style={style.headerRight}>
                    <TouchableOpacity disabled={!(currentPass && newPass)} onPress={changePassword}>
                        <Text style={currentPass && newPass ? Style.header.linkText : Style.header.linkTextInactive}>Save</Text>
                    </TouchableOpacity>
                </Right>
            </Header>
            <Content style={style.content}>
                <View>
                    <List>
                        <View style={{ height: 15, backgroundColor: Theme.colors.background, padding: 0 }} />
                        <ListItem style={style.listItem}>
                            <View style={{ display: 'flex', flexDirection: 'column' }}>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Text style={style.listText}>Current Password</Text>
                                    <View style={{ width: Dimensions.get('window').width - 150 }}>
                                        <TextInput secureTextEntry autoCompleteType="password" textContentType="password" keyboardAppearance='dark' style={style.input} value={currentPass} onChange={(e) => setCurrentPass(e.nativeEvent.text)}></TextInput>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-start' }}>
                                    <Text onPress={() => forgotPass()} style={style.listSubtext}>Forgot password?</Text>
                                </View>
                            </View>
                        </ListItem>
                        <View style={{ height: 15, backgroundColor: Theme.colors.background, padding: 0 }} />
                        <ListItem style={style.listItem}>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <Text style={style.listText}>New Password</Text>
                                <View style={{ width: Dimensions.get('window').width - 150 }}>
                                    <TextInput secureTextEntry keyboardAppearance='dark' style={style.input} value={newPass} onChange={(e) => setNewPass(e.nativeEvent.text)}></TextInput>
                                </View>
                            </View>
                        </ListItem>
                    </List>
                </View>
            </Content>
        </Container>
    </TouchableWithoutFeedback>
}
