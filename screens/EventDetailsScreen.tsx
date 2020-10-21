import React, { useState } from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View, Thumbnail } from 'native-base';
import IconButton from '../components/buttons/IconButton';
import WhiteButton from '../components/buttons/WhiteButton';
import moment from 'moment';
import { StatusBar, StyleSheet } from 'react-native';
import { HomeStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import ShareModal from '../components/modals/Share';
import openMap from "react-native-open-maps";
import * as Linking from 'expo-linking';
import Calendar from "../services/CalendarService";
import { Picker } from '@react-native-community/picker';

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
        marginTop: -5
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

type OpeningMethod = 'gps' | 'name' | 'none';

export default function EventDetailsScreen(props: Props): JSX.Element {
    const [options, setOptions] = useState("");
    const [share, setShare] = useState(false);
    const eventItem = props.route.params?.item;
    const directionsType = () => {
        if (eventItem.place) {
            if (eventItem?.place?.location !== null) {
                //console.log("Location is not null!")
                if (eventItem?.place?.location?.latitude && eventItem?.place?.location.longitude) {
                    //console.log("Latitude and logitude found")
                    return 'gps'
                }
                else {
                    //console.log("There is no longitude or latitude.")
                    if (eventItem?.place?.name) {
                        //console.log("place.name is found.")
                        return 'name'
                    }
                    else {
                        //console.log("Name not found. NOT RENDERING BUTTON")
                        return 'none';
                    }
                }
            }
            else {
                //console.log("Location is null. Reading from eventItem.place.name")
                if (eventItem?.place?.name) {
                    //console.log("place name is found opening with eventItem.place.name")
                    return 'name';
                }
                else {
                    //console.log("Name not found. NOT RENDERING BUTTON")
                    return 'none'
                }
            }
        }
        else {
            //console.log("eventItem.place is null")
            return 'none'
        }
    }
    const [openMethod] = useState<OpeningMethod>(directionsType());

    // EVENT NEEDS TO SHOW CONFIRMATION SCREEN INSTEAD OF ADDING AND SHOWING EDIT SCREEN
    // INPUT LOCATION MAKE SURE TO VALIDATE
    // NEEDS TO BE TESTED ON iOS

    const addEventToCalendar = async () => {
        if (options)
            return await Calendar.createEvent(eventItem, options)
        else {
            console.log("Date not selected")
        }
    }
    const OpenMapWithDirections = () => {
        switch (openMethod) {
            case 'gps':
                openMap({ end: `${eventItem?.place.location.latitude}, ${eventItem?.place.location.longitude}` })
                break;
            case 'name':
                openMap({ end: eventItem.place.name })
                break;
            case 'none':
                break;
            default:
                break;
        }
    }

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
                    {/* 
                        MISSING RENDERING LOGIC FOR THIS
                        ADD TO CALENDAR BUTTON SHOULD ONLY SHOW IF LOCATION, START DATE AND END DATE CAN BE VALIDATED

                        NEEDS TO ACCOUNT FOR EVENTS WITH SEVERAL TIMES
                    */}

                    <IconButton onPress={() => {
                        addEventToCalendar()
                    }} style={style.actionButton} icon={Theme.icons.white.calendarAdd} label="Add to calendar" ></IconButton>
                    <Picker
                        mode="dropdown"
                        prompt="Event Dates"
                        style={{ width: 500, height: 50, color: "white" }}
                        selectedValue={options}
                        onValueChange={(itemValue, itemIndex) => {
                            setOptions(itemValue as string)
                        }

                        }>
                        <Picker.Item label="Select a Date" value=""></Picker.Item>
                        {eventItem.event_times?.map((value: any, key: any) => {
                            return <Picker.Item key={key} label={`${moment(value.start_time).format("MMM Do YYYY, h:mm a")} - ${moment(value.end_time).format("h:mm a")}`} value={value}></Picker.Item>
                        })}
                    </Picker>
                    {eventItem.place ?
                        <>
                            <Text style={style.subtitle}>Location</Text>
                            <Text style={style.body}>{eventItem.place?.name}</Text>
                            <Text style={style.body}>{eventItem.place?.location?.street}</Text>
                            {openMethod !== 'none' ?
                                <IconButton onPress={() => OpenMapWithDirections()} style={style.actionButton} icon={Theme.icons.white.mapLocation} label="Get directions" ></IconButton>
                                : null}
                        </> : null}
                    <View>
                        {eventItem?.event_times && eventItem?.event_times.length > 0 && eventItem?.event_times[0]?.ticket_uri ? <WhiteButton style={{ height: 56, marginBottom: 20, marginTop: 20 }} label="Register" onPress={() => {
                            Linking.openURL(eventItem.event_times[0].ticket_uri)
                        }}></WhiteButton> : null}

                    </View>
                </View>

            </Content>
            {
                share ? <ShareModal closeCallback={() => setShare(false)}
                    link={`https://www.facebook.com/events/${eventItem.id}`}
                    message={eventItem !== null ? `Check out this event: \n${eventItem?.name}\n${eventItem?.place?.name}` : ``} /> : null
            }
        </Container >

    )

}
