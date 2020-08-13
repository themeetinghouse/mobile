import React, { useState, useEffect, useRef, useContext } from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View, Body, Thumbnail } from 'native-base';
import moment from 'moment';
import { StatusBar, ViewStyle, Animated } from 'react-native';
//import SearchBar from '../components/SearchBar';
import TeachingListItem from '../components/teaching/TeachingListItem';
import SermonsService from '../services/SermonsService';
import IconButton from '../components/buttons/IconButton';
import TeachingButton from '../components/buttons/TeachingButton';
import { loadSomeAsync } from '../utils/loading';
import ActivityIndicator from '../components/ActivityIndicator';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
//import YoutubePlayer from 'react-native-youtube-iframe';
import { Audio, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MediaContext from '../contexts/MediaContext';

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
    navigation: StackNavigationProp<TeachingStackParamList>;
    route: RouteProp<TeachingStackParamList, 'SermonLandingScreen'>;
}

export default function SermonLandingScreen({ navigation, route }: Params): JSX.Element {

    const sermon = route.params?.item;

    const media = useContext(MediaContext);

    const [sermonsInSeries, setSermonsInSeries] = useState({ loading: true, items: [], nextToken: null });
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [audioOpen, setAudioOpen] = useState(false);
    const [audioSpeed, setAudioSpeed] = useState(1);
    const [audioPostion, setAudioPosition] = useState(0);
    const [audioDuration, setAudioDuration] = useState<number | undefined>(0);
    const [sound, setSound] = useState<{ sound: Audio.Sound, status: AVPlaybackStatus }>();
    const [buttonUri, setButtonUri] = useState(Theme.icons.white.pauseAudio);
    const [time, setTime] = useState({ elapsed: '', remaining: '' });
    const [mounted, setMounted] = useState(true);

    const expandAnim = useRef(new Animated.Value(0)).current;

    const expand = () => {
        Animated.timing(
            expandAnim,
            {
                toValue: 150,
                duration: 800,
                useNativeDriver: false
                // can't use native driver with height - will determine if there's a better solution
            }
        ).start();
    }

    /*useEffect(() => {
        loadSomeAsync(() => SermonsService.loadSermonsInSeriesList(sermon.seriesTitle), sermonsInSeries, setSermonsInSeries);
    }, [])*/

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
        setMounted(false);
        navigation.navigate('SeriesLandingScreen', { seriesId: sermon.series.id });
    }

    function updateAudioPosition(e: AVPlaybackStatus) {
        if (e.isLoaded && mounted) {
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

    const loadAudio = async () => {
        try {
            const sound = await Audio.Sound.createAsync(
                { uri: sermon.audioURL },
                { shouldPlay: true, progressUpdateIntervalMillis: 1000 },
                (e) => updateAudioPosition(e)
            );
            setAudioOpen(true);
            expand();
            setSound(sound);

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

    const setPlaybackSpeed = async () => {
        if (sound?.status.isLoaded) {
            if (audioSpeed !== 2) {
                sound?.sound.setRateAsync(audioSpeed + 0.5, true, Audio.PitchCorrectionQuality.Medium)
                setAudioSpeed(audioSpeed + 0.5);
            } else {
                sound?.sound.setRateAsync(0.5, true, Audio.PitchCorrectionQuality.Medium)
                setAudioSpeed(0.5);
            }
        }
    }

    const pauseAudio = async (changeIcon?: boolean) => {
        try {
            const status = await sound?.sound.getStatusAsync();
            if (status?.isLoaded) {
                if (status.isPlaying) {
                    await sound?.sound.pauseAsync();
                    if (changeIcon)
                        setButtonUri(Theme.icons.white.playAudio);
                } else {
                    await sound?.sound.playAsync();
                    if (changeIcon)
                        setButtonUri(Theme.icons.white.pauseAudio);
                }
            }
        } catch (e) {
            console.debug(e)
        }
    }

    const skipForward = async (timeForward: number) => {
        if (sound?.status.isLoaded) {
            try {
                await sound?.sound.setPositionAsync(audioPostion + timeForward);
                setAudioPosition(audioPostion + timeForward);
                try {
                    await sound?.sound.playAsync();
                    setButtonUri(Theme.icons.white.pauseAudio);
                } catch (e) {
                    console.debug(e)
                }
            } catch (e) {
                console.debug(e)
            }
        }
    }

    const seekTo = async (time: number) => {
        if (sound?.status.isLoaded) {
            try {
                await sound?.sound.setPositionAsync(time);
                await sound?.sound.playAsync();
                setAudioPosition(time);
            } catch (e) {
                console.debug(e)
            }
        }
    }

    // call on navigation
    const unloadAudio = async () => {
        try {
            await sound?.sound.unloadAsync();
        } catch (e) {
            console.debug(e)
        }
    }

    return (
        <Container>
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <Button transparent onPress={() => { setMounted(false); navigation.goBack() } }>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body style={style.headerBody}>
                </Body>
                <Right style={style.headerRight}>
                    <Button transparent>
                        <Icon name='share' />
                    </Button>
                </Right>
            </Header>

            <Content style={style.content}>
                <View style={style.sermonContainer}>
                    {/*<YoutubePlayer height={300} play={videoPlaying} initialPlayerParams={{ showClosedCaptions: false }} videoId={sermon.id} />*/}
                    {audioOpen && audioDuration ? <Animated.View style={{ marginTop: 30, marginBottom: 50, height: expandAnim }}>
                        <Slider minimumValue={0} maximumValue={audioDuration} value={audioPostion} onSlidingStart={() => pauseAudio()} onSlidingComplete={(e) => seekTo(e)} minimumTrackTintColor={Theme.colors.grey5} maximumTrackTintColor={Theme.colors.grey2} thumbTintColor='white' />
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
                                <TouchableOpacity onPress={() => pauseAudio(true)}><Thumbnail square style={{ width: 40, height: 40, marginBottom: 24 }} source={buttonUri} /></TouchableOpacity>
                                <TouchableOpacity onPress={setPlaybackSpeed}>
                                    <Text style={style.speedText}>{audioSpeed.toString()}x</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => skipForward(30000)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Thumbnail source={Theme.icons.grey.skipForward} style={{ width: 24, height: 24, marginTop: 14 }} square></Thumbnail>
                                <Text style={style.skipText}>30s</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View> : null}
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                        {sermon.videoURL ? <TeachingButton
                            wrapperStyle={{ flex: 1, height: 56, marginRight: sermon.audioURL ? 16 : 0 }}
                            active={videoPlaying} label={"Watch"} iconActive={Theme.icons.black.watch}
                            iconInactive={Theme.icons.white.watch} onPress={() => setVideoPlaying(true)} />
                            : null
                        }
                        {sermon.id ? <TeachingButton
                            wrapperStyle={{ flex: 1, height: 56 }} active={audioOpen}
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
                                    handlePress={() => {
                                            setMounted(false);
                                            navigation.push('SermonLandingScreen', { item: seriesSermon });
                                        }
                                    }/>
                                : null
                        ))}
                    </View>
                </View>

            </Content>
        </Container>
    )
}