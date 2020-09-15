import React, { useState, useEffect, useRef } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Text, Button, View, Thumbnail } from 'native-base';
import moment from 'moment';
import { Dimensions, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import TeachingListItem from '../components/teaching/TeachingListItem';
import SeriesService from '../services/SeriesService';
import ActivityIndicator from '../components/ActivityIndicator';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack';
import { RouteProp, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Share from '../components/modals/Share';
import { MainStackParamList } from 'navigation/AppNavigator';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { GetSeriesQuery } from 'services/API';
import { FallbackImageBackground } from '../components/FallbackImage';

const isTablet = Dimensions.get('screen').width >= 768;

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.black,
        }
    },
    header: {
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
    },
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
        }
    },
    body: Style.body,
    seriesImage: {
        width: Dimensions.get('screen').width,
        height: (isTablet ? (1024 / 1280) : (1061 / 848)) * Dimensions.get('screen').width,
    },

    detailsTitle: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.extraLarge,
        marginBottom: 8,
    },
    detailsText: {
        color: Theme.colors.gray5,
        fontSize: Theme.fonts.medium,
    },
    descriptionText: {
        ...Style.body, ...{
            marginTop: 24,
        }
    },

    listContentContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 16,
        marginBottom: 16,
    },

    detailsContainer: {
        position: 'absolute',
        top: (isTablet ? (1024 / 1280) : (1061 / 848)) * Dimensions.get('screen').width - 75,
        padding: 16,
    },
    seriesContainer: {
        marginTop: 75
    },
    headerButtonText: HeaderStyle.linkText,

})

type VideoData = NonNullable<NonNullable<GetSeriesQuery['getSeries']>['videos']>['items'];

interface Params {
    navigation: StackNavigationProp<MainStackParamList>;
    route: RouteProp<TeachingStackParamList, 'SeriesLandingScreen'>;
}

function SeriesLandingScreen({ navigation, route }: Params): JSX.Element {

    const seriesParam = route.params?.item;
    const seriesId = route.params?.seriesId;
    const safeArea = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();

    const [series, setSeries] = useState(seriesParam);
    const [contentFills, setContentFills] = useState(false);
    const [videos, setVideos] = useState<VideoData>();

    const [share, setShare] = useState(false);

    const { colors } = useTheme();

    const yOffset = useRef(new Animated.Value(0)).current;
    const headerOpacity = yOffset.interpolate({
        inputRange: [0, 75],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    navigation.setOptions({
        headerShown: true,
        headerTransparent: true,
        headerBackground: function render() {
            return <Animated.View
                style={{
                    backgroundColor: Theme.colors.background,
                    ...StyleSheet.absoluteFillObject,
                    opacity: contentFills ? headerOpacity : 0,
                    borderBottomColor: colors.border,
                    borderBottomWidth: StyleSheet.hairlineWidth
                }}
            />
        },
        title: '',
        safeAreaInsets: { top: safeArea.top },
        headerLeft: function render() {
            return <TouchableOpacity onPress={() => navigation.goBack()} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <Thumbnail square source={Theme.icons.white.back} style={{ width: 24, height: 24 }} />
                <Text style={{ color: 'white', fontSize: 16, transform: [{ translateX: -4 }] }}>Teaching</Text>
            </TouchableOpacity>
        },
        headerRight: function render() {
            return <View>
                <Button transparent onPress={() => setShare(!share)}>
                    <Thumbnail square source={Theme.icons.white.share} style={{ width: 24, height: 24 }} />
                </Button>
                <Share
                    show={share} top={headerHeight - safeArea.top}
                    link={`https://www.themeetinghouse.com/videos/${encodeURIComponent(series?.title.trim())}/${videos?.slice(-1)[0]?.id}`}
                    message={series?.title}
                />
            </View>

        },
        headerLeftContainerStyle: { left: 16 },
        headerRightContainerStyle: { right: 16 }
    })

    useEffect(() => {
        const loadSermonsInSeriesAsync = async () => {
            let loadedSeries = series;
            if (!loadedSeries && seriesId) {
                loadedSeries = await SeriesService.loadSeriesById(seriesId);
                setSeries(loadedSeries);
            }
            const json = await API.graphql(graphqlOperation(getSeries, { id: seriesId ?? series.id })) as GraphQLResult<GetSeriesQuery>;
            setVideos(json.data?.getSeries?.videos?.items);
        }
        loadSermonsInSeriesAsync();
    }, [])


    function handleOnLayout(height: number) {
        if (height > Dimensions.get('screen').height) {
            setContentFills(true);
        }
    }

    return (
        <Animated.ScrollView
            style={[style.content, { marginTop: -safeArea.top }]}
            onScroll={Animated.event(
                [
                    {
                        nativeEvent: {
                            contentOffset: {
                                y: yOffset,
                            },
                        },
                    },
                ],
                { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
        >
            {series ?
                <View
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                    onResponderGrant={() => setShare(false)}
                    onResponderMove={() => setShare(false)}
                    onResponderRelease={() => setShare(false)}
                    style={{ paddingBottom: 48 }}
                    onLayout={(e) => handleOnLayout(e.nativeEvent.layout.height)}
                >
                    <FallbackImageBackground style={style.seriesImage} uri={isTablet ? series.heroImage : series.image640px} catchUri='https://www.themeetinghouse.com/static/photos/series/series-fallback.jpg' >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']}
                            locations={[0, 0.12, 0.26, 0.6, 0.8, 1]}
                            style={{
                                position: 'absolute',
                                height: '100%',
                                width: '100%'
                            }}
                        />
                    </FallbackImageBackground>
                    <View style={style.detailsContainer}>
                        <Text style={style.detailsTitle}>{series.title}</Text>
                        <View>
                            <Text style={style.detailsText}>{moment(series.startDate).year()} &bull; {series.videos.items.length} {series.videos.items.length == 1 ? 'episode' : 'episodes'}</Text>
                        </View>
                    </View>
                    <View style={style.seriesContainer}>
                        <View style={style.listContentContainer}>
                            {!videos ?
                                <ActivityIndicator />
                                : videos.sort((a, b) => { const aNum = a?.episodeNumber ?? 0; const bNum = b?.episodeNumber ?? 0; return bNum - aNum }).map((seriesSermon: any) => (
                                    <TeachingListItem
                                        key={seriesSermon.id}
                                        teaching={seriesSermon}
                                        handlePress={() =>
                                            navigation.push('SermonLandingScreen', { item: seriesSermon })
                                        } />
                                ))}
                        </View>
                    </View>
                </View>
                : null}
        </Animated.ScrollView>
    )
}


export default SeriesLandingScreen;

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
                  width
                  height
                }
                medium {
                  url
                  width
                  height
                }
                high {
                  url
                  width
                  height
                }
                standard {
                  url
                  width
                  height
                }
                maxres {
                  url
                  width
                  height
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
