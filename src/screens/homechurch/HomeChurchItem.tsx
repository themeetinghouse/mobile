import React, { useState } from 'react';
import moment from 'moment';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { Theme } from '../../Theme.style';
import { HomeChurch } from './HomeChurchScreen';
import Calendar from '../../services/CalendarService';

interface Params {
  item: HomeChurch;
  card?: boolean;
  modal?: boolean;
  active?: boolean;
}
const { width, height } = Dimensions.get('window');
const HomeChurchItem = ({ active, item, card, modal }: Params): JSX.Element => {
  const style = StyleSheet.create({
    homeChurchCard: card
      ? {
          // TODO: FIX Card height, width
          // TODO: description needs to show ellipsis with "See More"
          borderColor: '#1A1A1A',
          borderWidth: 1,
          backgroundColor: Theme.colors.gray1,
          padding: 16,
          borderTopWidth: 2,
          borderTopColor: active ? '#FFF' : 'transparent',
          width: modal ? width : width - 80,
          overflow: 'hidden',
          flexWrap: 'nowrap',
        }
      : {
          borderColor: '#1A1A1A',
          borderWidth: 1,
          backgroundColor: Theme.colors.gray1,
          padding: 16,
          width,
        },
    hmName: {
      fontFamily: Theme.fonts.fontFamilyBold,
      fontSize: card ? 15 : 16,
      lineHeight: 24,
      color: 'white',
    },
    hmAddress: {
      fontSize: card ? 12 : 16,
      lineHeight: 24,
      fontFamily: Theme.fonts.fontFamilyRegular,
      fontWeight: '400',
      color: Theme.colors.grey5,
    },
    hmDate: {
      marginVertical: 8,
      color: 'white',
      fontFamily: Theme.fonts.fontFamilyBold,
      fontSize: 12,
      lineHeight: 18,
    },
    hmDescription: {
      color: Theme.colors.grey5,
      fontFamily: Theme.fonts.fontFamilyRegular,
      fontSize: 12,
      lineHeight: 18,
    },
    badgesContainer: {
      marginTop: 24,
      flexDirection: 'row',
      alignContent: 'center',
    },
    locationBadge: {
      backgroundColor: Theme.colors.grey3,
      borderRadius: 50,
      paddingHorizontal: 12,
      marginHorizontal: 2,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 4,
    },
    locationBadgeText: {
      color: 'white',
      fontSize: 12,
      lineHeight: 18,
      fontFamily: Theme.fonts.fontFamilyRegular,
    },
    iconContainer: {
      width: 40,
      height: 40,
      marginBottom: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  const getDayOfWeek = (homechurch: HomeChurch) => {
    // TODO: Fix
    if (homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly)
      if (
        homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
          ?.occurOnSunday
      )
        return 'Sunday';
      else if (
        homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
          ?.occurOnMonday
      )
        return 'Monday';
      else if (
        homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
          ?.occurOnTuesday
      )
        return 'Tuesday';
      else if (
        homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
          ?.occurOnWednesday
      )
        return 'Wednesday';
      else if (
        homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
          ?.occurOnThursday
      )
        return 'Thursday';
      else if (
        homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
          ?.occurOnFriday
      )
        return 'Friday';
      else if (
        homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
          ?.occurOnSaturday
      )
        return 'Saturday';
      else return moment(homechurch.startDate).format('dddd');
    else return moment(homechurch?.startDate).format('dddd');
  };

  const addToCalendar = async () => {
    let startTime;
    if (moment() < moment().isoWeekday(getDayOfWeek(item))) {
      startTime = moment()
        .isoWeekday(getDayOfWeek(item))
        .set({
          hour: moment(item?.schedule?.startTime).get('hour'),
          minute: moment(item?.schedule?.startTime).get('minute'),
          second: moment(item?.schedule?.startTime).get('second'),
        });
    } else {
      startTime = moment()
        .isoWeekday(getDayOfWeek(item))
        .add(7, 'days')
        .set({
          hour: moment(item?.schedule?.startTime).get('hour'),
          minute: moment(item?.schedule?.startTime).get('minute'),
          second: moment(item?.schedule?.startTime).get('second'),
        });
    }
    const endTime = moment(startTime).add(2, 'hours');
    /* console.log(startTime.format('YYYY-MM-DD hh:mm:ss a'));
    console.log(endTime.format('YYYY-MM-DD hh:mm:ss a'));
    console.log(item?.name);
    console.log(item?.location?.address?.address1);
 */
    try {
      const createEntry = await Calendar.createEvent(
        {
          name: item?.name,
          event: {
            place: {
              location: {
                street: item?.location?.address?.address1,
              },
            },
          },
        },
        {
          start_time: startTime.format(),
          end_time: endTime.format(),
        }
      );
      console.log(createEntry);
    } catch (err) {
      console.log(err);
    } finally {
      //
    }
  };
  return (
    <View style={style.homeChurchCard}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={style.hmName}>
            {item?.name}
          </Text>
          {item?.location?.address?.address1 ? (
            <Text style={style.hmAddress}>
              {item?.location?.address?.address1}
            </Text>
          ) : null}
          <Text style={style.hmDate}>
            {getDayOfWeek(item)}s{'\n'}
            {moment(item?.schedule?.startTime).format('h:mm a')}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => addToCalendar()}
            style={style.iconContainer}
          >
            <Thumbnail
              square
              source={Theme.icons.white.calendarAdd}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `mailto:roger.massie@themeetinghouse.com?subject=Inquiry%20About%20Home%20Church&body=Home%20Church%20ID:%20${item?.id}`
              )
            }
            style={style.iconContainer}
          >
            <Thumbnail
              square
              source={Theme.icons.white.contact}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text
        ellipsizeMode="tail"
        numberOfLines={card ? 1 : 8}
        style={style.hmDescription}
      >
        {item?.description}
      </Text>
      {item?.location?.address?.city ||
      item?.name?.includes('Family Friendly') ? (
        <View style={style.badgesContainer}>
          {item?.location?.address?.city ? (
            <View style={style.locationBadge}>
              <Text style={style.locationBadgeText}>
                {item?.location?.address?.city}
              </Text>
            </View>
          ) : null}
          {item?.name?.includes('Family Friendly') && (
            <View
              style={[
                style.locationBadge,
                {
                  paddingHorizontal: 12,
                  backgroundColor: 'rgb(160, 226, 186)',
                },
              ]}
            >
              <Thumbnail
                square
                source={Theme.icons.black.familyFriendly}
                style={{ width: 16, height: 16 }}
              />
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};
export default HomeChurchItem;
