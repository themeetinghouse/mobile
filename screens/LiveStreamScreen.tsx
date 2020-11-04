import React, { useEffect, useState } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, View } from 'native-base';
import moment from 'moment';
import { StyleSheet, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
//import { useContext } from 'react';
//import MediaContext from '../contexts/MediaContext';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { useRef } from 'react';
import NotesScreen from './NotesScreen';
import { MainStackParamList } from 'navigation/AppNavigator';
import LiveEventService from "../services/LiveEventService"
const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.black,
            padding: 0,
        },
    },
    player: {
        height: Math.round(Dimensions.get('window').width * (9 / 16)),
    },
    header: Style.header,
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
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
            padding: 16,
        }
    },
    body: {
        ...Style.body, ...{
        },
    },
})

interface Props {
    navigation: StackNavigationProp<MainStackParamList, "NotesScreen">;
    route: RouteProp<MainStackParamList, 'NotesScreen'>;
}

type LiveEvent = {
    id: string | null,
    date: string | null,
    startTime: string | null,
    videoStartTime: string | null,
    endTime: string | null,
    prerollYoutubeId: string | null,
    liveYoutubeId: string | null,
} | null;

export default function LiveStreamScreen(props: Props): JSX.Element {
    const [currentEvent, setcurrentEvent] = useState<LiveEvent>(null);
    const [showTime, setshowTime] = useState<boolean>(false)
    //const mediaContext = useContext(MediaContext);
    const playerRef = useRef<YoutubeIframeRef>(null);
    const deviceWidth = Dimensions.get('window').width
    const today = moment().utcOffset(moment().isDST() ? '-0400' : '-0500').format('2020-11-01')
    const handleVideoReady = () => {
        playerRef?.current?.seekTo(0, true);
    }

    useEffect(() => {
        const loadLiveStreams = async () => {
            try {
                const liveStreamsResult = await LiveEventService.startLiveEventService()
                liveStreamsResult.liveEvents.map((event: LiveEvent) => {
                    const rightNow = moment().utcOffset(moment().isDST() ? '-0400' : '-0500').format('09:49')
                    const showTime = event?.startTime && event?.endTime && rightNow >= event.startTime && rightNow <= event.endTime
                    if (showTime) {
                        setcurrentEvent(event)
                    }
                })
            }
            catch (error) {
                console.log(error)
            }
        }
        loadLiveStreams();
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Ticking in livestream page")
            const start = currentEvent?.videoStartTime
            const end = currentEvent?.endTime
            const rightNow = moment().utcOffset(moment().isDST() ? '-0400' : '-0500').format('09:49')
            //console.log(videoStartTime is ${currentEvent?.videoStartTime} endTime is ${currentEvent?.endTime} and current time is ${rightNow}`)
            if (start && end) {
                const showTime = rightNow >= start && rightNow <= end
                if (showTime) {
                    //console.log("ShowLive")
                    setshowTime(true)
                }
            }
            else {
                setshowTime(false)
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [currentEvent]);
    // this page needs to be unmounted when navigating to teaching
    return (
        <Container style={{ backgroundColor: "black" }}>
            <View style={style.player}>
                {showTime ?
                    <YoutubePlayer
                        volume={100}
                        ref={playerRef}
                        onReady={handleVideoReady}
                        forceAndroidAutoplay
                        height={Math.round(deviceWidth * (9 / 16))}
                        width={Math.round(deviceWidth)}
                        videoId={currentEvent ? currentEvent.liveYoutubeId as string : ""}
                        play={true}
                        initialPlayerParams={{ modestbranding: true }}
                    /> :
                    <YoutubePlayer
                        volume={100}
                        ref={playerRef}
                        onReady={handleVideoReady}
                        forceAndroidAutoplay
                        height={Math.round(deviceWidth * (9 / 16))}
                        width={Math.round(deviceWidth)}
                        videoId={currentEvent ? currentEvent.prerollYoutubeId as string : ""}
                        play={true}
                        initialPlayerParams={{ modestbranding: true }}
                    />}
            </View >
            <NotesScreen fromLiveStream={true} today={today} navigation={props.navigation} route={props.route}></NotesScreen>
        </Container>
    )
}