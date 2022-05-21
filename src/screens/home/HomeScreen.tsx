import React, { useEffect, useState, useLayoutEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  StatusBar,
  Platform,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import AnnouncementCard from '../../components/home/AnnouncementCard';
import EventCard from '../../components/home/EventCard';
import RecentTeaching from '../../components/home/RecentTeaching';
import ActivityIndicator from '../../components/ActivityIndicator';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import WhiteButton from '../../components/buttons/WhiteButton';
import InstagramFeed from '../../components/home/InstagramFeed';
import AllButton from '../../components/buttons/AllButton';
import AnnouncementBar from '../../components/home/AnnouncementBar';
import { MainStackParamList } from '../../navigation/AppNavigator';
import QuestionSuccessModal from '../../components/modals/QuestionSuccessModal';

import HomeChurchCard from '../../components/home/HomeChurchCard';
import useLiveStreams from '../../hooks/useLiveStreams';
import useEvents from '../../hooks/useEvents';
import useAnnouncements from '../../hooks/useAnnouncements';
import useInstagram from '../../hooks/useInstagram';
import useTeaching from '../../hooks/useTeaching';

const style = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.gray1,
  },
  categoryDivider: {
    backgroundColor: Theme.colors.gray1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 16,
    borderTopColor: Theme.colors.gray2,
    borderBottomColor: Theme.colors.gray2,
  },
  categoryContainer: {
    backgroundColor: Theme.colors.black,
    paddingTop: 32,
  },
  categoryTitle: Style.categoryTitle,
  headerTitle: HeaderStyle.title,
  icon: Style.icon,
  headerButton: {
    backgroundColor: Theme.colors.header,
    paddingLeft: 40,
  },
  title: HeaderStyle.title,
  subtitle: HeaderStyle.subtitle,
  locationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContentsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  locationName: {
    marginRight: 5,
  },
});

interface Params {
  navigation: CompositeNavigationProp<
    StackNavigationProp<HomeStackParamList>,
    StackNavigationProp<MainStackParamList>
  >;
  route: RouteProp<HomeStackParamList, 'HomeScreen'>;
}

export default function HomeScreen({ navigation, route }: Params): JSX.Element {
  const [reload, setReload] = useState(false);
  const { events, eventsLoaded } = useEvents(reload);
  const { images, instaUsername, instaLoaded } = useInstagram(reload);
  const { announcements, announcementsLoaded } = useAnnouncements(reload);
  const { live, preLive, liveStreamsLoaded } = useLiveStreams(reload);
  const { teaching, note, teachingLoaded } = useTeaching(reload);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const finishedLoading = useMemo(
    () =>
      announcementsLoaded &&
      liveStreamsLoaded &&
      eventsLoaded &&
      teachingLoaded &&
      instaLoaded,
    [
      announcementsLoaded,
      liveStreamsLoaded,
      eventsLoaded,
      teachingLoaded,
      instaLoaded,
    ]
  );
  const sendQuestion = () => {
    navigation.navigate('AskAQuestion');
  };

  useEffect(() => {
    if (route.params?.questionResult) {
      setShowQuestionModal(route.params?.questionResult);
      navigation.setParams({ questionResult: false });
    }
  }, [route.params?.questionResult, navigation]);
  useLayoutEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(Theme.colors.gray1);
    }
  }, []);
  if (!finishedLoading) {
    return (
      <View
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View style={style.container}>
      {preLive || live ? (
        <AnnouncementBar
          message={preLive ? 'We will be going live soon!' : 'We are live now!'}
        />
      ) : null}
      {showQuestionModal ? (
        <QuestionSuccessModal setShow={setShowQuestionModal} />
      ) : null}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={!finishedLoading}
            onRefresh={() => setReload((prev) => !prev)}
          />
        }
        style={{ backgroundColor: Theme.colors.background }}
      >
        <View style={style.categoryContainer}>
          <RecentTeaching teaching={teaching} note={note} />
          <View
            style={[
              style.categoryContainer,
              { paddingHorizontal: 16, paddingBottom: 40 },
            ]}
          >
            <WhiteButton
              outlined
              label="Send Question"
              style={{ height: 56 }}
              onPress={sendQuestion}
            />
          </View>
        </View>

        {announcements.length ? (
          <View style={style.categoryContainer}>
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement?.id}
                announcement={announcement}
                handlePress={() =>
                  navigation.push('AnnouncementDetailsScreen', {
                    item: announcement,
                  })
                }
              />
            ))}
            <View style={style.categoryDivider} />
          </View>
        ) : null}
        {events?.length ? (
          <>
            <View style={style.categoryDivider} />
            <View style={style.categoryContainer}>
              <Text style={[style.categoryTitle, { marginBottom: 8 }]}>
                Upcoming Events
              </Text>
              {events.slice(0, 3).map((event) => {
                return (
                  <EventCard
                    key={event?.id}
                    event={event}
                    handlePress={() =>
                      navigation.navigate('EventDetailsScreen', {
                        item: event,
                      })
                    }
                  />
                );
              })}
              {events.length > 2 ? (
                <AllButton
                  style={{ borderTopWidth: 0, borderBottomWidth: 0 }}
                  onPress={() => {
                    navigation.navigate('AllEvents', { events });
                  }}
                >
                  See All Events
                </AllButton>
              ) : null}
            </View>
          </>
        ) : null}
        <View style={style.categoryDivider} />
        <View style={style.categoryContainer}>
          <HomeChurchCard />
        </View>

        {/* This should fallback to main TMH Site instead */}
        {images && images.length > 1 ? (
          <>
            <View style={style.categoryDivider} />

            <View style={style.categoryContainer}>
              <Text style={style.categoryTitle}>@{instaUsername}</Text>
              <InstagramFeed images={images} />
              <AllButton
                onPress={() =>
                  Linking.openURL(`https://instagram.com/${instaUsername}`)
                }
                icon={Theme.icons.white.instagram}
              >
                Follow us on Instagram
              </AllButton>
            </View>
          </>
        ) : null}
        <View
          style={[style.categoryDivider, { height: 16, borderBottomWidth: 0 }]}
        />
      </ScrollView>
    </View>
  );
}
