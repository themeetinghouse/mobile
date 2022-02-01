/* eslint-disable camelcase */
import React from 'react';
import { Text, Image, View } from 'native-base';
import moment from 'moment';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { EventQueryResult } from '../../services/EventsService';
import { Style, Theme } from '../../Theme.style';

const style = StyleSheet.create({
  container: {
    ...Style.cardContainer,
    ...{
      backgroundColor: Theme.colors.black,
      padding: 16,
    },
  },
  dateTitleContainer: {
    ...Style.title,
    ...{
      color: Theme.colors.gray5,
      fontFamily: Theme.fonts.fontFamilyBold,
      fontSize: Theme.fonts.smallMedium,
      lineHeight: 15,
    },
  },
  titleButtonContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 0,
    marginLeft: 0,
  },
  title: {
    ...Style.cardTitle,
    ...{
      paddingLeft: 0,
      paddingTop: 5,
      width: '88%',
      lineHeight: 24,
    },
  },
  icon: { ...Style.icon, position: 'absolute', right: 0 },
  descriptionContainer: {
    ...Style.cardDescription,
    ...{
      marginBottom: 16,
      maxHeight: 150,
    },
  },
  locationContainer: Style.cardSubtext,
  dateTimeContainer: Style.cardSubtext,
});

type EventCardInput = {
  event: NonNullable<EventQueryResult>[0];
  handlePress?(): void;
};

export default function EventCard({
  event,
  handlePress,
}: EventCardInput): JSX.Element {
  const formatDate = () => {
    let startTime = '';
    let endTime = '';
    if (event?.start_time) {
      if (event?.end_time)
        if (moment(event.end_time).isSame(moment(event.start_time), 'day'))
          startTime = moment(event.start_time).format('h:mm');
        else {
          startTime = moment(event.start_time).format('h:mm a');
        }
      else {
        startTime = moment(event.start_time).format('h:mm a');
      }
    }
    if (event?.end_time) {
      if (moment(event?.end_time).isSame(moment(event.start_time), 'day')) {
        endTime = moment(event.end_time).format('h:mm a');
      }
    }
    if (endTime !== '') return `${startTime} - ${endTime}`;
    return startTime;
  };
  return (
    <TouchableHighlight
      underlayColor={Theme.colors.grey5}
      onPress={handlePress}
    >
      <View style={style.container}>
        <Text style={style.dateTitleContainer}>
          {moment(event?.start_time ?? undefined).format('MMM D')}
        </Text>
        <View style={style.titleButtonContainer}>
          <Text style={style.title}>{event?.name}</Text>
          <Image
            alt="Arrow Icon"
            style={style.icon}
            source={Theme.icons.white.arrow}
          />
        </View>
        <Text style={style.descriptionContainer} numberOfLines={4}>
          {event?.description
            ? event?.description.replace(/(\r?\n)\s*\1+/g, '$1')
            : null}
        </Text>
        {event?.place?.name || event?.place?.location?.street ? (
          <Text style={style.locationContainer}>
            {event?.place?.name ? event.place.name.split(',')[0] : null}
            {event?.place?.location?.street
              ? `, ${event.place.location.street.split(',')[0]}`
              : null}{' '}
          </Text>
        ) : null}
        {event?.start_time || event?.end_time ? (
          <Text style={style.dateTimeContainer}>{formatDate()}</Text>
        ) : null}
      </View>
    </TouchableHighlight>
  );
}
