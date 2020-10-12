import React, { useState } from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View } from 'native-base';
import IconButton from '../components/buttons/IconButton';
import moment from 'moment';
import { StatusBar, StyleSheet } from 'react-native';
import { HomeStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import ShareModal from '../components/modals/Share';
import openMap from "react-native-open-maps";

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.black,
            padding: 16,
        }
    },
    header: Style.header,
    title: {
        ...Style.title, ...{
            marginTop: 32,
            marginBottom: 16,
        }
    },
    subtitle: {
        ...Style.subtitle, ...{
            marginTop: 32,
        }
    },
    body: Style.body,
    dateBoxContainer: {
        display: "flex",
        alignItems: "center",
    },
    dateBox: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: Theme.colors.white,
        alignItems: "center",
        justifyContent: "center",
        width: 96,
        height: 96,
    },
    dateBoxText: {
        color: Theme.colors.black,
        fontSize: Theme.fonts.large,
        fontFamily: Theme.fonts.fontFamilyBold,
    },
    dateBoxNumber: {
        color: Theme.colors.black,
        fontSize: Theme.fonts.huge,
        fontFamily: Theme.fonts.fontFamilyBold,
        marginTop: -10
    },
    actionButton: {
        marginTop: 10
    },
    detailsContainer: {
        paddingBottom: 50
    }
})

interface Props {
    navigation: StackNavigationProp<HomeStackParamList>;
    route: RouteProp<HomeStackParamList, 'EventDetailsScreen'>;
}

export default function EventDetailsScreen(props: Props): JSX.Element {
    const [share, setShare] = useState(false);
    const eventItem = props.route.params?.item;
    return (
        <Container>
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="light-content" />
                <Left>
                    <Button transparent onPress={() => props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Right>
                    <Button transparent onPress={() => setShare(!share)}>
                        <Icon name='share' />
                    </Button>
                </Right>
            </Header>

            <Content style={style.content}>
                <View style={style.dateBoxContainer}>
                    <View style={style.dateBox}>
                        <Text style={style.dateBoxText}>{moment(eventItem.start_time).format("MMM")}</Text>
                        <Text style={style.dateBoxNumber}>{moment(eventItem.start_time).format("D")}</Text>
                    </View>
                </View>

                <View style={style.detailsContainer}>
                    <Text style={style.title}>{eventItem.name}</Text>
                    <Text style={style.body}>{eventItem.description}</Text>
                    <Text style={style.subtitle}>Date &amp; Time</Text>
                    <Text style={style.body}>{moment(eventItem.start_time).format("dddd, MMMM D, YYYY")}</Text>
                    <Text style={style.body}>{moment(eventItem.start_time).format("h:mm a")}</Text>
                    <IconButton style={style.actionButton} icon={Theme.icons.white.calendarAdd} label="Add to calendar" ></IconButton>
                    <Text style={style.subtitle}>Location</Text>
                    <Text style={style.body}>{eventItem.place?.name}</Text>
                    <Text style={style.body}>{eventItem.place?.location?.street}</Text>
                    {eventItem?.place !== null && eventItem?.place?.location?.street !== null ?
                        <IconButton onPress={() => { openMap({ end: eventItem.place?.location?.street }) }} style={style.actionButton} icon={Theme.icons.white.mapLocation} label="Get directions" ></IconButton>
                        : null}
                </View>

            </Content>
            {share ? <ShareModal closeCallback={() => setShare(false)}
                link={`https://www.facebook.com/events/${eventItem.id}`}
                message={eventItem !== null ? `Check out this event: \n${eventItem?.name}\n${eventItem?.place?.name}` : ``} /> : null}
        </Container>

    )

}
