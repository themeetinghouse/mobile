import React, { useState } from 'react';
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
import HomeChurchConfirmationModal from './HomeChurchConfirmationModal';

interface Params {
  item: HomeChurch;
  card?: boolean;
  modal?: boolean;
  active?: boolean;
  openModal?: () => void;
}
const { width, height } = Dimensions.get('window');

export const getDayOfWeek = (homechurch: HomeChurch): string => {
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

const HomeChurchItem = ({
  active,
  item,
  card,
  modal,
  openModal,
}: Params): JSX.Element => {
  const style = StyleSheet.create({
    homeChurchCard: card
      ? {
          backgroundColor: '#1A1A1A',
          padding: 16,
          borderTopWidth: 2,
          borderTopColor: active ? '#FFF' : 'transparent',
          width: width - 80,
          overflow: 'hidden',
          flexWrap: 'nowrap',
        }
      : modal
      ? {
          borderTopWidth: 2,
          borderRadius: 4,
          borderColor: 'grey',
          shadowColor: '#ddd',
          backgroundColor: '#1a1a1a',
          padding: 16,
          width,
          minHeight: modal ? height * 0.4 : 0,
        }
      : {
          backgroundColor: '#1a1a1a',
          padding: 16,
          width,
          minHeight: modal ? height * 0.4 : 0,
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

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [type, setType] = useState<'contact' | 'calendar' | ''>('');
  return (
    <View style={style.homeChurchCard}>
      {modal ? (
        <View
          style={{
            marginTop: -8,
            marginBottom: 8,
            borderRadius: 100,
            width: 40,
            alignSelf: 'center',
            height: 5,
            backgroundColor: Theme.colors.white,
          }}
        />
      ) : null}
      {confirmationModal ? (
        <HomeChurchConfirmationModal
          type={type}
          getDayOfWeek={getDayOfWeek}
          handleClose={() => setConfirmationModal(false)}
          homeChurch={item}
        />
      ) : null}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={modal || !card ? 2 : 1} style={style.hmName}>
            {item?.name}
          </Text>
          {item?.location?.address?.address1 ? (
            <Text style={style.hmAddress}>
              {item?.location?.address?.address1}
            </Text>
          ) : null}
          <Text style={style.hmDate}>
            {getDayOfWeek(item)}
            {'\n'}
            {moment(item?.schedule?.startTime).format('h:mm a')}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              setType('calendar');
              setConfirmationModal(true);
            }}
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
            onPress={() => {
              setType('contact');
              setConfirmationModal(true);
            }}
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
        numberOfLines={card ? 2 : 8}
        style={style.hmDescription}
      >
        {item?.description}
      </Text>
      {card ? (
        <TouchableOpacity
          onPress={() => {
            if (openModal) openModal();
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              lineHeight: 18,
              fontFamily: Theme.fonts.fontFamilyRegular,
              textDecorationLine: 'underline',
            }}
          >
            See More
          </Text>
        </TouchableOpacity>
      ) : null}
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
