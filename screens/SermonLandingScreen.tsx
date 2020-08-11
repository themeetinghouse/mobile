import React, { useState, useEffect } from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View, Body } from 'native-base';
import moment from 'moment';
import { StatusBar, ViewStyle } from 'react-native';
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
    }
}

interface Params {
    navigation: StackNavigationProp<TeachingStackParamList>;
    route: RouteProp<TeachingStackParamList, 'SermonLandingScreen'>;
}

export default function SermonLandingScreen({ navigation, route }: Params): JSX.Element {

    const sermon = route.params?.item;

    const [sermonsInSeries, setSermonsInSeries] = useState({ loading: true, items: [], nextToken: null });
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [audioOpen, setAudioOpen] = useState(false);
    const [audioSpeed, setAudioSpeed] = useState(1);
    const [audioPostion, setAudioPosition] = useState(0);
    const [audioDuration, setAudioDuration] = useState<number | undefined>(0);
    const [sound, setSound] = useState<{ sound: Audio.Sound, status: AVPlaybackStatus }>();

    /*useEffect(() => {
        loadSomeAsync(() => SermonsService.loadSermonsInSeriesList(sermon.seriesTitle), sermonsInSeries, setSermonsInSeries);
    }, [])*/

    const loadAndNavigateToSeries = () => {
        navigation.navigate('SeriesLandingScreen', { seriesId: sermon.series.id });
    }

    function updateAudioPosition(e: AVPlaybackStatus) {
        if (e.isLoaded) {
            setAudioPosition(e.positionMillis);
            if (e.durationMillis !== audioDuration)
                setAudioDuration(e.durationMillis);
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
            setSound(sound);
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

    const pauseAudio = async () => {
        try {
            const status = await sound?.sound.getStatusAsync();
            if (status?.isLoaded) {
                if (status.isPlaying) {
                    await sound?.sound.pauseAsync();
                } else {
                    await sound?.sound.playAsync();
                }
            }
        } catch (e) {
            console.debug(e)
        }
    }

    const setPosition = async (timeForward: number) => {
        if (sound?.status.isLoaded) {
            try {
                await sound?.sound.setPositionAsync(audioPostion + timeForward);
                setAudioPosition(audioPostion + timeForward);
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
                    <Button transparent onPress={() => navigation.goBack()}>
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
                    {audioOpen && audioDuration ? <View>
                        <Slider minimumValue={0} maximumValue={audioDuration} value={audioPostion} onSlidingStart={pauseAudio} onSlidingComplete={(e) => seekTo(e)} minimumTrackTintColor={Theme.colors.grey5} maximumTrackTintColor={Theme.colors.grey2} thumbTintColor='white' />
                        <Button onPress={() => setPosition(-15000)}><Text>back 15 sec</Text></Button>
                        <Button onPress={() => setPosition(30000)}><Text>forward 30 sec</Text></Button>
                        <Button onPress={pauseAudio}><Text>pause/play</Text></Button>
                        <Button onPress={setPlaybackSpeed}><Text>{audioSpeed.toString()}x</Text></Button>
                    </View> : null}
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
                                    handlePress={() =>
                                        navigation.push('SermonLandingScreen', { item: seriesSermon })
                                    } />
                                : null
                        ))}
                    </View>
                </View>

            </Content>
        </Container>
    )
}