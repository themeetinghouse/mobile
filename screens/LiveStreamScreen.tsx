import React, { useEffect, useState } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, Body, View } from 'native-base';
import IconButton from '../components/buttons/IconButton';
import moment from 'moment';
import MediaContext from '../contexts/MediaContext';
import { StatusBar, StyleSheet, Dimensions } from 'react-native';
import { HomeStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useContext } from 'react';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { useRef } from 'react';
import { runGraphQLQuery } from "../services/ApiService"
import NotesScreen from './NotesScreen';
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
            marginBottom: 5,
        }
    },
})

interface Props {
    navigation: StackNavigationProp<HomeStackParamList>;
    route: RouteProp<HomeStackParamList, 'LiveStreamScreen'>;
}


export default function LiveStreamScreen(props: Props): JSX.Element {
    const [currentEvent, setcurrentEvent]: any = useState(null);
    const [showTime, setshowTime]: any = useState(null);
    const [currentTime, setcurrentTime] = useState(moment().format("HH:mm"))
    const mediaContext = useContext(MediaContext);
    const playerRef = useRef<YoutubeIframeRef>(null);
    const deviceWidth = Dimensions.get('window').width
    const today = moment().format('2020-10-25') // this needs to be the current date and must account for timezone!
    const handleVideoReady = () => {
        playerRef?.current?.seekTo(mediaContext.media.videoTime, true);
    }

    useEffect(() => {
        const loadLiveStreams = async () => {
            try {
                const liveStreamsResult = await runGraphQLQuery({ query: listLivestreams, variables: { filter: { date: { eq: today } } } })
                liveStreamsResult.listLivestreams.items.map((event: any) => {
                    const rightNow = "09:50"//moment().format('HH:mm') // needs timezone
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
            const start = currentEvent?.videoStartTime
            const end = currentEvent?.endTime
            const rightNow = "09:50"//moment().format('HH:mm') // needs timezone
            console.log(`VideoStartTime is ${currentEvent?.videoStartTime} endTime is ${currentEvent?.endTime} and current time is ${rightNow}`)
            if (start && end) {
                const showTime = rightNow >= start && rightNow <= end
                if (showTime) {
                    console.log("ShowLive")
                    setshowTime(true)
                }
            }
            else {
                setshowTime(false)
            }


        }, 1000);
        return () => clearInterval(interval);
    }, [currentEvent]);

    return (
        <Container>
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="light-content" />
                <Left style={style.headerLeft}>
                    <Button transparent onPress={() => props.navigation.goBack()}>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body style={style.headerBody}>
                    <Text style={style.headerTitle}>{showTime === null ? "" : showTime === true ? "Livestream" : "Livestream Pre-roll"}</Text>
                </Body>
                <Right style={style.headerRight}>
                    {/*Share modal here */}
                </Right>
            </Header>
            <Content style={style.content}>

                <View style={style.player}>
                    {showTime ?
                        <>
                            <YoutubePlayer
                                ref={playerRef}
                                onReady={handleVideoReady}
                                forceAndroidAutoplay
                                height={Math.round(deviceWidth * (9 / 16))}
                                width={Math.round(deviceWidth)}
                                videoId={currentEvent ? currentEvent.liveYoutubeId as string : ""}
                                play={mediaContext.media.playing && Boolean(mediaContext.media.video)}
                                initialPlayerParams={{ modestbranding: true }}
                            />
                        </> : <>
                            <YoutubePlayer
                                ref={playerRef}
                                onReady={handleVideoReady}
                                forceAndroidAutoplay
                                height={Math.round(deviceWidth * (9 / 16))}
                                width={Math.round(deviceWidth)}
                                videoId={currentEvent ? currentEvent.prerollYoutubeId as string : ""}
                                play={mediaContext.media.playing && Boolean(mediaContext.media.video)}
                                initialPlayerParams={{ modestbranding: true }}
                            />
                        </>}
                </View >
                <IconButton style={{ marginTop: 20, padding: 16 }} rightArrow icon={Theme.icons.white.notes} label="Notes" onPress={() => props.navigation.push('NotesScreen', { date: moment().format('YYYY-MM-DD') })} />
            </Content>
        </Container>
    )
}

const listLivestreams = /* GraphQL */ `
  query ListLivestreams(
    $filter: ModelLivestreamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLivestreams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        startTime
        videoStartTime
        endTime
        prerollYoutubeId
        liveYoutubeId
        showChat
        showKids
        menu {
          title
          link
          linkType
        }
        zoom {
          title
          link
        }
        titles
        homepageLink
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;