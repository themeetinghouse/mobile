import React, { useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { Header, Body, Icon, View, Button, Text, Right, Left, Thumbnail } from "native-base";
import { Style, Theme } from '../../Theme.style';
import { StatusBar, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import LocationContext from '../../contexts/LocationContext';
import { HomeStackParamList } from '../../navigation/MainTabNavigator'
import { StackNavigationProp } from '@react-navigation/stack'

const style = {
    left: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    body: {
        flexGrow: 3,
        justifyContent: "center",
    } as ViewStyle,
    right: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerButton: {
        backgroundColor: Style.header.backgroundColor,
        paddingLeft: 20,
        paddingRight: 20
    },
    icon: [Style.icon, {
        // Inherited
    }],
    title: [Style.header.title, {
        // Inherited
    }],
    subtitle: [Style.header.subtitle, {
        // Inherited
    }],
    locationContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
    } as ViewStyle,
    buttonContentsContainer: {
        display: "flex",
        flexDirection: "column",
    } as ViewStyle,
    locationName: {
        marginRight: 5,
    },
}

interface LocationSelectHeaderInput {
    children: string;
}

export default function LocationSelectHeader({ children }: LocationSelectHeaderInput): JSX.Element {

    const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
    const user = useContext(UserContext);
    const location = useContext(LocationContext);

    return (
        <Header style={{ backgroundColor: Theme.colors.background }}>
            <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
            <Left style={style.left}></Left>
            <Body style={style.body}>
                <Button style={style.headerButton} onPress={() => navigation.navigate('LocationSelectionScreen', { persist: !Boolean(user?.userData?.email_verified) })}>
                    <View style={style.buttonContentsContainer}>
                        <Text style={style.title}>{children}</Text>
                        <View style={style.locationContainer}>
                            <Text style={[style.subtitle, style.locationName]}>{location?.locationData?.locationName ? location?.locationData?.locationName : 'Select Location'}</Text>
                            <Icon style={style.subtitle} name='arrow-dropdown'></Icon>
                        </View>
                    </View>
                </Button>
            </Body>
            <Right style={style.right}>
                <Button icon transparent style={{}} onPress={() => navigation.navigate('ProfileScreen')}>
                    <Thumbnail square source={user?.userData?.email_verified ? Theme.icons.white.userLoggedIn : Theme.icons.white.user} style={style.icon}></Thumbnail>
                </Button>
            </Right>
        </Header>
    )
}