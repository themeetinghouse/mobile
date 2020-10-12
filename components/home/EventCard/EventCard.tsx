import React from 'react';
import { Text, Thumbnail, View } from 'native-base';
import moment from 'moment';
import { EventQueryResult } from '../../../services/EventsService';
import { Style, Theme } from '../../../Theme.style';
import { TouchableOpacity, StyleSheet } from 'react-native';


const style = StyleSheet.create({
    container: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.black,
            padding: 16
        }
    },
    dateTitleContainer: {
        ...Style.title, ...{
            color: Theme.colors.gray5,
            fontFamily: Theme.fonts.fontFamilyBold,
            fontSize: Theme.fonts.smallMedium,
            lineHeight: 15,
        }
    },
    titleButtonContainer: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 8,
        paddingLeft: 0,
        marginLeft: 0,
        width: '100%',
        justifyContent: "flex-start"
    },
    title: {
        ...Style.cardTitle, ...{
            paddingLeft: 0,
            paddingTop: 5,
            flexGrow: 1,
            lineHeight: 24,
        }
    },
    icon: Style.icon,
    descriptionContainer: {
        ...Style.cardDescription, ...{
            marginBottom: 16,
            maxHeight: 150,
        }
    },
    locationContainer: Style.cardSubtext,
    dateTimeContainer: Style.cardSubtext,
})

type EventCardInput = {
    event: NonNullable<EventQueryResult>[0];
    handlePress?(): any;
}

export default function EventCard({ event, handlePress }: EventCardInput): JSX.Element {
    const dateStr = moment(event?.start_time ?? undefined).format('MMM D');
    // It might make sense to make this entire view clickable if there are no other buttons
    return (
        <View style={style.container}>
            <Text style={style.dateTitleContainer}>{dateStr}</Text>
            <TouchableOpacity style={style.titleButtonContainer} onPress={handlePress}>
                <Text uppercase={false} style={style.title}>{event?.name}</Text>
                <Thumbnail style={style.icon} source={Theme.icons.white.arrow}></Thumbnail>
            </TouchableOpacity>
            <Text style={style.descriptionContainer} numberOfLines={5}>{event?.description}</Text>
            <Text style={style.locationContainer}>{event?.place?.name ? event.place.name + "," : null} {event?.place?.location?.street ? event.place.location.street : null}</Text>
            <Text style={style.dateTimeContainer}>{moment(event?.start_time ?? undefined).format("h:mm a")} - {moment(event?.end_time ?? undefined).format("h:mm a")}</Text>
        </View>
    );
}