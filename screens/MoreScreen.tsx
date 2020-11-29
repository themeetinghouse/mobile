import React, { useContext, useLayoutEffect } from 'react';
import { Container, Content, Text, Left, Button, View, Thumbnail, List, ListItem } from 'native-base';
import Theme, { Style, HeaderStyle } from '../Theme.style';
import { StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import UserContext from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from 'navigation/AppNavigator';
import LocationContext from '../contexts/LocationContext'


const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.black,
        },
    },
    header: Style.header,
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
        flexBasis: 50
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
    listItem: {
        marginLeft: 0,
        borderColor: Theme.colors.gray2,
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
    listIcon: {
        ...Style.icon, ...{
            marginRight: 16,
            marginLeft: 16,
        }
    },
    listArrowIcon: { ...Style.icon, right: 10 },
    icon: Style.icon,
})

function MoreScreen(): JSX.Element {
    const location = useContext(LocationContext);
    const user = useContext(UserContext);
    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
    let items = [];

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'More',
            headerTitleStyle: style.headerTitle,
            headerStyle: { backgroundColor: Theme.colors.background },
            headerLeft: function render() {
                return <View style={{ flex: 1 }} />
            },
            headerRight: function render() {
                return <Button icon transparent style={{}} onPress={() => navigation.navigate('ProfileScreen')}>
                    <Thumbnail square source={user?.userData?.email_verified ? Theme.icons.white.userLoggedIn : Theme.icons.white.user} style={style.icon}></Thumbnail>
                </Button>
            },
            headerRightContainerStyle: { right: 16 },
        })
    }, [user?.userData])


    if (location?.locationData?.locationId === "unknown")
        items = [
            { id: "give", text: "Give", subtext: "Donate to The Meeting House", icon: Theme.icons.white.give, action: () => Linking.openURL('https://www.themeetinghouse.com/give') },
            //{ id: "volunteer", text: "Volunteer", subtext: "Help out your local community", icon: Theme.icons.white.volunteer },
            { id: "connect", text: "Connect", subtext: "Looking to connect with us?", icon: Theme.icons.white.connect, action: () => Linking.openURL('https://www.themeetinghouse.com/connect') },
            { id: "staff", text: "Staff Team", subtext: "Contact a staff member directly", icon: Theme.icons.white.staff, action: () => navigation.navigate("StaffList") },
            { id: "homeChurch", text: "Home Church", subtext: "Find a home church near you", icon: Theme.icons.white.homeChurch, action: () => Linking.openURL('https://www.themeetinghouse.com/find-homechurch') },
        ]
    else {
        items = [
            { id: "give", text: "Give", subtext: "Donate to The Meeting House", icon: Theme.icons.white.give, action: () => Linking.openURL('https://www.themeetinghouse.com/give') },
            //{ id: "volunteer", text: "Volunteer", subtext: "Help out your local community", icon: Theme.icons.white.volunteer },
            { id: "connect", text: "Connect", subtext: "Looking to connect with us?", icon: Theme.icons.white.connect, action: () => Linking.openURL('https://www.themeetinghouse.com/connect') },
            { id: "staff", text: "Staff Team", subtext: "Contact a staff member directly", icon: Theme.icons.white.staff, action: () => navigation.navigate("StaffList") },
            { id: "parish", text: "My Parish Team", subtext: "Contact a parish team member", icon: Theme.icons.white.staff, action: () => navigation.navigate("ParishTeam") },
            { id: "homeChurch", text: "Home Church", subtext: "Find a home church near you", icon: Theme.icons.white.homeChurch, action: () => Linking.openURL('https://www.themeetinghouse.com/find-homechurch') },
        ]
    }

    return (
        <Container>
            <Content style={style.content}>

                <View>
                    <List>
                        {items.slice(0, 4).map(item => {
                            return <ListItem
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
                        })}

                        <View style={{ height: 15, backgroundColor: Theme.colors.background, padding: 0 }} />

                        {items.slice(4).map(item => {
                            return <ListItem
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
                        })}
                    </List>
                </View>
            </Content>
        </Container>
    )
}

export default MoreScreen;

