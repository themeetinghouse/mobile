import React, { useState, useContext, useRef, useEffect, Fragment } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Text, Button, Content, View, Thumbnail } from 'native-base';
import moment from 'moment';
import { Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import TeachingListItem from '../components/teaching/TeachingListItem';
import IconButton from '../components/buttons/IconButton';
import TeachingButton from '../components/buttons/TeachingButton';
import ActivityIndicator from '../components/ActivityIndicator';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import MediaContext from '../contexts/MediaContext';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { MainStackParamList } from 'navigation/AppNavigator';
import ShareModal from '../components/modals/Share';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { GetSeriesQuery } from '../services/API';

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.black,
        }
    },
    header: Style.header,
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50,
    },
    headerBody: {
        flexGrow: 3,
        justifyContent: "center",
    },
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerTitle: {
        ...HeaderStyle.title, ...{
            width: "100%",
        }
    },
    title: {
        ...Style.title, ...{
            fontSize: Theme.fonts.large,
            marginTop: 16
        }
    },
    body: Style.body,

    categoryTitle: {
        ...Style.categoryTitle, ...{
            marginTop: 16
        }
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
        marginTop: 8
    },
    speedText: {
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: 16,
        lineHeight: 24,
        color: Theme.colors.grey5
    },
    timeText: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: 12,
        lineHeight: 18,
        color: Theme.colors.grey5
    }
})

type VideoData = NonNullable<NonNullable<GetSeriesQuery['getSeries']>['videos']>['items'];

interface Params {
    navigation: CompositeNavigationProp<StackNavigationProp<MainStackParamList, 'SermonLandingScreen'>, StackNavigationProp<TeachingStackParamList>>;
    route: RouteProp<MainStackParamList, 'SermonLandingScreen'>;
}

export default function SermonLandingScreen({ navigation, route }: Params): JSX.Element {

    const sermon = route.params?.item;
    const mediaContext = useContext(MediaContext);
    const [sermonsInSeries, setSermonsInSeries] = useState<VideoData>();
    const [time, setTime] = useState({ elapsed: '', remaining: '' });
    const [audioSpeed, setAudioSpeed] = useState(1);
    const [audioPosition, setAudioPosition] = useState(0);
    const [audioDuration, setAudioDuration] = useState<number | undefined>(0);
    const playerRef = useRef<YoutubeIframeRef>(null);
    const [share, setShare] = useState(false)
    const safeArea = useSafeAreaInsets();

    useEffect(() => {
        const loadSermonsInSeriesAsync = async () => {
            const json = await API.graphql(graphqlOperation(getSeries, { id: sermon.seriesTitle })) as GraphQLResult<GetSeriesQuery>;
            setSermonsInSeries(json.data?.getSeries?.videos?.items);
        }
        loadSermonsInSeriesAsync();
    }, []);

    useEffect(() => {
        const unsub = navigation.addListener('blur', async () => {
            if (mediaContext.media.playerType === 'audio') {
                try {
                    await mediaContext.media.audio?.sound.unloadAsync();
                    mediaContext.closeAudio();
                } catch (e) {
                    console.debug(e)
                }
            } else if (mediaContext.media.playerType === 'video') {
                mediaContext.closeVideo();
            }
        });
        return unsub;
    }, [mediaContext])

    const setPlaybackSpeed = async () => {
        if (mediaContext?.media.audio?.status.isLoaded) {
            if (audioSpeed !== 2) {
                mediaContext?.media.audio.sound.setRateAsync(audioSpeed + 0.5, true, Audio.PitchCorrectionQuality.Medium)
                setAudioSpeed(audioSpeed + 0.5);
            } else {
                mediaContext?.media.audio.sound.setRateAsync(0.5, true, Audio.PitchCorrectionQuality.Medium)
                setAudioSpeed(0.5);
            }
        }
    }

    const pauseAudio = async () => {
        try {
            const status = await mediaContext?.media.audio?.sound.getStatusAsync();
            if (status?.isLoaded) {
                mediaContext.setMedia({ ...mediaContext.media, playing: !mediaContext.media.playing })
                if (status.isPlaying) {
                    await mediaContext?.media.audio?.sound.pauseAsync();
                } else {
                    await mediaContext?.media.audio?.sound.playAsync();
                }
            }
        } catch (e) {
            console.debug(e)
        }
    }

    const skipForward = async (timeForward: number) => {
        if (mediaContext?.media.audio?.status.isLoaded) {
            try {
                await mediaContext?.media.audio.sound.setPositionAsync(audioPosition + timeForward);
                setAudioPosition(audioPosition + timeForward);
                try {
                    await mediaContext?.media.audio.sound.playAsync();
                    mediaContext.setMedia({ ...mediaContext.media, playing: true });
                } catch (e) {
                    console.debug(e)
                }
            } catch (e) {
                console.debug(e)
            }
        }
    }

    const seekTo = async (time: number) => {
        if (mediaContext?.media.audio?.status.isLoaded) {
            try {
                await mediaContext?.media.audio.sound.setPositionAsync(time);
                await mediaContext?.media.audio.sound.playAsync();
                mediaContext.setMedia({ ...mediaContext.media, playing: true });
                setAudioPosition(time);
            } catch (e) {
                console.debug(e)
            }
        }
    }

    function updateAudioPosition(e: AVPlaybackStatus) {
        if (e.isLoaded) {
            setAudioPosition(Math.round(e.positionMillis));
            if (e.durationMillis) {
                const time = {
                    remaining: secondsToHms(e.durationMillis - e.positionMillis),
                    elapsed: secondsToHms(e.positionMillis)
                }
                setTime(time);
            }
            if (e.durationMillis && audioDuration !== Math.round(e.durationMillis))
                setAudioDuration(Math.round(e.durationMillis));
        }
    }

    function secondsToHms(data: number) {
        const d = Math.round(data / 1000);
        let m: number | string = Math.floor(d % 3600 / 60);
        let s: number | string = Math.floor(d % 3600 % 60);
        if (m < 10)
            m = `0${m}`
        if (s < 10)
            s = `0${s}`
        return `${m}:${s}`
    }

    const loadAndNavigateToSeries = () => {
        navigation.navigate('SeriesLandingScreen', { seriesId: sermon.series.id });
    }

    const handleVideoReady = () => {
        playerRef?.current?.seekTo(mediaContext.media.videoTime, true);
    }

    const loadVideo = async () => {
        try {
            await mediaContext.media.audio?.sound.unloadAsync();
            mediaContext.setAudioNull();
        } catch (e) {
            console.debug(e)
        }

        if (mediaContext.media.playerType === 'mini video' && sermon.seriesTitle === mediaContext.media.series && sermon.episodeTitle === mediaContext.media.episode) {
            mediaContext.setMedia({ ...mediaContext.media, playerType: 'video' });
        } else {
            mediaContext.setMedia({ playerType: 'video', playing: true, video: sermon.id, videoTime: 0, audio: null, episode: sermon.episodeTitle, series: sermon.seriesTitle });
        }
    }

    const loadAudio = async () => {
        if (mediaContext.media.playerType === 'mini audio' && sermon.seriesTitle === mediaContext.media.series && sermon.episodeTitle === mediaContext.media.episode) {
            mediaContext.setMedia({ ...mediaContext.media, playerType: 'audio' });
            mediaContext.media.audio?.sound.setOnPlaybackStatusUpdate((e) => updateAudioPosition(e));
        } else {
            try {
                await mediaContext?.media?.audio?.sound?.unloadAsync();
            } catch (e) {
                console.debug(e)
            }
            try {
                const sound = await Audio.Sound.createAsync(
                    { uri: sermon.audioURL },
                    { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
                    (e) => updateAudioPosition(e)
                );
                mediaContext.setMedia({ playerType: 'audio', playing: true, audio: sound, video: null, videoTime: 0, episode: sermon.episodeTitle, series: sermon.seriesTitle });
                try {
                    await Audio.setAudioModeAsync({
                        playsInSilentModeIOS: true,
                        allowsRecordingIOS: false,
                        staysActiveInBackground: true,
                        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                        shouldDuckAndroid: false,
                        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
                    })
                } catch (e) {
                    console.debug(e)
                }
            } catch (e) {
                console.debug(e)
            }
        }


    }

    const minimizeAudio = () => {
        mediaContext.setMedia({ ...mediaContext.media, playerType: 'mini audio' });
    }

    const minimizeVideo = async () => {
        const videoTime = await playerRef?.current?.getCurrentTime();
        if (videoTime)
            mediaContext.setMedia({ ...mediaContext.media, playerType: 'mini video', videoTime });
    }

    const navigateToNotes = async () => {
        if (mediaContext.media.playerType === 'audio')
            minimizeAudio();
        else if (mediaContext.media.playerType === 'video')
            await minimizeVideo();

        navigation.push('NotesScreen', { date: moment(sermon.publishedDate).format("YYYY-MM-DD") })
    }

    navigation.setOptions({
        headerShown: true,
        title: '',
        headerStyle: { backgroundColor: Theme.colors.background },
        safeAreaInsets: { top: safeArea.top },
        headerLeft: function render() {
            return <Button transparent onPress={
                mediaContext.media.playerType === 'audio' ? minimizeAudio
                    : mediaContext.media.playerType === 'video' ? minimizeVideo
                        : () => navigation.goBack()
            }>
                <Thumbnail square source={mediaContext.media.playerType === 'audio' || mediaContext.media.playerType === 'video' ? Theme.icons.white.mini : Theme.icons.white.closeCancel} style={{ width: 24, height: 24 }} />
            </Button>
        },
        headerRight: function render() {
            return <Button transparent onPress={() => setShare(!share)} >
                <Thumbnail square source={Theme.icons.white.share} style={{ width: 24, height: 24 }} />
            </Button>
        },
        headerLeftContainerStyle: { left: 16 },
        headerRightContainerStyle: { right: 16 }
    })

    return (
        <View style={{ flex: 1 }} >
            <Content>
                {mediaContext.media.playerType === 'video' ? <View style={{ height: Math.round(Dimensions.get('window').width * (9 / 16)), marginBottom: 8 }}>
                    <YoutubePlayer
                        ref={playerRef}
                        onReady={handleVideoReady}
                        forceAndroidAutoplay
                        height={Math.round(Dimensions.get('window').width * (9 / 16))}
                        width={Math.round(Dimensions.get('window').width)}
                        videoId={mediaContext.media.video as string}
                        play={mediaContext.media.playing && Boolean(mediaContext.media.video)}
                        initialPlayerParams={{ modestbranding: true }}
                    />
                </View > : null}

                {audioDuration && mediaContext.media.playerType === 'audio' ? <View style={{ paddingTop: 30, paddingBottom: 50, marginBottom: 8, height: Math.round(Dimensions.get('window').width * (9 / 16)), paddingHorizontal: 16 }}>
                    <Slider minimumValue={0} maximumValue={audioDuration} value={audioPosition} onSlidingStart={pauseAudio} onSlidingComplete={(e) => seekTo(e)} minimumTrackTintColor={Theme.colors.grey5} maximumTrackTintColor={Theme.colors.grey2} thumbTintColor='white' />
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 6 }} >
                        <Text style={style.timeText}>{time.elapsed}</Text>
                        <Text style={style.timeText}>-{time.remaining}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: 20 }} >
                        <TouchableOpacity onPress={() => skipForward(-15000)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Thumbnail source={Theme.icons.grey.skipBack} style={{ width: 24, height: 24, marginTop: 14 }} square></Thumbnail>
                            <Text style={style.skipText}>15s</Text>
                        </TouchableOpacity>
                        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <TouchableOpacity onPress={pauseAudio}><Thumbnail square style={{ width: 40, height: 40, marginBottom: 24 }} source={mediaContext.media.playing ? Theme.icons.white.pauseAudio : Theme.icons.white.playAudio} /></TouchableOpacity>
                            <TouchableOpacity onPress={setPlaybackSpeed}>
                                <Text style={style.speedText}>{audioSpeed.toString()}x</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => skipForward(30000)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Thumbnail source={Theme.icons.grey.skipForward} style={{ width: 24, height: 24, marginTop: 14 }} square></Thumbnail>
                            <Text style={style.skipText}>30s</Text>
                        </TouchableOpacity>
                    </View>
                </View> : null}
                <View style={style.sermonContainer}>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        {sermon.id ? <TeachingButton
                            wrapperStyle={{ flex: 1, height: 56, marginRight: sermon.audioURL ? 16 : 0 }}
                            active={mediaContext.media.playerType === 'video'} label={"Watch"} iconActive={Theme.icons.black.watch}
                            iconInactive={Theme.icons.white.watch} onPress={loadVideo} />
                            : null
                        }
                        {sermon.audioURL ? <TeachingButton
                            wrapperStyle={{ flex: 1, height: 56 }} active={mediaContext.media.playerType === 'audio'}
                            label={"Listen"} iconActive={Theme.icons.black.audio}
                            iconInactive={Theme.icons.white.audio} onPress={loadAudio} />
                            : null
                        }
                    </View>
                    <Text style={style.title}>{sermon.episodeTitle}</Text>
                    <View style={style.detailsContainer}>
                        <View style={[style.detailsContainerItem, { paddingRight: 8 }]}>
                            <Text style={style.detailsTitle}>Series</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={style.detailsText}>E{sermon.episodeNumber},</Text>
                                <IconButton onPress={() => loadAndNavigateToSeries()} style={{ paddingTop: 0, paddingBottom: 0, label: { marginLeft: 8, paddingTop: 0, fontSize: Theme.fonts.smallMedium } }} label={sermon.seriesTitle}></IconButton>
                            </View>
                        </View>
                        <View style={style.detailsContainerItem}>
                            <Text style={style.detailsTitle}>Date</Text>
                            <Text style={style.detailsText}>{moment(sermon.publishedDate).format("MMM D, YYYY")}</Text>
                        </View>
                    </View>
                    <View style={style.detailsDescription}>
                        <Text style={style.body}>{sermon.description}</Text>
                    </View>
                    {moment(sermon.publishedDate).isAfter('2020-06-01') ? <IconButton rightArrow icon={Theme.icons.white.notes} label="Notes" onPress={navigateToNotes} /> : null}
                </View>

                <View style={style.categorySection}>
                    {!sermonsInSeries ?
                        <ActivityIndicator /> :
                        sermonsInSeries?.length > 1 ?
                            <Fragment>
                                <Text style={style.categoryTitle}>More from this Series</Text>
                                <View style={style.listContentContainer}>
                                    {sermonsInSeries?.sort((a, b) => { const aNum = a?.episodeNumber ?? 0; const bNum = b?.episodeNumber ?? 0; return bNum - aNum })
                                        .map((seriesSermon: any) => (
                                            seriesSermon?.id !== sermon.id ?
                                                <TeachingListItem
                                                    key={seriesSermon?.id}
                                                    teaching={seriesSermon}
                                                    handlePress={() => navigation.push('SermonLandingScreen', { item: seriesSermon })} />
                                                : null
                                        ))}
                                </View>
                            </Fragment> : null}
                </View>
            </Content>
            {share ? <ShareModal closeCallback={() => setShare(false)}
                link={`https://www.themeetinghouse.com/videos/${encodeURIComponent(sermon.seriesTitle.trim())}/${sermon.id}`}
                message={sermon.episodeTitle ? sermon.episodeTitle : 'Check out this teaching video'} /> : null}
        </View>
    )
}

const getSeries = `
  query GetSeries($id: ID!) {
    getSeries(id: $id) {
      id
      seriesType
      title
      description
      image
      startDate
      endDate
      videos {
        items {
          id
          episodeTitle
          episodeNumber
          seriesTitle
          series {
            id
          }
          publishedDate
          description
          length
          notesURL
          videoURL
          audioURL
          YoutubeIdent
          videoTypes
          Youtube {
            snippet {
              thumbnails {
                default {
                  url
                }
                medium {
                  url
                }
                high {
                  url
                }
                standard {
                  url
                }
                maxres {
                  url
                }
              }
              channelTitle
              localized {
                title
                description
              }
            }
          }
        }
        nextToken
      }
    }
  }
`;