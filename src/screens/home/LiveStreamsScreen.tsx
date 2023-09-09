import moment from 'moment';
import React, { useLayoutEffect } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { MainStackParamList } from '../../navigation/AppNavigator';

import { Livestream } from '../../../src/services/API';
import useLiveStreams, { getInLocalTime } from '../../hooks/useLiveStreams';
import Theme from '../../../src/Theme.style';
import ActivityIndicator from '../../../src/components/ActivityIndicator';
import LiveIcon from './LiveIcon';

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#111',
  },
  title: {
    color: 'white',
    fontFamily: 'Graphik-Bold-App',
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
    marginLeft: -56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -130,
  },
  footerText: {
    color: 'white',
    fontFamily: 'Graphik-Bold-App',
    fontSize: 14,
    textAlign: 'center',
    alignItems: 'flex-end',
    paddingTop: 16,
    paddingBottom: 50,
  },
});

export default function LiveStreamsScreen({
  navigation,
}: {
  navigation: StackNavigationProp<MainStackParamList, 'LiveStreamsScreen'>;
}): JSX.Element {
  const safeArea = useSafeAreaInsets();
  const { upcomingEvents, isLive, isLiveStreamsLoaded } = useLiveStreams();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      // eslint-disable-next-line react/no-unstable-nested-components
      header: function render() {
        return (
          <View
            style={{
              flexDirection: 'row',
              paddingTop: safeArea?.top,
              backgroundColor: '#111111',
              borderBottomColor: Theme.colors.gray2,
              borderBottomWidth: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              accessibilityLabel="Navigate back"
              accessibilityRole="button"
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Image
                source={Theme.icons.white.back}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <Text style={style.title}>
                {isLive
                  ? 'Live'
                  : upcomingEvents?.length
                  ? "Today's Live Events"
                  : 'No more events today'}
              </Text>
            </View>
          </View>
        );
      },
    });
  }, [navigation, safeArea?.top, isLive, upcomingEvents?.length]);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZoneFromMoment = moment.tz(moment.tz.guess()).zoneAbbr();
  const isMalformedTimeZone = !/[a-zA-Z]/.test(timeZoneFromMoment);
  const timeZoneString = isMalformedTimeZone ? timezone : timeZoneFromMoment;
  return (
    <SafeAreaProvider>
      {!isLiveStreamsLoaded ? (
        <View style={style.spinnerContainer}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={style.container}>
          {upcomingEvents?.map((livestream) => (
            <LiveStreamItem key={livestream.id} {...livestream} />
          ))}

          <View style={{ flex: 1 }} />
          <Text style={style.footerText}>
            {upcomingEvents?.length
              ? `All times are displayed in ${timeZoneString}`
              : ''}
          </Text>
          <TouchableHighlight onPress={() => navigation.navigate('Main')}>
            <Text style={style.footerText}>Go back</Text>
          </TouchableHighlight>
        </View>
      )}
    </SafeAreaProvider>
  );
}

const style2 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    paddingLeft: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    backgroundColor: '#000',
    borderBottomColor: '#1A1A1A',
  },
  eventTitle: {
    color: 'white',
    fontFamily: 'Graphik-Regular-App',
    lineHeight: 26,
    fontSize: 18,
    flex: 1,
  },
  time: {
    color: 'white',
    fontSize: 14,
    width: 95,
    paddingRight: 20,
    fontFamily: 'Graphik-Bold-App',
  },
  live: {
    textAlign: 'left',
    fontFamily: 'Graphik-Bold-App',
    color: 'white',
    fontSize: 14,
    width: 95,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

function LiveStreamItem(livestreamData: Livestream) {
  const navigation = useNavigation();
  const { id, externalEventUrl, eventTitle, videoStartTime, endTime, date } =
    livestreamData;
  const currentTime = moment();
  const eventStartTime = getInLocalTime(date, videoStartTime);
  const eventEndTime = getInLocalTime(date, endTime);
  const isEventLive =
    currentTime.isAfter(eventStartTime) && currentTime.isBefore(eventEndTime);
  const isCustomEvent = id.includes('CustomEvent') && externalEventUrl;

  const navigateToEvent = () => {
    if (isCustomEvent) {
      Linking.openURL(externalEventUrl);
    } else
      navigation.navigate('LiveStreamScreen', { livestream: livestreamData });
  };
  return (
    <TouchableOpacity
      onPress={navigateToEvent}
      disabled={!isEventLive}
      accessibilityState={{ disabled: !isEventLive }}
      accessibilityRole="button"
      accessibilityLabel={`Navigate to ${eventTitle} `}
      accessibilityHint={
        isCustomEvent
          ? 'Navigates to link on your default browser'
          : 'Navigates to live event screen'
      }
      style={style2.container}
    >
      {isEventLive ? (
        <Text style={style2.live}>
          LIVE <LiveIcon height={10} width={10} />
        </Text>
      ) : (
        <Text style={style2.time}>
          {eventStartTime.format('h:mm')} {eventStartTime.format('A')}
        </Text>
      )}
      <Text numberOfLines={3} style={style2.eventTitle}>
        {eventTitle}
      </Text>

      <View
        style={{
          height: 24,
          width: 24,
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingLeft: 40,
        }}
      >
        {!isEventLive ? (
          <Image style={style2.icon} source={Theme.icons.white.clock} />
        ) : (
          <Image style={style2.icon} source={Theme.icons.white.arrow} />
        )}
      </View>
    </TouchableOpacity>
  );
}
