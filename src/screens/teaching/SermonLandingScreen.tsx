import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import moment from 'moment';
import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import {
  Audio,
  AVPlaybackStatus,
  InterruptionModeIOS,
  InterruptionModeAndroid,
} from 'expo-av';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import TeachingListItem from '../../components/teaching/TeachingListItem';
import IconButton from '../../components/buttons/IconButton';
import TeachingButton from '../../components/buttons/TeachingButton';
import ActivityIndicator from '../../components/ActivityIndicator';
import { TeachingStackParamList } from '../../navigation/MainTabNavigator';
import MediaContext from '../../contexts/MediaContext';
import { MainStackParamList } from '../../navigation/AppNavigator';
import ShareModal from '../../components/modals/Share';
import { GetCustomPlaylistQuery, GetSeriesQuery } from '../../services/API';
import NotesService from '../../services/NotesService';
import { getSeries, getCustomPlaylist } from '../../graphql/queries';
import useDebounce from '../../../src/hooks/useDebounce';
import CachedImage from '../../components/CachedImage';

const style = StyleSheet.create({
  content: {
    backgroundColor: Theme.colors.black,
  },
  headerTitle: {
    ...HeaderStyle.title,
    ...{
      width: '100%',
    },
  },
  title: {
    ...Style.title,
    ...{
      fontSize: Theme.fonts.large,
      marginTop: 16,
    },
  },
  body: Style.body,

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
  listContentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },

  sermonContainer: {
    padding: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  detailsContainerItem: {
    flexBasis: 0,
    flexGrow: 1,
  },
  detailsTitle: {
    color: Theme.colors.gray4,
    fontSize: Theme.fonts.smallMedium,
    fontFamily: Theme.fonts.fontFamilyRegular,
    lineHeight: 18,
    marginBottom: 3,
    marginTop: 8,
  },
  detailsText: {
    color: Theme.colors.white,
    fontSize: Theme.fonts.smallMedium,
    fontFamily: Theme.fonts.fontFamilyRegular,
    lineHeight: 18,
  },
  detailsDescription: {
    marginTop: 14,
    marginBottom: 20,
  },
  skipText: {
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: 12,
    lineHeight: 18,
    color: Theme.colors.grey5,
    marginTop: 8,
  },
  speedText: {
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: 16,
    lineHeight: 24,
    color: Theme.colors.grey5,
  },
  timeText: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 12,
    lineHeight: 18,
    color: Theme.colors.grey5,
  },
});

type VideoData = NonNullable<
  NonNullable<GetSeriesQuery['getSeries']>['videos']
>['items'];

interface Params {
  navigation: CompositeNavigationProp<
    StackNavigationProp<MainStackParamList, 'SermonLandingScreen'>,
    StackNavigationProp<TeachingStackParamList>
  >;
  route: RouteProp<MainStackParamList, 'SermonLandingScreen'>;
}

export default function SermonLandingScreen({
  navigation,
  route,
}: Params): JSX.Element {
  const { debounce } = useDebounce();
  const sermon = route.params?.item;
  const [isLoading, setIsLoading] = useState(true);
  const { setMedia, media, setAudioNull, closeAudio, closeVideo } =
    useContext(MediaContext);
  const [sermonsInSeries, setSermonsInSeries] = useState<VideoData>();
  const [videosInPlaylist, setVideosInPlaylist] = useState<any>();
  const [time, setTime] = useState({ elapsed: '', remaining: '' });
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [audioPosition, setAudioPosition] = useState(0);
  const [audioDuration, setAudioDuration] = useState<number | undefined>(0);
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [share, setShare] = useState(false);
  const safeArea = useSafeAreaInsets();
  const [justOpened, setJustOpened] = useState(true);
  const [notesExist, setNotesExist] = useState(false);
  console.log({ sermon });
  const deviceWidth = Dimensions.get('window').width;

  const closeAudioFn = async () => {
    try {
      await media.audio?.sound.unloadAsync();
      closeAudio();
    } catch (e) {
      console.debug(e);
    }
  };

  const setPlaybackSpeed = async () => {
    if (media.audio?.status.isLoaded) {
      if (audioSpeed !== 2) {
        media.audio.sound.setRateAsync(
          audioSpeed + 0.5,
          true,
          Audio.PitchCorrectionQuality.Medium
        );
        setAudioSpeed(audioSpeed + 0.5);
      } else {
        media.audio.sound.setRateAsync(
          0.5,
          true,
          Audio.PitchCorrectionQuality.Medium
        );
        setAudioSpeed(0.5);
      }
    }
  };

  const pauseAudio = async () => {
    try {
      const status = await media.audio?.sound.getStatusAsync();
      if (status?.isLoaded) {
        setMedia({
          ...media,
          playing: !media.playing,
        });
        if (status.isPlaying) {
          await media.audio?.sound.pauseAsync();
        } else {
          await media.audio?.sound.playAsync();
        }
      }
    } catch (e) {
      console.debug(e);
    }
  };

  const skipForward = async (timeForward: number) => {
    if (media.audio?.status.isLoaded) {
      try {
        await media.audio.sound.setPositionAsync(audioPosition + timeForward);
        setAudioPosition(audioPosition + timeForward);
        try {
          await media.audio.sound.playAsync();
          setMedia({ ...media, playing: true });
        } catch (e) {
          console.debug(e);
        }
      } catch (e) {
        console.debug(e);
      }
    }
  };

  const seekTo = async (t: number) => {
    if (media.audio?.status.isLoaded) {
      try {
        await media.audio.sound.setPositionAsync(t);
        await media.audio.sound.playAsync();
        setMedia({ ...media, playing: true });
        setAudioPosition(t);
      } catch (e) {
        console.debug(e);
      }
    }
  };

  function secondsToHms(data: number) {
    const d = Math.round(data / 1000);
    let m: number | string = Math.floor((d % 3600) / 60);
    let s: number | string = Math.floor((d % 3600) % 60);
    if (m < 10) m = `0${m}`;
    if (s < 10) s = `0${s}`;
    return `${m}:${s}`;
  }

  function updateAudioPosition(e: AVPlaybackStatus) {
    if (e.isLoaded) {
      setAudioPosition(Math.round(e.positionMillis));
      if (e.durationMillis) {
        const timeObj = {
          remaining: secondsToHms(e.durationMillis - e.positionMillis),
          elapsed: secondsToHms(e.positionMillis),
        };
        setTime(timeObj);
      }
      if (e.durationMillis && audioDuration !== Math.round(e.durationMillis))
        setAudioDuration(Math.round(e.durationMillis));
    }
  }

  const loadAndNavigateToSeries = () => {
    if (route?.params?.customPlaylist) {
      navigation.navigate('SeriesLandingScreen', {
        seriesId: sermon.seriesTitle,
        customPlaylist: false,
      });
    } else {
      navigation.navigate('SeriesLandingScreen', {
        seriesId: sermon?.series?.id,
      });
    }
  };

  const handleVideoReady = () => {
    playerRef?.current?.seekTo(media.videoTime, true);
  };

  const loadVideo = async () => {
    setJustOpened(false);

    try {
      await media.audio?.sound.unloadAsync();
      setAudioNull();
    } catch (e) {
      console.debug(e);
    }

    if (
      media.playerType === 'mini video' &&
      sermon.seriesTitle === media.series &&
      sermon.episodeTitle === media.episode
    ) {
      setMedia({ ...media, playerType: 'video' });
    } else {
      setMedia({
        playerType: 'video',
        playing: true,
        video: sermon.id,
        videoTime: 0,
        audio: null,
        episode: sermon.episodeTitle,
        series: sermon.seriesTitle,
      });
    }
  };

  const loadAudio = async () => {
    setJustOpened(false);

    if (
      media.playerType === 'mini audio' &&
      sermon.seriesTitle === media.series &&
      sermon.episodeTitle === media.episode
    ) {
      setMedia({ ...media, playerType: 'audio' });
      media.audio?.sound.setOnPlaybackStatusUpdate((e) =>
        updateAudioPosition(e)
      );
    } else {
      try {
        await media?.audio?.sound?.unloadAsync();
      } catch (e) {
        console.debug(e);
      }

      try {
        const sound = await Audio.Sound.createAsync(
          { uri: sermon.audioURL },
          { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
          (e) => updateAudioPosition(e)
        );
        setMedia({
          playerType: 'audio',
          playing: true,
          audio: sound,
          video: null,
          videoTime: 0,
          episode: sermon.episodeTitle,
          series: sermon.seriesTitle,
        });
        try {
          Audio.AndroidAudioEncoder;
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            shouldDuckAndroid: false,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          });
        } catch (e) {
          console.debug(e);
        }
      } catch (e) {
        console.debug(e);
      }
    }
  };

  const minimizeAudio = () => {
    setMedia({ ...media, playerType: 'mini audio' });
  };

  const minimizeVideo = async () => {
    const videoTime = await playerRef?.current?.getCurrentTime();
    if (videoTime)
      setMedia({
        ...media,
        playerType: 'mini video',
        videoTime,
      });
  };

  const navigateToNotes = async () => {
    if (media.playerType === 'audio') minimizeAudio();
    else if (media.playerType === 'video') await minimizeVideo();

    navigation.push('NotesScreen', {
      date: moment(sermon.publishedDate).format('YYYY-MM-DD'),
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const isNote = await NotesService.checkIfNotesExist(
          sermon.publishedDate
        );
        setNotesExist(isNote);
      } catch (e) {
        console.debug(e);
      }
    })();
  }, [sermon.publishedDate]);

  useEffect(() => {
    const loadSermonsInSeriesAsync = async () => {
      if (route?.params?.customPlaylist) {
        const json = (await API.graphql(
          graphqlOperation(getCustomPlaylist, { id: route?.params?.seriesId })
        )) as GraphQLResult<GetCustomPlaylistQuery>;
        const videos = json.data?.getCustomPlaylist?.videos?.items;
        setVideosInPlaylist(videos);
      } else if (sermon.seriesTitle) {
        const json = (await API.graphql(
          graphqlOperation(getSeries, { id: sermon.seriesTitle })
        )) as GraphQLResult<GetSeriesQuery>;
        setSermonsInSeries(json.data?.getSeries?.videos?.items);
      } else {
        setSermonsInSeries([]);
      }
    };
    try {
      loadSermonsInSeriesAsync();
    } catch (error) {
      console.error({ loadSermonsInSeriesAsync: error });
    } finally {
      setIsLoading(false);
    }
  }, [route, sermon.seriesTitle]);

  useEffect(() => {
    const closeAudioPlayer = async () => {
      try {
        await media.audio?.sound.unloadAsync();
        closeAudio();
      } catch (e) {
        console.debug(e);
      }
    };

    const unsub = navigation.addListener('blur', async () => {
      if (media.playerType === 'audio') {
        await closeAudioPlayer();
      } else if (media.playerType === 'video') {
        closeVideo();
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMinimize = () => {
    switch (media.playerType) {
      case 'audio':
        minimizeAudio();
        break;
      case 'video':
        minimizeVideo();
        break;
      default:
        navigation.goBack();
        break;
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
      headerStyle: {
        backgroundColor: Theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.gray2,
        shadowOpacity: 0,
        elevation: 0,
      },
      safeAreaInsets: { top: safeArea.top },
      // eslint-disable-next-line react/no-unstable-nested-components
      headerLeft: function render() {
        return (
          <TouchableOpacity style={{ padding: 12 }} onPress={handleMinimize}>
            <Image
              accessibilityLabel="Close Mini-player"
              source={
                media.playerType === 'audio' || media.playerType === 'video'
                  ? Theme.icons.white.mini
                  : Theme.icons.white.closeCancel
              }
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        );
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: function render() {
        return (
          <TouchableOpacity
            style={{
              padding: 12,
            }}
            onPress={() => setShare(!share)}
          >
            <Image
              accessibilityLabel="Share"
              source={Theme.icons.white.share}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 0 },
      headerRightContainerStyle: { right: 0 },
    });
  });

  const renderMoreVideos = () => {
    if (!sermonsInSeries && !videosInPlaylist && isLoading) {
      return <ActivityIndicator />;
    }

    if (
      videosInPlaylist?.length > 1 ||
      (sermonsInSeries && sermonsInSeries?.length > 1)
    ) {
      return (
        <>
          <Text style={style.categoryTitle}>
            {route.params?.customPlaylist
              ? 'More from this playlist'
              : 'More from this Series'}
          </Text>
          <View style={style.listContentContainer}>
            {route.params?.customPlaylist
              ? videosInPlaylist
                  ?.sort((a: any, b: any) => {
                    return b.video.publishedDate.localeCompare(
                      a.video.publishedDate
                    );
                  })
                  .map((video: any) => {
                    if (video.video.episodeTitle !== sermon.episodeTitle)
                      return (
                        <TeachingListItem
                          key={video?.video?.id}
                          teaching={video.video}
                          handlePress={() =>
                            debounce(() =>
                              navigation.push('SermonLandingScreen', {
                                customPlaylist: true,
                                seriesId: route.params?.seriesId,
                                item: video.video,
                              })
                            )
                          }
                        />
                      );
                    return null;
                  })
              : sermonsInSeries
                  ?.sort((a, b) => {
                    const aNum = a?.episodeNumber ?? 0;
                    const bNum = b?.episodeNumber ?? 0;
                    return bNum - aNum;
                  })
                  .map((seriesSermon: any) =>
                    seriesSermon?.id !== sermon.id ? (
                      <TeachingListItem
                        key={seriesSermon?.id}
                        teaching={seriesSermon}
                        handlePress={() =>
                          debounce(() =>
                            navigation.push('SermonLandingScreen', {
                              item: seriesSermon,
                            })
                          )
                        }
                      />
                    ) : null
                  )}
          </View>
        </>
      );
    }

    return null;
  };
  const thumbnails = sermon?.Youtube?.snippet?.thumbnails;
  const thumbnail: string =
    thumbnails?.maxres?.url ??
    thumbnails?.high?.url ??
    thumbnails.standard?.url ??
    thumbnails?.medium?.url ??
    thumbnails?.default?.url ??
    '';
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {justOpened &&
        media.playerType !== 'video' &&
        media.playerType !== 'audio' ? (
          <TouchableWithoutFeedback onPress={loadVideo}>
            <CachedImage
              url={thumbnail}
              cacheKey={thumbnail}
              fallbackUrl="https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg"
              style={{
                height: Math.round(deviceWidth * (9 / 16)),
                width: Math.round(deviceWidth),
              }}
            />
          </TouchableWithoutFeedback>
        ) : null}

        {media.playerType === 'video' ? (
          <View
            style={{
              height: Math.round(deviceWidth * (9 / 16)),
              marginBottom: 8,
            }}
          >
            <YoutubePlayer
              webViewStyle={{ opacity: 0.99 }}
              ref={playerRef}
              onReady={handleVideoReady}
              forceAndroidAutoplay
              height={Math.round(deviceWidth * (9 / 16))}
              width={Math.round(deviceWidth)}
              videoId={media.video as string}
              play={media.playing && Boolean(media.video)}
              initialPlayerParams={{ modestbranding: true }}
            />
          </View>
        ) : null}

        {audioDuration && media.playerType === 'audio' ? (
          <View
            style={{
              paddingTop: 30,
              paddingBottom: 50,
              marginBottom: 8,
              height: Math.round(deviceWidth * (9 / 16)),
              paddingHorizontal: 16,
            }}
          >
            <Slider
              minimumValue={0}
              maximumValue={audioDuration}
              value={audioPosition}
              onSlidingStart={pauseAudio}
              onSlidingComplete={(e) => seekTo(e)}
              minimumTrackTintColor={Theme.colors.grey5}
              maximumTrackTintColor={Theme.colors.grey2}
              thumbTintColor="white"
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                marginTop: 6,
              }}
            >
              <Text style={style.timeText}>{time.elapsed}</Text>
              <Text style={style.timeText}>-{time.remaining}</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-around',
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => skipForward(-15000)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  marginTop: 12,
                }}
                accessibilityLabel="Skip Back 15 Seconds"
                accessibilityRole="button"
              >
                <Image
                  source={Theme.icons.grey.skipBack}
                  style={{ width: 24, height: 24, marginTop: 14 }}
                />
                <Text style={style.skipText}>15s</Text>
              </TouchableOpacity>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={pauseAudio}
                  accessibilityRole="button"
                  style={{
                    padding: 12,
                  }}
                  accessibilityLabel={media.playing ? 'Pause' : 'Play'}
                >
                  <Image
                    style={{ width: 40, height: 40 }}
                    source={
                      media.playing
                        ? Theme.icons.white.pauseAudio
                        : Theme.icons.white.playAudio
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={setPlaybackSpeed}
                  style={{
                    padding: 12,
                  }}
                  accessibilityLabel={`${audioSpeed.toString()}x playback speed`}
                >
                  <Text style={style.speedText}>{audioSpeed.toString()}x</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => skipForward(30000)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  marginTop: 12,
                }}
                accessibilityLabel="Skip Forward 30 Seconds"
              >
                <Image
                  source={Theme.icons.grey.skipForward}
                  style={{ width: 24, height: 24, marginTop: 14 }}
                />
                <Text style={style.skipText}>30s</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <View style={style.sermonContainer}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              height: 56,
            }}
          >
            {sermon.id ? (
              <TeachingButton
                wrapperStyle={{
                  flex: 1,
                  marginRight: sermon.audioURL ? 16 : 0,
                }}
                active={media.playerType === 'video'}
                label="Watch"
                iconActive={Theme.icons.black.watch}
                iconInactive={Theme.icons.white.watch}
                onPress={
                  media.playerType === 'video' ? () => closeVideo() : loadVideo
                }
              />
            ) : null}
            {sermon.audioURL ? (
              <TeachingButton
                wrapperStyle={{ flex: 1 }}
                active={media.playerType === 'audio'}
                label="Listen"
                iconActive={Theme.icons.black.audio}
                iconInactive={Theme.icons.white.audio}
                onPress={
                  media.playerType === 'audio' ? closeAudioFn : loadAudio
                }
              />
            ) : null}
          </View>
          <Text style={style.title}>{sermon.episodeTitle}</Text>
          <View style={style.detailsContainer}>
            <View style={[style.detailsContainerItem, { paddingRight: 8 }]}>
              <Text style={style.detailsTitle}>Series</Text>
              <View style={{ flexDirection: 'row', height: 48 }}>
                <Text style={style.detailsText}>E{sermon.episodeNumber},</Text>
                <IconButton
                  onPress={() => loadAndNavigateToSeries()}
                  accessibilityHint="Navigates to series"
                  labelStyle={{
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginLeft: 8,
                    paddingTop: 0,
                    fontSize: Theme.fonts.smallMedium,
                    height: '100%',
                  }}
                  style={{
                    alignItems: 'flex-start',
                  }}
                  label={sermon.seriesTitle}
                />
              </View>
            </View>
            <View style={style.detailsContainerItem}>
              <Text style={style.detailsTitle}>Date</Text>
              <Text style={style.detailsText}>
                {moment(sermon.publishedDate).format('MMM D, YYYY')}
              </Text>
            </View>
          </View>
          <View style={style.detailsDescription}>
            <Text style={style.body}>{sermon.description}</Text>
          </View>
          {notesExist && (
            <IconButton
              rightArrow
              style={{
                height: 48,
              }}
              icon={Theme.icons.white.notes}
              label="Notes"
              onPress={() => debounce(navigateToNotes)}
              data-testID="notes-button"
            />
          )}
        </View>

        <View style={style.categorySection}>{renderMoreVideos()}</View>
      </ScrollView>
      {share ? (
        <ShareModal
          closeCallback={() => setShare(false)}
          link={`https://www.themeetinghouse.com/videos/${encodeURIComponent(
            sermon.seriesTitle.trim()
          )}/${sermon.id}`}
          message={
            sermon.episodeTitle
              ? sermon.episodeTitle
              : 'Check out this teaching video'
          }
        />
      ) : null}
    </View>
  );
}
