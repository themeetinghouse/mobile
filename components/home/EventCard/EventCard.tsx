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
    const dateStr = moment(event?.start_time ?? undefined).format('MMM D');
    return (

        <TouchableHighlight underlayColor={Theme.colors.grey5} onPress={handlePress}>
            <View style={style.container} >
                <Text style={style.dateTitleContainer}>{dateStr}</Text>
                <View style={style.titleButtonContainer}>
                    <Text uppercase={false} style={style.title}>{event?.name}</Text>
                    <Thumbnail style={style.icon} source={Theme.icons.white.arrow}></Thumbnail>
                </View>
                <Text style={style.descriptionContainer} numberOfLines={4}>{event?.description}</Text>
                {event?.place?.name || event?.place?.location?.street ?
                    <Text style={style.locationContainer}>{event?.place?.name ? event.place.name + "," : null} {event?.place?.location?.street ? event.place.location.street : null}</Text>
                    : null}
                {event?.event_times ?
                    <>
                        {event?.event_times.reverse().map((item: any, key: number) => {
                            if (key < 3)
                                return <Text key={item?.id} style={style.dateTimeContainer}>{moment(item?.start_time).format("MMM Do YYYY, h:mm a")}  {item?.end_time ? "- " + moment(item?.end_time).format("h:mm a") : ""}</Text>
                        })}
                        {event.event_times.length > 3 ?
                            <Text style={style.dateTimeContainer}>...</Text>
                            : null}
                    </>
                    : event?.start_time ?
                        <Text style={style.dateTimeContainer}>{moment(event?.start_time).format("MMMM Do YYYY, h:mm:ss a")}  {event?.end_time ? "- " + moment(event?.end_time).format("h:mm a") : ""}</Text>
                        : null}

            </View>
        </TouchableHighlight>

    );
}