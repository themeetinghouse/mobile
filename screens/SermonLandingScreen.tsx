import React, { useState, useEffect, useContext, useRef } from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Content, Left, Right, Header, View, Body, Thumbnail } from 'native-base';
import moment from 'moment';
import { Dimensions, StatusBar, TouchableOpacity, ViewStyle } from 'react-native';
import TeachingListItem from '../components/teaching/TeachingListItem';
import SermonsService from '../services/SermonsService';
import IconButton from '../components/buttons/IconButton';
import TeachingButton from '../components/buttons/TeachingButton';
import { loadSomeAsync } from '../utils/loading';
import ActivityIndicator from '../components/ActivityIndicator';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import MediaContext from '../contexts/MediaContext';
import Slider from '@react-native-community/slider';
import YoutubePlayer from 'react-native-youtube-iframe';

const style = {
    content: [Style.cardContainer, {
        backgroundColor: Theme.colors.black,
    }],
    header: [Style.header, {
    }],
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50,
    },
    headerBody: {
        flexGrow: 3,
        justifyContent: "center",
    } as ViewStyle,
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerTitle: [Style.header.title, {
        width: "100%",
    }],
    title: [Style.title, {
        fontSize: Theme.fonts.large,
        marginTop: 16
    }],
    body: [Style.body, {
    }],

    categoryTitle: [Style.categoryTitle, {
        marginTop: 16
    }],
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
    } as ViewStyle,
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
}

interface Params {
    navigation: StackNavigationProp<TeachingStackParamList, 'SermonLandingScreen'>;
    route: RouteProp<TeachingStackParamList, 'SermonLandingScreen'>;
}

export default function SermonLandingScreen({ navigation, route }: Params): JSX.Element {

    const sermon = route.params?.item;
    const mediaContext = useContext(MediaContext);
    const [sermonsInSeries, setSermonsInSeries] = useState({ loading: true, items: [], nextToken: null });
    const [time, setTime] = useState({ elapsed: '', remaining: '' });
    const [audioSpeed, setAudioSpeed] = useState(1);
    const [audioPosition, setAudioPosition] = useState(0);
    const [audioDuration, setAudioDuration] = useState<number | undefined>(0);
    const playerRef = useRef<any>();

    /*useEffect(() => {
        loadSomeAsync(() => SermonsService.loadSermonsInSeriesList(sermon.seriesTitle), sermonsInSeries, setSermonsInSeries);
    }, [])*/

    const closeAudio = async () => {
        try {
            await mediaContext?.media?.audio?.sound.unloadAsync();
            mediaContext.setMedia({ playerType: 'none', playing: false, audio: null, video: null, series: '', episode: '' })
        } catch (e) {
            console.debug(e)
        }
    }

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

    const loadVideo = async () => {
        unloadAudio();
        mediaContext.setMedia({ playerType: 'video', playing: true, video: { id: sermon.id, time: 0 }, audio: null, episode: sermon.episodeTitle, series: sermon.seriesTitle });
    }

    const loadAudio = async () => {
        if (sermon.seriesTitle === mediaContext.media.series && sermon.episodeTitle === mediaContext.media.episode) {
            mediaContext.setMedia({ ...mediaContext.media, playerType: 'audio' });
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
                mediaContext.setMedia({ playerType: 'audio', playing: true, audio: sound, video: null, episode: sermon.episodeTitle, series: sermon.seriesTitle });
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

    // call on navigation
    const unloadAudio = async () => {
        try {
            await mediaContext?.media.audio.sound.unloadAsync();
        } catch (e) {
            console.debug(e)
        }
    }

    const minimizeAudio = () => {
        mediaContext.setMedia({ ...mediaContext.media, playerType: 'mini audio' });
    }

    const minimizeVideo = async () => {
        const time = await playerRef.current.getCurrentTime();
        mediaContext.setMedia({ ...mediaContext.media, playerType: 'mini video', video: { id: sermon.id, time } });
    }

    return (
        <Container>
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <Button transparent onPress={
                        mediaContext.media.playerType === 'audio' ? minimizeAudio
                            : mediaContext.media.playerType === 'video' ? minimizeVideo
                                : () => navigation.goBack()
                    }>
                        <Thumbnail square source={mediaContext.media.playerType === 'audio' || mediaContext.media.playerType === 'video' ? Theme.icons.white.mini : Theme.icons.white.closeCancel} style={{ width: 24, height: 24 }} />
                    </Button>
                </Left>
                <Body style={style.headerBody}>
                </Body>
                <Right style={style.headerRight}>
                    <Button transparent>
                        <Thumbnail square source={Theme.icons.white.share} style={{ width: 24, height: 24 }} />
                    </Button>
                </Right>
            </Header>
            <Content style={style.content}>
                {mediaContext.media.playerType === 'video' ? <View style={{ height: Math.round(Dimensions.get('window').width * (9 / 16)), marginBottom: 8 }}>
                    <YoutubePlayer
                        ref={playerRef}
                        forceAndroidAutoplay
                        height={Math.round(Dimensions.get('window').width * (9 / 16))}
                        width={Math.round(Dimensions.get('window').width)}
                        videoId={mediaContext.media.video?.id as string}
                        play={mediaContext.media.playing}
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
                        {sermon.videoURL ? <TeachingButton
                            wrapperStyle={{ flex: 1, height: 56, marginRight: sermon.audioURL ? 16 : 0 }}
                            active={mediaContext.media.playerType === 'video'} label={"Watch"} iconActive={Theme.icons.black.watch}
                            iconInactive={Theme.icons.white.watch} onPress={loadVideo} />
                            : null
                        }
                        {sermon.id ? <TeachingButton
                            wrapperStyle={{ flex: 1, height: 56 }} active={mediaContext.media.playerType === 'audio'}
                            label={"Listen"} iconActive={Theme.icons.black.audio}
                            iconInactive={Theme.icons.white.audio} onPress={loadAudio} />
                            : null
                        }
                    </View>
                    <Text style={style.title}>{sermon.episodeTitle}</Text>
                    <View style={style.detailsContainer}>
                        <View style={style.detailsContainerItem}>
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
                    <IconButton rightArrow icon={Theme.icons.white.notes} label="Notes"></IconButton>
                </View>

                <View style={style.categorySection}>
                    <Text style={style.categoryTitle}>More from this Series</Text>
                    <View style={style.listContentContainer}>
                        {sermonsInSeries.loading &&
                            <ActivityIndicator />
                        }
                        {sermonsInSeries.items.map((seriesSermon: any) => (
                            (seriesSermon.id !== sermon.id) ?
                                <TeachingListItem
                                    key={sermon.id}
                                    teaching={seriesSermon}
                                    handlePress={() => navigation.push('SermonLandingScreen', { item: seriesSermon })} />
                                : null
                        ))}
                    </View>
                </View>
            </Content>
        </Container >
    )
}