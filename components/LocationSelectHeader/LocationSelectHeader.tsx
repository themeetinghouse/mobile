import React, { useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import { Header, Body, View, Button, Text, Right, Left, Thumbnail } from "native-base";
import { Style, Theme, HeaderStyle } from '../../Theme.style';
import { StatusBar, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import LocationContext from '../../contexts/LocationContext';
import { StackNavigationProp } from '@react-navigation/stack'
import { MainStackParamList } from 'navigation/AppNavigator';

const style = StyleSheet.create({
    left: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    body: {
        flexGrow: 3,
        justifyContent: "center",
    },
    right: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerButton: {
        backgroundColor: Theme.colors.header,
        paddingLeft: 20,
        paddingRight: 20
    },
    icon: Style.icon,
    title: HeaderStyle.title,
    subtitle: HeaderStyle.subtitle,
    locationContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContentsContainer: {
        display: "flex",
        flexDirection: "column",
    },
    locationName: {
        marginRight: 5,
    },
})

interface LocationSelectHeaderInput {
    children: string;
}

export default function LocationSelectHeader({ children }: LocationSelectHeaderInput): JSX.Element {

    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
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
                            <Text style={[style.subtitle, style.locationName]}>{location?.locationData?.locationName === 'unknown' ? 'Select Location' : location?.locationData?.locationName}</Text>
                            <Thumbnail square source={Theme.icons.white.caretDown} style={{ width: 12, height: 24 }}></Thumbnail>
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