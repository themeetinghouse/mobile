import React, { useState } from 'react';
import moment from 'moment-timezone';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { Theme, Style } from '../../Theme.style';
import { HomeChurch } from './HomeChurchScreen';
import HomeChurchConfirmationModal from './HomeChurchConfirmationModal';
import { getTimeStamp, getDayOfWeek } from './HomeChurchUtils';

interface Params {
  item: HomeChurch;
  card?: boolean;
  modal?: boolean;
  active?: boolean;
  openModal?: () => void;
  locationToGroupType: (a: string) => string;
}
const { width, height } = Dimensions.get('window');

const HomeChurchItem = ({
  active,
  item,
  card,
  modal,
  openModal,
  locationToGroupType,
}: Params): JSX.Element => {
  const eventTime = getTimeStamp(item);
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
          minHeight: height * 0.4,
        }
      : {
          backgroundColor: '#1a1a1a',
          padding: 16,
          width,
          paddingBottom: 0,
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
      textTransform: 'capitalize',
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
    drawerIndicator: {
      marginTop: -8,
      marginBottom: 8,
      borderRadius: 100,
      width: 40,
      alignSelf: 'center',
      height: 5,
      backgroundColor: Theme.colors.white,
    },
    openDrawerModalText: {
      color: 'white',
      fontSize: 12,
      lineHeight: 18,
      fontFamily: Theme.fonts.fontFamilyRegular,
      textDecorationLine: 'underline',
    },
  });
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [type, setType] = useState<'contact' | 'calendar' | ''>('');
  return (
    <View style={style.homeChurchCard}>
      {modal ? <View style={style.drawerIndicator} /> : null}
      {confirmationModal ? (
        <HomeChurchConfirmationModal
          type={type}
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
            {moment
              .tz(getTimeStamp(item), moment.tz.guess())
              .format('h:mm a')}{' '}
            {moment.tz(getTimeStamp(item), moment.tz.guess()).format('z')}{' '}
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
              style={Style.icon}
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
              style={Style.icon}
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
          <Text style={style.openDrawerModalText}>See More</Text>
        </TouchableOpacity>
      ) : null}
      {item?.location?.address?.city ||
      item?.location?.name ||
      item?.groupType?.id === '65432' ||
      item?.name?.includes('Family Friendly') ? (
        <View style={style.badgesContainer}>
          <View style={style.locationBadge}>
            <Text style={style.locationBadgeText}>
              {locationToGroupType(item?.groupType?.id ?? '')?.replace(
                '-',
                ' '
              )}
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
      ) : null}
      {!card && !modal ? (
        <View
          style={{
            marginTop: 15,
            borderBottomColor: 'rgba(191, 191, 191, 0.1)',
            borderBottomWidth: 2,
            width: '110%',
          }}
        />
      ) : null}
    </View>
  );
};
export default HomeChurchItem;
