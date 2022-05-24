import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useMemo,
} from 'react';
import moment from 'moment';
import {
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  TouchableWithoutFeedback,
  Text,
  View,
  Platform,
} from 'react-native';
import SideSwipe from 'react-native-sideswipe';
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import API, { GRAPHQL_AUTH_MODE, GraphQLResult } from '@aws-amplify/api';
import useDebounce from '../../../src/hooks/useDebounce';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import AllButton from '../../components/buttons/AllButton';
import TeachingListItem from '../../components/teaching/TeachingListItem';
import ActivityIndicator from '../../components/ActivityIndicator';
import SeriesService, {
  CustomPlaylist,
  LoadPlaylistData,
  LoadSeriesListData,
  SeriesDataWithHeroImage,
} from '../../services/SeriesService';
import SpeakersService from '../../services/SpeakersService';
import loadSomeAsync from '../../utils/loading';
import { TeachingStackParamList } from '../../navigation/MainTabNavigator';
import UserContext from '../../contexts/UserContext';
import { MainStackParamList } from '../../navigation/AppNavigator';
import {
  GetVideoByVideoTypeQueryVariables,
  GetVideoByVideoTypeQuery,
  Series,
} from '../../services/API';
import { AnimatedFallbackImage } from '../../components/FallbackImage';
import SeriesItem from '../../components/teaching/SeriesItem';
import { popularTeachingQuery } from '../../graphql/queries';
import TeacherListPicture from '../../components/teaching/TeacherListPicture';
import HighlightCarousel from '../../components/HighlightCarousel';
import SuggestedCarousel from '../../components/SuggestedCarousel';
import { useTeachingConfig } from './useTeachingConfig';
import useSermons from '../../../src/hooks/useSermons';
import useRecentSeries from '../../../src/hooks/useRecentSeries';

const screenWidth = Dimensions.get('screen').width;
const isTablet = screenWidth >= 768;

const style = StyleSheet.create({
  content: {
    backgroundColor: Theme.colors.gray1,
    paddingLeft: 0,
    paddingRight: 0,
  },
  headerTitle: {
    ...HeaderStyle.title,
    ...{
      width: '100%',
    },
  },
  categoryTitle: {
    ...Style.categoryTitle,
    ...{
      marginTop: 16,
    },
  },
  categorySection: {
    backgroundColor: Theme.colors.black,
    paddingTop: 16,
    marginBottom: 16,
  },
  categorySectionLast: {
    backgroundColor: Theme.colors.black,
    paddingTop: 16,
    marginBottom: 48,
  },
  listContentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  horizontalListContentContainer: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  lastHorizontalListItem: {
    marginRight: 16,
  },
  seriesThumbnailContainer: isTablet
    ? {
        width: 0.33 * screenWidth,
        height: 0.4653 * screenWidth,
        marginHorizontal: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }
    : {
        width: 0.7867 * screenWidth,
        height: 1.11 * screenWidth,
        marginHorizontal: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
  seriesThumbnail: isTablet
    ? {
        width: '100%',
        height: 0.396 * screenWidth,
      }
    : {
        width: '100%',
        height: 0.944 * screenWidth,
      },
  seriesDetailContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  seriesListContainer: {
    marginTop: 14,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  seriesDetail1: {
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    color: Theme.colors.white,
    textAlign: 'center',
  },
  seriesDetail2: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.small,
    color: Theme.colors.gray5,
  },
  highlightsText: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.medium,
    color: Theme.colors.gray5,
    marginLeft: 16,
    marginTop: -10,
  },
  highlightsThumbnail: {
    width: 80 * (16 / 9),
    height: 80,
    marginLeft: 16,
  },
  teacherContainer: {
    alignItems: 'center',
    marginLeft: 16,
    minHeight: 130,
    maxWidth: 96,
  },
  teacherThumbnailContainer: {
    height: 96,
    width: 96,
    borderRadius: 96,
    borderColor: Theme.colors.gray3,
    backgroundColor: Theme.colors.gray3,
    borderWidth: 1,
  },
  teacherDetail1: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.small,
    color: Theme.colors.gray5,
    textAlign: 'center',
    marginTop: 3,
  },
  icon: Style.icon,
  speakerCarouselText: {
    alignSelf: 'center',
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 12,
    lineHeight: 18,
    color: Theme.colors.white,
  },
});

type PopularVideoData = {
  items: NonNullable<
    NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['items']
  >;
  loading: boolean;
};

interface Params {
  navigation: CompositeNavigationProp<
    StackNavigationProp<MainStackParamList>,
    StackNavigationProp<TeachingStackParamList>
  >;
}

interface PlaylistData extends LoadPlaylistData {
  loading: boolean;
}
export type SuggestedVideos = NonNullable<
  NonNullable<CustomPlaylist>['videos']
>['items'];

interface PopularSeriesData {
  items: Array<SeriesDataWithHeroImage>;
  loading: boolean;
}

export default function TeachingScreen({ navigation }: Params): JSX.Element {
  const { pageConfig } = useTeachingConfig();
  const user = useContext(UserContext);
  const { debounce } = useDebounce();
  const [customPlaylists, setCustomPlaylists] = useState<PlaylistData>({
    loading: true,
    items: [],
    nextToken: null,
  });
  const [popularSeries, setPopularSeries] = useState<PopularSeriesData>({
    loading: true,
    items: [],
  });

  const [speakers, setSpeakers] = useState({
    loading: true,
    items: [],
    nextToken: null,
  });
  const [bounce, setBounce] = useState(false);
  const [popularTeachings, setPopularTeachings] = useState<PopularVideoData>({
    items: [],
    loading: true,
  });

  const emailVerified = user?.userData?.email_verified;
  const [androidHeaderHeight, setAndroidHeaderHeight] = useState(0);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Teaching',
      headerTitleStyle: style.headerTitle,
      headerStyle: {
        backgroundColor: Theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.gray2,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerLeft: function render() {
        return (
          <View
            style={{ flex: 1 }}
            onLayout={(e) =>
              setAndroidHeaderHeight(e.nativeEvent.layout.height ?? 50)
            }
          />
        );
      },
      headerRight: function render() {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileScreen')}
          >
            <Image
              source={
                emailVerified
                  ? Theme.icons.white.userLoggedIn
                  : Theme.icons.white.user
              }
              style={style.icon}
            />
          </TouchableOpacity>
        );
      },
      headerRightContainerStyle: { right: 16 },
    });
  }, [navigation, emailVerified]);

  const loadSpeakers = async () => {
    loadSomeAsync(SpeakersService.loadSpeakersList, speakers, setSpeakers);
  };

  const loadCustomPlaylists = async () => {
    loadSomeAsync(
      SeriesService.loadCustomPlaylists,
      customPlaylists,
      setCustomPlaylists,
      10
    );
  };

  const fetchPopularVideoParams = async () => {
    const res = await fetch(
      'https://www.themeetinghouse.com/static/content/teaching.json'
    );
    const data = await res.json();
    // TODO: does this need typing?
    const params = data?.page?.content
      ?.filter((a) => a?.minViews)
      .find((b) => b.header1 === 'Popular Teaching');
    return params;
  };

  const loadPopularSeries = async () => {
    try {
      const data = await SeriesService.fetchPopularSeries();
      setPopularSeries({ items: data, loading: false });
    } catch (err) {
      setPopularSeries({ items: [], loading: false });
    }
  };
  const getPopularTeaching = async () => {
    try {
      const params = await fetchPopularVideoParams();
      const numberOfDays = params?.numberOfDays || 120;
      const minViews = params?.minViews || 900;
      const startDate = moment()
        .subtract(numberOfDays, 'days')
        .format('YYYY-MM-DD');
      const variables: GetVideoByVideoTypeQueryVariables = {
        limit: 30,
        videoTypes: 'adult-sunday',
        publishedDate: { gt: startDate },
      };

      const json = (await API.graphql({
        query: popularTeachingQuery,
        variables,
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      })) as GraphQLResult<GetVideoByVideoTypeQuery>;
      const items = json?.data?.getVideoByVideoType?.items ?? [];
      const popularTeaching = items.filter((item) =>
        item?.viewCount ? parseInt(item?.viewCount, 10) >= minViews : false
      );
      setPopularTeachings({ items: popularTeaching, loading: false });
    } catch (err) {
      console.log({ popularTeaching: err });
    }
  };
  const { sermons, sermonsLoaded } = useSermons(
    10,
    pageConfig?.hideRecentTeaching
  );
  const { recentSeries, recentSeriesLoaded, loadMore } = useRecentSeries(
    6,
    pageConfig?.hideSeries
  );
  const [highlightsLoaded, setHighlightsLoaded] = useState(
    pageConfig && pageConfig?.hideHighlightsCarousel
  );
  useEffect(() => {
    if (pageConfig && !pageConfig?.hidePopularSeries) loadPopularSeries();
    if (pageConfig && !pageConfig?.hideTeachersCarousel) loadSpeakers();
    if (pageConfig && !pageConfig?.hideTeachingByTopic) loadCustomPlaylists();
    if (pageConfig && !pageConfig?.hidePopularTeachings) getPopularTeaching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageConfig]);

  const contentOffset =
    (screenWidth - (style.seriesThumbnailContainer.width + 10)) / 2;

  const getSeriesDate = (series: any) => {
    return moment(series.startDate || moment()).format('YYYY');
  };

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (event.nativeEvent.contentOffset.y > Dimensions.get('screen').height) {
      setBounce(true);
    } else {
      setBounce(false);
    }
  }

  const renderSeriesSwipeItem = (
    item: any,
    index: number,
    animatedValue: Animated.Value
  ) => {
    if (item?.loading) {
      return <ActivityIndicator />;
    }
    return (
      <TouchableWithoutFeedback
        key={item.id}
        onPress={() =>
          debounce(() => navigation.push('SeriesLandingScreen', { item }))
        }
      >
        <View style={style.seriesThumbnailContainer}>
          <AnimatedFallbackImage
            style={{
              ...style.seriesThumbnail,
              ...{
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [index - 1, index, index + 1],
                      outputRange: [0.9, 1, 0.9],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            }}
            uri={item.image640px}
            catchUri="https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg"
          />

          <View style={style.seriesDetailContainer}>
            <Text style={style.seriesDetail1}>{item.title}</Text>
            <Text style={style.seriesDetail2}>
              {getSeriesDate(item)} &bull; {item.videos.items.length} episodes
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  function sortByViews(
    a: PopularVideoData['items'][0],
    b: PopularVideoData['items'][0]
  ) {
    if (!a?.viewCount || !b?.viewCount) return -1;
    return parseInt(b.viewCount, 10) - parseInt(a.viewCount, 10);
  }
  const headerHeightIOS = useHeaderHeight();
  const bottomNavHeight = 90;
  const headerHeight =
    Platform.OS === 'ios' ? headerHeightIOS : androidHeaderHeight;
  const screenHeight =
    Dimensions.get('window').height - headerHeight - bottomNavHeight;

  const customPlaylistsLoaded =
    !customPlaylists.loading || pageConfig?.hidePopularSeries;
  const popularSeriesLoaded =
    !popularSeries.loading || pageConfig?.hidePopularSeries;
  const speakersLoaded = !speakers.loading || pageConfig?.hideTeachersCarousel;
  const popularTeachingsLoaded =
    !popularTeachings.loading || pageConfig?.hidePopularTeachings;

  return (
    <>
      {!recentSeriesLoaded ||
      !sermonsLoaded ||
      !highlightsLoaded ||
      !customPlaylistsLoaded ||
      !popularSeriesLoaded ||
      !popularTeachingsLoaded ||
      !speakersLoaded ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            justifyContent: 'center',

            height: screenHeight,
            width: Dimensions.get('window').width,
            zIndex: 10000,
            backgroundColor: '#000',
          }}
        >
          <ActivityIndicator />
        </View>
      ) : null}

      <ScrollView
        style={style.content}
        bounces={bounce}
        onScroll={(e) => handleScroll(e)}
        scrollEventThrottle={6}
      >
        {pageConfig && !pageConfig?.hideSeries ? (
          <View style={style.categorySection}>
            <SideSwipe
              contentContainerStyle={style.horizontalListContentContainer}
              data={recentSeries as Array<Series>}
              itemWidth={
                isTablet ? 0.33 * screenWidth + 10 : 0.7867 * screenWidth + 10
              }
              onEndReachedThreshold={0.2}
              onEndReached={loadMore}
              threshold={isTablet ? 0.25 * screenWidth : 0.38 * screenWidth}
              style={{ width: '100%' }}
              contentOffset={contentOffset}
              useVelocityForIndex
              renderItem={({ item, itemIndex, animatedValue }) =>
                renderSeriesSwipeItem(item, itemIndex, animatedValue)
              }
            />
            <AllButton
              onPress={() => {
                debounce(() => navigation.push('AllSeriesScreen'));
              }}
            >
              All series
            </AllButton>
          </View>
        ) : null}
        {pageConfig && !pageConfig?.hideRecentTeaching ? (
          <View style={style.categorySection}>
            <Text style={style.categoryTitle}>Recent Teaching</Text>
            <View style={style.listContentContainer}>
              {sermons.map((teaching: any) => (
                <TeachingListItem
                  key={teaching.id}
                  teaching={teaching}
                  handlePress={() =>
                    debounce(() =>
                      navigation.push('SermonLandingScreen', {
                        item: teaching,
                      })
                    )
                  }
                />
              ))}
            </View>
            <AllButton
              onPress={() => {
                debounce(() => navigation.push('AllSermonsScreen'));
              }}
            >
              All sermons
            </AllButton>
          </View>
        ) : null}
        {pageConfig && !pageConfig?.hideHighlightsCarousel ? (
          <HighlightCarousel
            setLoaded={(value) => setHighlightsLoaded(value)}
          />
        ) : null}
        {pageConfig && !pageConfig?.hidePopularTeachings ? (
          <View style={style.categorySection}>
            <Text style={style.categoryTitle}>Popular Teaching</Text>
            <View style={style.listContentContainer}>
              {popularTeachings.items
                .sort((a, b) => sortByViews(a, b))
                .slice(0, 6)
                .map((video) => (
                  <TeachingListItem
                    key={video?.id}
                    teaching={video}
                    handlePress={() =>
                      debounce(() =>
                        navigation.push('SermonLandingScreen', { item: video })
                      )
                    }
                  />
                ))}
            </View>
            <AllButton
              onPress={() =>
                navigation.navigate('PopularTeachingScreen', {
                  popularTeaching: popularTeachings.items.sort((a, b) =>
                    sortByViews(a, b)
                  ),
                })
              }
            >
              More popular teaching
            </AllButton>
          </View>
        ) : null}
        {pageConfig && !pageConfig?.hidePopularSeries ? (
          <View style={style.categorySection}>
            <Text style={style.categoryTitle}>Popular Series</Text>
            <Text style={style.highlightsText}>
              A collection of our favourite and most popular series
            </Text>
            {customPlaylists.loading && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator />
              </View>
            )}
            <View style={style.seriesListContainer}>
              {popularSeries?.items?.map((s: any, key: any) => {
                if (key < 4)
                  return (
                    <SeriesItem
                      key={s.id}
                      navigation={navigation as any}
                      seriesData={s}
                    />
                  );
                return null;
              })}
            </View>
            <AllButton
              onPress={() =>
                debounce(() =>
                  navigation.push('AllSeriesScreen', { popularSeries: true })
                )
              }
            >
              More Popular Series
            </AllButton>
          </View>
        ) : null}
        {pageConfig && !pageConfig?.hideTeachingByTopic ? (
          <View style={style.categorySection}>
            <Text style={style.categoryTitle}>Teaching by Topic</Text>
            <Text style={style.highlightsText}>
              A collection of our favourite and most popular teachings by topic
            </Text>
            {customPlaylists.loading && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator />
              </View>
            )}
            <View style={style.seriesListContainer}>
              {customPlaylists?.items?.map((s: any, key: any) => {
                if (key < 4)
                  return (
                    <SeriesItem
                      key={s.id}
                      customPlaylist
                      navigation={navigation as any}
                      seriesData={s}
                    />
                  );
                return null;
              })}
            </View>
            <AllButton
              onPress={() =>
                debounce(() =>
                  navigation.push('AllSeriesScreen', { customPlaylists: true })
                )
              }
            >
              More Teaching Topics
            </AllButton>
          </View>
        ) : null}
        {pageConfig && !pageConfig?.hideSuggestedVideos ? (
          <SuggestedCarousel />
        ) : null}
        {pageConfig && !pageConfig?.hideTeachersCarousel ? (
          <View style={style.categorySectionLast}>
            <Text style={[style.categoryTitle, { marginBottom: 4 }]}>
              Teachers
            </Text>
            {!speakers.loading ? (
              <>
                <FlatList
                  contentContainerStyle={[
                    style.horizontalListContentContainer,
                    { marginBottom: 2 },
                  ]}
                  horizontal
                  data={speakers.items}
                  renderItem={({ item }: any) =>
                    !item.hidden ? (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('TeacherProfile', {
                            staff: {
                              ...item,
                              uri: item.image,
                              idFromTeaching: item.name,
                            },
                          })
                        }
                      >
                        <View style={style.teacherContainer}>
                          <View
                            style={[
                              style.teacherThumbnailContainer,
                              {
                                justifyContent: 'center',
                                alignItems: 'center',
                              },
                            ]}
                          >
                            <TeacherListPicture item={item} />
                          </View>
                          <Text style={style.teacherDetail1}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    ) : null
                  }
                  ListFooterComponent={() =>
                    speakers.loading ? <ActivityIndicator /> : null
                  }
                />
                <AllButton
                  onPress={() => debounce(() => navigation.push('TeacherList'))}
                >
                  All teachers
                </AllButton>
              </>
            ) : (
              <ActivityIndicator />
            )}
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}
