import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { Container, Header, Content, Text, Left, Body, Right, View, Thumbnail, List, ListItem, Separator } from 'native-base';
import Theme, { Style } from '../../Theme.style';
import { StatusBar, ViewStyle, TextStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Auth } from 'aws-amplify'
import ActivityIndicator from '../../components/ActivityIndicator';

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
        fontFamily: Theme.fonts.fontFamilyBold,
    },
    listSubtext: {
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.gray5,
        fontFamily: Theme.fonts.fontFamilyRegular,
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

export default function Profile({ navigation }: Params): JSX.Element {

    const [loggedIn, setLoggedIn] = useState('unknown');

    const user = useContext(UserContext);

    useEffect(()=>{
        async function checkForUser() {
            try {
              const user = await Auth.currentAuthenticatedUser()
              if (user.attributes.email_verified)
                setLoggedIn('user')
              else
                setLoggedIn('no user')

            } catch (e) {
              console.debug(e)
              setLoggedIn('no user')
            }
          }
          checkForUser();
    }, [])

    const items = [
        //{ id: "mycomments", text: "My Comments", subtext: "All your comments in one place", icon: Theme.icons.white.arrow },
        { id: "myaccount", text: "My Account", subtext: "Email, password and location", icon: Theme.icons.white.account, action: ()=>navigation.navigate('AccountScreen') },
    ]

    const items2 = [
        { id: "signup", text: "Don't have an account?", subtext: "Create one today", icon: Theme.icons.white.arrow, action: ()=>navigation.navigate('SignUpScreen') },
        { id: "signin", text: "Forgot to sign in?", subtext: "Back to login", icon: Theme.icons.white.arrow, action: ()=>navigation.navigate('LoginScreen') },
    ]

    const signOut = async () => {
        await Auth.signOut().then(()=>{user?.updateUser(null); navigation.navigate('Auth')});
    }

    function renderContent() {
        switch(loggedIn) {
            case 'user':
                return (
                    <Content style={style.content}>
                        <View>
                            <List>
                                {items.map(item => (
                                    <ListItem
                                        key={item.id} style={style.listItem}
                                        onPress={item.action}>
                                        <Left>
                                            <Thumbnail style={style.listIcon} source={item.icon} square></Thumbnail>
                                            <View>
                                                <Text style={style.listText}>{item.text}</Text>
                                                <Text style={style.listSubtext}>{item.subtext}</Text>
                                            </View>
                                        </Left>
                                        <View>
                                            <Thumbnail style={style.listArrowIcon} source={Theme.icons.white.arrow} square></Thumbnail>
                                        </View>
                                    </ListItem>
                                ))}
                                <View style={{ height: 15, backgroundColor: Theme.colors.background, padding: 0 }} />
                                <ListItem
                                    style={style.listItem}
                                        onPress={signOut}>
                                        <Left>
                                            <Thumbnail style={style.listIcon} source={Theme.icons.white.signOut} square></Thumbnail>
                                            <View>
                                                <Text style={style.listText}>Sign Out</Text>
                                            </View>
                                        </Left>
                                </ListItem>
                            </List>
                        </View>
                    </Content>
                )
            case 'no user':
                return (
                    <Content style={style.content}>
                        <View>
                            <List>
                                {items2.map(item => (
                                    <ListItem
                                        key={item.id} style={style.listItem}
                                        onPress={item.action}>
                                        <Left>
                                            <Thumbnail style={style.listIcon} source={item.icon} square></Thumbnail>
                                            <View>
                                                <Text style={style.listText}>{item.text}</Text>
                                                <Text style={style.listSubtext}>{item.subtext}</Text>
                                            </View>
                                        </Left>
                                        <View>
                                            <Thumbnail style={style.listArrowIcon} source={Theme.icons.white.arrow} square></Thumbnail>
                                        </View>
                                    </ListItem>
                                ))}
                            </List>
                        </View>
                    </Content>
                )
            default: 
                return (
                        <Content style={style.content}>
                            <ActivityIndicator/>
                        </Content>
                )
        }
    }

    return (
        <Container>
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                </Left>
                <Body style={style.headerBody}>
                    <Text style={style.headerTitle}>Profile</Text>
                </Body>
                <Right style={style.headerRight}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Text style={style.headerButtonText}>Done</Text>
                    </TouchableOpacity>
                </Right>
            </Header>
            {renderContent()}
        </Container>
    )
}

