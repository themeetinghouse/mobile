import React from 'react';
import moment from 'moment';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { Theme } from '../../Theme.style';
import { HomeChurch } from './HomeChurchScreen';

interface Params {
  item: HomeChurch;
  card?: boolean;
}
const HomeChurchItem = ({ item, card }: Params): JSX.Element => {
  const style = StyleSheet.create({
    homeChurchCard: card
      ? {
          // TODO: FIX Card height, width
          borderColor: '#1A1A1A',
          borderWidth: 1,
          backgroundColor: Theme.colors.gray1,
          padding: 16,
          borderTopWidth: 2,
          borderTopColor: '#FFF',
          width: Dimensions.get('window').width,
          flexWrap: 'nowrap',
        }
      : {
          borderColor: '#1A1A1A',
          borderWidth: 1,
          backgroundColor: Theme.colors.gray1,
          padding: 16,
          width: Dimensions.get('window').width,
        },
    hmName: {
      fontFamily: Theme.fonts.fontFamilyBold,
      fontSize: 16,
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
      justifyContent: 'flex-start',
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
  return (
    <View style={style.homeChurchCard}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={style.hmName}>{item?.name}</Text>
          <Text style={style.hmAddress}>
            {item?.location?.address?.address1}
          </Text>
          <Text style={style.hmDate}>
            {getDayOfWeek(item)}s{'\n'}
            {moment(item?.schedule?.startTime).format('h:mm a')}
          </Text>
        </View>
        <View>
          <TouchableOpacity style={style.iconContainer}>
            <Thumbnail
              square
              source={Theme.icons.white.calendarAdd}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={style.iconContainer}>
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

      <Text ellipsizeMode="tail" numberOfLines={2} style={style.hmDescription}>
        {item?.description}
      </Text>
      <View style={style.badgesContainer}>
        <View style={style.locationBadge}>
          <Text style={style.locationBadgeText}>
            {item?.location?.address?.city}
          </Text>
        </View>
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
    </View>
  );
};
export default HomeChurchItem;
