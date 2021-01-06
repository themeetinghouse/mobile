import React, { useLayoutEffect } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, Text, Content, View, Thumbnail } from 'native-base';
import WhiteButton from '../components/buttons/WhiteButton';
import { Dimensions, Image, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Announcement } from 'services/AnnouncementService';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            padding: 16,
        }
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
    title: {
        ...Style.title, ...{
            marginTop: 140,
            marginBottom: 16,
        }
    },
    body: {
        ...Style.body, ...{
            marginBottom: 40,
        }
    },
})

interface Props {
    navigation: StackNavigationProp<HomeStackParamList>;
    route: RouteProp<HomeStackParamList, 'AnnouncementDetailsScreen'>;
}

export default function AnnouncementDetailScreen(props: Props): JSX.Element {
    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerShown: true,
            title: 'Announcement',
            headerTitleStyle: style.headerTitle,
            headerStyle: { backgroundColor: Theme.colors.background },
            headerLeft: function render() {
                return (
                    <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Thumbnail
                            square
                            source={Theme.icons.white.closeCancel}
                            style={{ width: 24, height: 24 }}
                        />
                    </TouchableOpacity>
                );
            },
            headerLeftContainerStyle: { left: 16 },
            headerRight: function render() { return <View style={{ flex: 1 }} /> }
        })
    }, [])


    const announcementItem: Announcement = props.route.params?.item;
    const parseUrl = (): string | undefined => {
        if (announcementItem.callToAction) {
            if (announcementItem.callToAction.includes("https://")) {
                return announcementItem.callToAction
            } else {
                return `https://${announcementItem.callToAction}`
            }
        }
    }
    return (
        <>
            {announcementItem.image ?
                <>
                    <Image style={{ top: 0, position: "absolute", height: 200, width: Dimensions.get('window').width }} source={{ uri: announcementItem.image }}>
                    </Image>
                    <LinearGradient
                        colors={["rgba(0,0,0, 0.05)", "rgba(0,0,0, 0.9)"]}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            height: 200
                        }}
                    />
                </>
                : null}
            <Content style={style.content}>
                <Text style={style.title}>{announcementItem.title}</Text>
                <Text style={style.body}>{announcementItem.description}</Text>
                {announcementItem.callToAction ?
                    <WhiteButton
                        style={{ height: 56, marginBottom: 20, marginTop: 20 }}
                        label="Call to Action"
                        onPress={() => {
                            Linking.openURL(parseUrl() ?? "");
                        }}
                    ></WhiteButton> : null}

            </Content>
        </>
    )
}
