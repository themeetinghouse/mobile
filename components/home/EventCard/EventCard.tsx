import React from 'react';
import { Text, Thumbnail, View } from 'native-base';
import moment from 'moment';
import { EventQueryResult } from '../../../services/EventsService';
import { Style, Theme } from '../../../Theme.style';
import { StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';


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
    const addressFilter = (address: string) => {
        console.log("returning :" + address.split(',')[0])
        return address.split(',')[0]
    }
    const descriptionFilter = (description: string) => { //removes newlines
        return description.replace(/(\r?\n)\s*\1+/g, '$1');
    }
    const dateStr = moment(event?.start_time ?? undefined).format('MMM D');
    return (

        <TouchableHighlight underlayColor={Theme.colors.grey5} onPress={handlePress}>
            <View style={style.container} >
                <Text style={style.dateTitleContainer}>{dateStr}</Text>
                <View style={style.titleButtonContainer}>
                    <Text uppercase={false} style={style.title}>{event?.name}</Text>
                    <Thumbnail style={style.icon} source={Theme.icons.white.arrow}></Thumbnail>
                </View>
                <Text style={style.descriptionContainer} numberOfLines={4}>{event?.description ? descriptionFilter(event?.description) : null}</Text>
                {event?.place?.name || event?.place?.location?.street ?
                    <Text style={style.locationContainer}>{event?.place?.name ? addressFilter(event.place.name) : null}{event?.place?.location?.street ? `, ${addressFilter(event.place.location.street)}` : null} </Text>
                    : null}
                <Text style={style.dateTimeContainer}>{moment(event?.start_time).format("h:mm")}  {event?.end_time ? "- " + moment(event?.end_time).format("h:mm a") : ""}</Text>
            </View>
        </TouchableHighlight>

    );
}