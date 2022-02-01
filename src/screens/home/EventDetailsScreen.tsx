/* eslint-disable camelcase */
import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react';
import { Container, Text, Button, View } from 'native-base';
import moment from 'moment';
import {
  Alert,
  StyleSheet,
  ActionSheetIOS,
  Platform,
  AppState,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import openMap from 'react-native-open-maps';
import * as Linking from 'expo-linking';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import Calendar from '../../services/CalendarService';
import ShareModal from '../../components/modals/Share';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import WhiteButton from '../../components/buttons/WhiteButton';
import IconButton from '../../components/buttons/IconButton';
import { Theme, Style } from '../../Theme.style';
import Header from '../../components/Header';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: Theme.colors.black,
    },
  },

  title: {
    ...Style.title,
    ...{
      marginTop: 16,
      marginBottom: 16,
    },
  },
  subtitle: {
    ...Style.subtitle,
    ...{
      marginTop: 32,
    },
  },
  body: { ...Style.body, marginTop: 6 },
  dateBoxContainerWithPicture: {
    zIndex: 1,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 140,
  },
  dateBoxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  dateBox: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: Theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 88,
    width: 96,
    height: 96,
  },
  dateBoxText: {
    color: Theme.colors.black,
    fontSize: Theme.fonts.large,
    fontFamily: Theme.fonts.fontFamilyBold,
  },
  dateBoxNumber: {
    color: Theme.colors.black,
    fontSize: Theme.fonts.huge,
    fontFamily: Theme.fonts.fontFamilyBold,
    marginTop: -5,
  },
  actionButton: {
    marginTop: 10,
  },
  detailsContainer: {
    paddingBottom: 10,
    padding: 16,
  },
  eventImage: {
    resizeMode: 'cover',
    position: 'absolute',
    zIndex: -1,
    width: Dimensions.get('window').width,
    height: 230,
  },
  fixedTop: {
    zIndex: 1,
    top: 0,
    width: Dimensions.get('window').width,
    height: 250,
  },
  toplinearGradient: {
    width: Dimensions.get('window').width,
    height: 0,
  },
  bottomlinearGradient: {
    width: Dimensions.get('window').width,
    height: 110,
  },
});

interface Props {
  navigation: StackNavigationProp<HomeStackParamList>;
  route: RouteProp<HomeStackParamList, 'EventDetailsScreen'>;
}

type OpeningMethod = 'gps' | 'name' | 'none';

export default function EventDetailsScreen({
  route,
  navigation,
}: Props): JSX.Element {
  const [options, setOptions] = useState('');
  const [share, setShare] = useState(false);
  const [eventItem] = useState(route.params?.item);
  // Needed to check if app is in the background or foreground.
  const appState = useRef(AppState.currentState);
  const [setAppStateVisible] = useState(appState.current);
  const [alerts, setAlerts] = useState<any>({ message: '' });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: function render() {
        return (
          <Header>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Image
                source={Theme.icons.white.back}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>

            <Button onPress={() => setShare(!share)}>
              <Image
                accessibilityLabel="Share"
                source={Theme.icons.white.share}
                style={{ width: 24, height: 24 }}
              />
            </Button>
          </Header>
        );
      },
    });
  }, [navigation, share]);

  const directionsType = () => {
    if (eventItem?.place) {
      if (eventItem?.place?.location) {
        if (
          eventItem?.place?.location?.latitude &&
          eventItem?.place?.location.longitude
        ) {
          return 'gps';
        }
        if (eventItem?.place?.name) {
          if (
            eventItem.place?.name === 'online' ||
            eventItem.place?.name === 'Online'
          )
            return 'none';

          if (
            eventItem?.place?.name &&
            eventItem?.place?.name?.includes('.com')
          )
            return 'name';
        }
        return 'none';
      }
      if (eventItem?.place?.name) {
        if (
          eventItem.place?.name === 'online' ||
          eventItem.place?.name === 'Online'
        )
          return 'none';

        if (eventItem.place?.name.includes('.com')) return 'none';
        return 'name';
      }
      return 'none';
    }
    return 'none';
  };

  const [openMethod] = useState<OpeningMethod>(directionsType());
  const addEventToCalendar = async () => {
    try {
      if (options) {
        const success = await Calendar.createEvent(eventItem, options);
        if (success?.start_time && Platform.OS === 'android')
          setAlerts({ message: success?.start_time });
      } else if (eventItem?.event_times) {
        // more than one event instance
        if (eventItem?.event_times.length === 1) {
          const success = await Calendar.createEvent(
            eventItem,
            eventItem?.event_times[0]
          );
          if (success?.options)
            setAlerts({ message: success?.options?.start_time });
        } else if (Platform.OS === 'ios') {
          if (eventItem.event_times?.length > 1) {
            // always true at this point?
            const arr: string[] = ['Cancel'];
            for (let x = 0; x < eventItem.event_times.length; x++) {
              if (
                eventItem?.event_times[x]?.start_time ??
                moment().format() < ''
              )
                arr.push(
                  `${moment(eventItem?.event_times[x]?.start_time ?? '').format(
                    'MMM Do YYYY, h:mm a'
                  )} - ${moment(eventItem?.event_times[x]?.end_time).format(
                    'h:mm a'
                  )}`
                );
            }
            ActionSheetIOS.showActionSheetWithOptions(
              { options: arr, cancelButtonIndex: 0 },
              (buttonIndex) => {
                if (buttonIndex === 0) console.log('Date must be selected');
                else
                  Calendar.createEvent(
                    eventItem,
                    eventItem?.event_times?.[buttonIndex - 1]
                  ); // -1 to ignore cancel button
              }
            );
          }
        } else {
          Alert.alert('Error', 'Date must be selected', [{ text: 'Dismiss' }], {
            cancelable: false,
          });
        }
      } else if (eventItem?.start_time && eventItem?.end_time) {
        // only one event instance
        try {
          const success = await Calendar.createEvent(eventItem, {
            start_time: eventItem?.start_time,
            end_time: eventItem?.end_time,
          });
          if (Platform.OS === 'android' && success?.start_time) {
            setAlerts({ message: success?.start_time });
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const OpenMapWithDirections = () => {
    switch (openMethod) {
      case 'gps':
        openMap({
          end: `${eventItem?.place?.location?.latitude}, ${eventItem?.place?.location?.longitude}`,
        });
        break;
      case 'name':
        openMap({ end: eventItem?.place?.name ?? '' });
        break;
      case 'none':
        break;
      default:
        break;
    }
  };
  const parseDescription = (): string => {
    let linkAddress = '';
    if (eventItem?.description?.includes('https://')) {
      linkAddress =
        eventItem?.description?.match(/(https?:\/\/[^\\w\s]*)/)?.[0] ?? '';
    }
    return linkAddress;
  };
  const handleAppStateChange = (nextAppState: any) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };
  /* This handles checking if app is in background or active */
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  });
  /* If the app is in the background and an alert has been delivered, it will not show the alert until it is in the foreground. */
  useEffect(() => {
    if (appState.current === 'active') {
      if (alerts.message !== '') {
        Alert.alert(
          'Added to Calendar',
          moment(alerts.message).format('dddd, MMMM Do YYYY, h:mm a'),
          [{ text: 'Dismiss' }],
          { cancelable: false }
        );
        setAlerts({ name: '', message: '' });
      }
    }
  }, [alerts.message]);

  return (
    <Container>
      <ScrollView style={style.content}>
        {eventItem?.cover?.source ? (
          <>
            <View style={style.fixedTop}>
              <LinearGradient
                colors={['#000', 'transparent']}
                style={style.toplinearGradient}
              />
              <Image
                style={style.eventImage}
                source={{ uri: eventItem.cover.source }}
              />
              <View style={{ top: 125 }}>
                <LinearGradient
                  colors={['transparent', '#000']}
                  style={style.bottomlinearGradient}
                />
              </View>
            </View>
          </>
        ) : null}
        <View
          style={
            eventItem?.cover?.source
              ? style.dateBoxContainerWithPicture
              : { ...style.dateBoxContainer, marginTop: -40 }
          }
        >
          <View
            style={
              eventItem?.cover?.source
                ? [style.dateBox, { marginTop: 60 }]
                : style.dateBox
            }
          >
            <Text style={style.dateBoxText}>
              {moment(eventItem?.start_time).format('MMM')}
            </Text>
            <Text style={style.dateBoxNumber}>
              {moment(eventItem?.start_time).format('D')}
            </Text>
          </View>
        </View>

        <View
          style={
            eventItem?.cover?.source
              ? [style.detailsContainer, { marginTop: 40, zIndex: 2 }]
              : style.detailsContainer
          }
        >
          <Text style={style.title}>{eventItem?.name}</Text>
          <Text style={style.body}>{eventItem?.description}</Text>

          {eventItem?.event_times && eventItem?.event_times.length !== 0 ? (
            <>
              <Text style={style.subtitle}>Event Times</Text>
              {eventItem?.event_times.map((event: any) => {
                if (event.start_time > moment().format())
                  return (
                    <Text key={event.start_time.format()} style={style.body}>
                      {moment(event.start_time).format('ddd, MMM D, YYYY')},{' '}
                      {moment(event.start_time).format('h:mm a')} -{' '}
                      {moment(eventItem.end_time).format('h:mm')}
                    </Text>
                  );
                return null;
              })}
            </>
          ) : (
            <>
              <Text style={style.subtitle}>Date &amp; Time</Text>
              <Text style={style.body}>
                {moment(eventItem?.start_time).format('ddd, MMM D, YYYY')},{' '}
                {moment(eventItem?.start_time).format('h:mm a')}{' '}
                {eventItem?.end_time
                  ? `- ${moment(eventItem?.end_time).format('h:mm a')}`
                  : null}
              </Text>
            </>
          )}
          {(eventItem?.event_times && eventItem?.event_times.length !== 0) ||
          (eventItem?.start_time && eventItem?.end_time) ? (
            <IconButton
              onPress={() => {
                addEventToCalendar();
              }}
              style={style.actionButton}
              icon={Theme.icons.white.calendarAdd}
              label="Add to calendar"
            />
          ) : null}
          {eventItem?.event_times &&
          eventItem?.event_times?.length > 1 &&
          Platform.OS === 'android' ? (
            <Picker
              mode="dropdown"
              enabled
              prompt="Event Dates"
              style={{ width: 500, height: 50, color: 'white' }}
              selectedValue={options}
              onValueChange={(itemValue) => {
                setOptions(itemValue as string);
              }}
            >
              <Picker.Item label="Select a Date" value="" />
              {eventItem.event_times?.map((value: any) => {
                if (value.start_time > moment().format())
                  return (
                    <Picker.Item
                      key={value.id}
                      label={`${moment(value.start_time).format(
                        'MMM Do YYYY, h:mm a'
                      )} - ${moment(value.end_time).format('h:mm a')}`}
                      value={value}
                    />
                  );
                return null;
              })}
            </Picker>
          ) : null}
          {eventItem?.place ? (
            <>
              <Text style={style.subtitle}>Location</Text>
              <Text style={style.body}>{eventItem?.place?.name}</Text>
              <Text style={style.body}>
                {eventItem?.place?.location?.street}
              </Text>
              {openMethod !== 'none' ? (
                <IconButton
                  onPress={() => OpenMapWithDirections()}
                  style={style.actionButton}
                  icon={Theme.icons.white.mapLocation}
                  label="Get directions"
                />
              ) : null}
            </>
          ) : null}
          <View>
            {eventItem?.ticket_uri ||
            eventItem?.event_times?.[0]?.ticket_uri ? (
              <WhiteButton
                style={{ height: 56, marginBottom: 20, marginTop: 20 }}
                label="Register"
                onPress={() => {
                  Linking.openURL(
                    eventItem.ticket_uri ??
                      eventItem?.event_times?.[0]?.ticket_uri ??
                      ''
                  );
                }}
              />
            ) : null}

            {parseDescription() !== '' ? (
              <WhiteButton
                style={{ height: 56, marginBottom: 20, marginTop: 20 }}
                label="Attend"
                onPress={() => {
                  Linking.openURL(parseDescription());
                }}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
      {share ? (
        <ShareModal
          noBottomPadding
          closeCallback={() => setShare(false)}
          link={`https://www.facebook.com/events/${eventItem?.id}`}
          message={
            eventItem !== null
              ? `Check out this event: \n${eventItem?.name}\n${eventItem?.place?.name}`
              : ``
          }
        />
      ) : null}
    </Container>
  );
}
