import React from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View } from 'native-base';
import IconButton from '../components/buttons/IconButton';
import moment from 'moment';
import { StatusBar, ViewStyle } from 'react-native';

const style = {
    content: [Style.cardContainer, {
        backgroundColor: Theme.colors.black,
        padding: 16,
    }],
    header: [Style.header, {

    }],
    title: [Style.title, {
        marginTop: 32,
        marginBottom: 16,
    }],
    subtitle: [Style.subtitle, {
        marginTop: 32,
    }],
    body: [Style.body, {
    }],
    dateBoxContainer: {
        display: "flex",
        alignItems: "center",
    } as ViewStyle,
    dateBox: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: Theme.colors.white,
        alignItems: "center",
        justifyContent: "center",
        width: 96,
        height: 96,
    } as ViewStyle,
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
}

interface Props {
    navigation: any;
}

export default function EventDetailsScreen(props: Props): JSX.Element {

    const eventItem = props.navigation.getParam("item");

    return (
        <Container>
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left>
                    <Button transparent onPress={() => props.navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Right>
                    <Button transparent>
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
                    <IconButton style={style.actionButton} icon={Theme.icons.white.mapLocation} label="Get directions" ></IconButton>
                </View>

            </Content>
        </Container>
    )

}
