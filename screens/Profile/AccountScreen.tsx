import React, { useContext } from 'react';
import { Container, Header, Content, Text, Left, Body, Right, View, Thumbnail, List, ListItem, Button } from 'native-base';
import Theme, { Style, HeaderStyle } from '../../Theme.style';
import { StatusBar, StyleSheet } from 'react-native';
import UserContext from '../../contexts/UserContext'
import { StackNavigationProp } from '@react-navigation/stack';
import LocationsService, { LocationKey } from '../../services/LocationsService';
import { MainStackParamList } from 'navigation/AppNavigator';
import MiniPlayer from '../../components/MiniPlayer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: 'black',
        }
    },
    header: {
        backgroundColor: Theme.colors.header
    },
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerBody: {
        flexGrow: 3,
        justifyContent: "center",
    },
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50,
        right: 6,
    },
    headerTitle: {
        ...HeaderStyle.title, ...{
            width: "100%",
        }
    },
    headerButtonText: HeaderStyle.linkText,
    title: {
        ...Style.title, ...{
            marginTop: 130,
            marginBottom: 16,
        }
    },
    body: {
        ...Style.body, ...{
            marginBottom: 40,
        }
    },
    searchIcon: Style.icon,
    searchInput: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
    },
    listItem2: {
        marginLeft: 0,
        borderColor: Theme.colors.gray2,
        backgroundColor: Theme.colors.background
    },
    listItem: {
        marginLeft: 0,
        borderColor: Theme.colors.gray2,
        backgroundColor: 'black'
    },
    listText2: {
        fontSize: Theme.fonts.medium,
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        marginLeft: 16,
    },
    listText3: {
        fontSize: Theme.fonts.medium,
        color: Theme.colors.grey5,
        fontFamily: Theme.fonts.fontFamilyRegular,
        marginLeft: 16,
    },
    listText: {
        fontSize: 14,
        color: Theme.colors.grey4,
        fontFamily: Theme.fonts.fontFamilyBold,
        marginLeft: 16
    },
    listSubtext: {
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.gray5,
        fontFamily: Theme.fonts.fontFamilyRegular,
    },
    listIcon: {
        ...Style.icon, ...{
            marginRight: 16,
            marginLeft: 16,
        }
    },
    listArrowIcon: {
        ...Style.icon, ...{
            marginLeft: 5
        }
    },
    headerText: {
        fontSize: 16,
        fontFamily: Theme.fonts.fontFamilyRegular,
        color: 'white',
        lineHeight: 24,
    }
})

interface Params {
    navigation: StackNavigationProp<MainStackParamList>;
}

function Account({ navigation }: Params): JSX.Element {

    const user = useContext(UserContext);
    const safeArea = useSafeAreaInsets();

    const items = [
        "Login",
        {
            id: "email",
            text: "Email",
            data: user?.userData?.email
        },
        {
            id: "pass",
            text: "Password",
            icon: Theme.icons.grey.arrow,
            action: () => navigation.navigate('ChangePasswordScreen')
        },
        "Location",
        {
            id: "loc",
            text: "Location",
            icon: Theme.icons.grey.arrow,
            data: user?.userData?.["custom:home_location"] ? LocationsService.mapLocationIdToName(user?.userData?.["custom:home_location"] as LocationKey) : 'None Selected',
            action: () => navigation.navigate('LocationSelectionScreen', { persist: true })
        }
    ]

    return (
        <Container style={{ backgroundColor: Theme.colors.black, paddingBottom: safeArea.bottom }} >
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <Button transparent onPress={() => navigation.navigate('ProfileScreen')}>
                        <Thumbnail style={Style.icon} source={Theme.icons.white.arrowLeft} square></Thumbnail>
                    </Button>
                </Left>
                <Body style={style.headerBody}>
                    <Text style={style.headerTitle}>My Account</Text>
                </Body>
                <Right style={style.headerRight}>
                </Right>
            </Header>
            <Content style={[style.content, { flex: 1 }]}>
                <View>
                    <List>
                        {items.map(item => {
                            if (typeof item === 'string')
                                return (
                                    <ListItem key={item} style={[style.listItem, { height: 50, alignItems: 'flex-end', paddingBottom: 4 }]}>
                                        <Text style={style.listText}>{item}</Text>
                                    </ListItem>
                                )
                            return (
                                <ListItem
                                    key={item.id} style={style.listItem2}
                                    onPress={item.action ? item.action : () => null}>
                                    <Left>
                                        <View>
                                            <Text style={style.listText2}>{item.text}</Text>
                                        </View>
                                    </Left>
                                    <View style={{ maxWidth: '75%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        {item.data ? <Text numberOfLines={1} style={style.listText3}>{item.data}</Text> : null}
                                        {item.icon ? <Thumbnail style={style.listArrowIcon} source={item.icon} square></Thumbnail> : null}
                                    </View>
                                </ListItem>
                            )
                        })}
                    </List>
                </View>
            </Content>
            <MiniPlayer />
        </Container>

    )
}
export default Account;

