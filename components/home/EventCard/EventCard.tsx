import React from 'react';
import { Text, Thumbnail, View } from 'native-base';
import moment from 'moment';
import { EventQueryResult } from '../../../services/EventsService';
import { Style, Theme } from '../../../Theme.style';
import { StyleSheet, TouchableHighlight } from 'react-native';

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
        flexDirection: "row",
        marginBottom: 8,
        paddingLeft: 0,
        marginLeft: 0,
    },
    title: {
        ...Style.cardTitle, ...{
            paddingLeft: 0,
            paddingTop: 5,
            width: "88%",
            lineHeight: 24,
        }
    },
    icon: { ...Style.icon, position: "absolute", right: 0 },
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
    const formatDate = () => {
        let startTime = "", endTime = ""
        if (event?.start_time) {
            if (event?.end_time)
                if (moment(event.end_time).isSame(moment(event.start_time), 'day'))
                    startTime = moment(event.start_time).format("h:mm")
                else {
                    startTime = moment(event.start_time).format("h:mm a")
                }
            else {
                startTime = moment(event.start_time).format("h:mm a")
            }
        }
        if (event?.end_time) {
            if (moment(event?.end_time).isSame(moment(event.start_time), 'day')) {
                endTime = moment(event.end_time).format("h:mm a")
            }
            else {
                endTime = ""
            }
        }
        if (endTime !== "")
            return startTime + " - " + endTime;
        else return startTime
    }
    return (
        <TouchableHighlight underlayColor={Theme.colors.grey5} onPress={handlePress}>
            <View style={style.container} >
                <Text style={style.dateTitleContainer}>{moment(event?.start_time ?? undefined).format('MMM D')}</Text>
                <View style={style.titleButtonContainer}>
                    <Text uppercase={false} style={style.title}>{event?.name}</Text>
                    <Thumbnail style={style.icon} source={Theme.icons.white.arrow}></Thumbnail>
                </View>
                <Text style={style.descriptionContainer} numberOfLines={4}>{event?.description ? event?.description.replace(/(\r?\n)\s*\1+/g, '$1') : null}</Text>
                {event?.place?.name || event?.place?.location?.street ?
                    <Text style={style.locationContainer}>{event?.place?.name ? event.place.name.split(',')[0] : null}{event?.place?.location?.street ? `, ${event.place.location.street.split(',')[0]}` : null} </Text>
                    : null}
                <Text style={style.dateTimeContainer}>{formatDate()}</Text>
            </View>
        </TouchableHighlight>

    );
}