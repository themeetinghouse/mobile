import React, { useState } from 'react';
import { Container, Header, Content, Text, Left, Button, Body, Right, View, Thumbnail, List, ListItem, Separator } from 'native-base';
import Theme, { Style } from '../../Theme.style';
import { StatusBar, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';
import { TextInput } from 'react-native-gesture-handler';

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
    headerButtonText: [Style.header.linkText, {}],
    title: [Style.title, {
        marginTop: 130,
        marginBottom: 16,
    }],
    body: [Style.body, {
        marginBottom: 40,
    }],
    searchIcon: [Style.icon, {}],
    searchInput: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
    },
    listItem: {
        marginLeft: 0,
        borderColor: Theme.colors.gray2,
        backgroundColor: 'black'
    },
    listText: {
        fontSize: Theme.fonts.medium,
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        marginLeft: 16
    },
    listSubtext: {
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.gray5,
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
    }
}

interface Params {
    navigation: any;
}

export default function ChangePass({ navigation }: Params): JSX.Element {

    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');

    const nav = () => {
        navigation.navigate()
    }

    const changePassword = async () => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            await Auth.changePassword(user, currentPass, newPass).then(()=>navigation);

        } catch (e) {
            console.debug(e)
        }

    }

    return (
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
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Text style={style.headerButtonText}>Save</Text>
                    </TouchableOpacity>
                </Right>
            </Header>
            <Content style={style.content}>
                <View>
                    <List>
                    <View style={{ height: 15, backgroundColor: Theme.colors.background, padding: 0 }} />

                    <ListItem style={style.listItem}>
                        <Left>
                            <View>
                                <Text style={style.listText}>Current Password</Text>
                                <Text style={style.listSubtext}>Forgot password?</Text>
                            </View>
                        </Left>
                        <View>
                        </View>
                    </ListItem>
                    <View style={{ height: 15, backgroundColor: Theme.colors.background, padding: 0 }} />
                    <ListItem style={style.listItem}>
                        <Left>
                            <View>
                                <Text style={style.listText}>New Password</Text>
                            </View>
                        </Left>
                        <View>
                            <TextInput ></TextInput>
                        </View>
                    </ListItem>
                    </List>
                </View>
            </Content>
        </Container>

    )
}
