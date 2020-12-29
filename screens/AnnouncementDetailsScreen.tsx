import React, { useLayoutEffect } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, Text, Content, View, Thumbnail } from 'native-base';
import WhiteButton from '../components/buttons/WhiteButton';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { HomeStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Announcement } from 'services/AnnouncementService';
import * as Linking from 'expo-linking';

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.black,
            padding: 16
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
            marginTop: 130,
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

    const announcementItem: Announcement = props.route.params?.item;

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


    return (
        <Container>
            <Content style={style.content}>
                <Text style={style.title}>{announcementItem.title}</Text>
                <Text style={style.body}>{announcementItem.description}</Text>
                {announcementItem.callToAction ?
                    <WhiteButton
                        style={{ height: 56, marginBottom: 20, marginTop: 20 }}
                        label="Call to Action"
                        onPress={() => {
                            Linking.openURL(announcementItem.callToAction ?? "");
                        }}
                    ></WhiteButton> : null}
            </Content>
        </Container>
    )
}
