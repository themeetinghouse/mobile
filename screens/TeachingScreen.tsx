import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, Text, Button, View, Thumbnail } from 'native-base';
import moment from 'moment';
import { ScrollView, Image, TouchableOpacity, Dimensions, StyleSheet, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import SideSwipe from 'react-native-sideswipe';
import AllButton from '../components/buttons/AllButton';
import TeachingListItem from '../components/teaching/TeachingListItem';
import ActivityIndicator from '../components/ActivityIndicator';
import { FlatList } from 'react-native-gesture-handler';
import SermonsService from '../services/SermonsService';
import SeriesService from '../services/SeriesService';
import SpeakersService from '../services/SpeakersService';
import { loadSomeAsync } from '../utils/loading';
import { LoadSeriesListData } from '../services/SeriesService';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import UserContext from '../contexts/UserContext';
import { MainStackParamList } from 'navigation/AppNavigator';
import { CompositeNavigationProp } from '@react-navigation/native';
import API, { GRAPHQL_AUTH_MODE, GraphQLResult } from '@aws-amplify/api';
import { GetVideoByVideoTypeQueryVariables, GetVideoByVideoTypeQuery } from 'services/API';
import { AnimatedFallbackImage } from '../components/FallbackImage';
import SeriesItem from "./SeriesItem";
const screenWidth = Dimensions.get('screen').width;
const isTablet = screenWidth >= 768;

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.gray1,
            paddingLeft: 0,
            paddingRight: 0,
        }
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
        alignItems: "center",
        marginBottom: 24
    },
    lastHorizontalListItem: {
        marginRight: 16,
    },
    seriesThumbnailContainer: isTablet ? {
        width: 0.33 * screenWidth,
        height: 0.4653 * screenWidth,
        marginHorizontal: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    } : {
            width: 0.7867 * screenWidth,
            height: 1.11 * screenWidth,
            marginHorizontal: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
    seriesThumbnail: isTablet ? {
        width: "100%",
        height: 0.396 * screenWidth,
    } : {
            width: "100%",
            height: 0.944 * screenWidth,
        },
    seriesDetailContainer: {
        alignItems: "center",
        marginTop: 16,
    },
    seriesListContainer: {
        marginTop: 14,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: 16
    },
    seriesDetail1: {
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.medium,
        color: Theme.colors.white,
        textAlign: "center"
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
        alignItems: "center",
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
    teacherThumbnail: {
        position: 'absolute',
        top: -1,
        left: -1,
        width: 96,
        height: 96,
        borderRadius: 96,
        overflow: "hidden",
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
        alignSelf: "center",
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: 12,
        lineHeight: 18,
        color: Theme.colors.white
    }
})

type PopularVideoData = NonNullable<NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['items']>

interface Params {
    navigation: CompositeNavigationProp<StackNavigationProp<MainStackParamList>, StackNavigationProp<TeachingStackParamList>>;
}

interface SeriesData extends LoadSeriesListData {
    loading: boolean;
}

export default function TeachingScreen({ navigation }: Params): JSX.Element {

    const user = useContext(UserContext);
    const [recentTeaching, setRecentTeaching] = useState({ loading: true, items: [], nextToken: null });
    const [recentSeries, setRecentSeries] = useState<SeriesData>({ loading: true, items: [], nextToken: null });
    const [customPlaylists, setcustomPlaylists] = useState<SeriesData>({ loading: true, items: [], nextToken: null })
    const [highlights, setHighlights] = useState({ loading: true, items: [], nextToken: undefined });
    const [speakers, setSpeakers] = useState({ loading: true, items: [], nextToken: null });
    const [bounce, setBounce] = useState(false);
    const [popular, setPopular] = useState<PopularVideoData>([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Teaching',
            headerTitleStyle: style.headerTitle,
            headerStyle: { backgroundColor: Theme.colors.background },
            headerLeft: function render() {
                return <View style={{ flex: 1 }} />
            },
            headerRight: function render() {
                return <Button icon transparent style={{}} onPress={() => navigation.navigate('ProfileScreen')}>
                    <Thumbnail square source={user?.userData?.email_verified ? Theme.icons.white.userLoggedIn : Theme.icons.white.user} style={style.icon}></Thumbnail>
                </Button>
            },
            headerRightContainerStyle: { right: 16 },
        })
    })

    const loadRecentSermonsAsync = async () => {
        loadSomeAsync(SermonsService.loadRecentSermonsList, recentTeaching, setRecentTeaching, 6);
    }
    const loadHighlightsAsync = async () => {
        loadSomeAsync(SermonsService.loadHighlightsList, highlights, setHighlights, 5);
    }
    const loadSpeakersAsync = async () => {
        loadSomeAsync(SpeakersService.loadSpeakersList, speakers, setSpeakers);
    }
    const loadRecentSeriesAsync = async () => {
        loadSomeAsync(SeriesService.loadSeriesList, recentSeries, setRecentSeries, 10);
    }
    const loadCustomPlaylists = async () => {
        loadSomeAsync(SeriesService.loadCustomPlaylists, customPlaylists, setcustomPlaylists, 10)
    }
    const getPopularTeaching = async () => {
        const startDate = moment().subtract(150, 'days').format('YYYY-MM-DD')
        const variables: GetVideoByVideoTypeQueryVariables = {
            limit: 30,
            videoTypes: 'adult-sunday',
            publishedDate: { gt: startDate },
        };

        const json = await API.graphql({
            query: getVideoByVideoType,
            variables,
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        }) as GraphQLResult<GetVideoByVideoTypeQuery>;
        const items = json?.data?.getVideoByVideoType?.items ?? [];
        const popular = items.filter(item => item?.viewCount ? parseInt(item?.viewCount, 10) >= 700 : false);
        setPopular(popular);
    }

    useEffect(() => {
        loadRecentSeriesAsync();
        loadRecentSermonsAsync();
        loadHighlightsAsync();
        loadSpeakersAsync();
        loadCustomPlaylists();
        getPopularTeaching();
    }, [])
    const contentOffset = (screenWidth - (style.seriesThumbnailContainer.width + 10)) / 2;

    const getSeriesDate = (series: any) => {
        return moment(series.startDate || moment()).format("YYYY");
    }

    const getTeachingImage = (teaching: any) => {
        const thumbnails = teaching.Youtube.snippet.thumbnails;

        if (thumbnails.standard)
            return thumbnails.standard.url;
        else if (thumbnails.maxres)
            return thumbnails.maxres.url;
    }

    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        if (event.nativeEvent.contentOffset.y > Dimensions.get('screen').height) {
            setBounce(true)
        } else {
            setBounce(false)
        }
    }

    /*const getSpeakerImage = (speaker: any) => {
        return `https://www.themeetinghouse.com/static/photos/staff/${speaker.name.replace(/ /g, '_')}_app.jpg`
    }*/
    const renderSeriesSwipeItem = (item: any, index: number, animatedValue: Animated.Value) => {
        if (item?.loading) {
            return <ActivityIndicator />
        }
        return (
            <TouchableOpacity key={item.id} onPress={() => navigation.push('SeriesLandingScreen', { item: item })} style={style.seriesThumbnailContainer}>
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
                                }
                            ],
                        },
                    }}
                    uri={item.image640px}
                    catchUri='https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg'
                />

                <View style={style.seriesDetailContainer}>
                    <Text style={style.seriesDetail1}>{item.title}</Text>
                    <Text style={style.seriesDetail2}>{getSeriesDate(item)} &bull; {item.videos.items.length} episodes</Text>
                </View>
            </TouchableOpacity>
        )
    }

    function sortByViews(a: PopularVideoData[0], b: PopularVideoData[0]) {
        if (!a?.viewCount || !b?.viewCount)
            return -1
        return parseInt(b.viewCount, 10) - parseInt(a.viewCount, 10)
    }
    return (
        <Container>
            <ScrollView style={style.content} bounces={bounce} onScroll={e => handleScroll(e)} scrollEventThrottle={6}>
                <View style={style.categorySection} >
                    <SideSwipe
                        contentContainerStyle={style.horizontalListContentContainer}
                        data={recentSeries?.items?.concat({ loading: true }) ?? []}
                        itemWidth={isTablet ? 0.33 * screenWidth + 10 : 0.7867 * screenWidth + 10}
                        threshold={isTablet ? 0.25 * screenWidth : 0.38 * screenWidth}
                        style={{ width: "100%" }}
                        contentOffset={contentOffset}
                        onEndReachedThreshold={0.2}
                        onEndReached={loadRecentSeriesAsync}
                        useVelocityForIndex={true}
                        renderItem={({ item, itemIndex, animatedValue }) => renderSeriesSwipeItem(item, itemIndex, animatedValue)}
                    />
                    <AllButton handlePress={() => { navigation.push('AllSeriesScreen') }}>All series</AllButton>
                </View>

                <View style={style.categorySection}>
                    <Text style={style.categoryTitle}>Recent Teaching</Text>
                    <View style={style.listContentContainer}>
                        {recentTeaching.loading &&
                            <ActivityIndicator animating={recentTeaching.loading} />
                        }
                        {!recentTeaching.loading &&
                            recentTeaching.items.map((teaching: any) => (
                                <TeachingListItem
                                    key={teaching.id}
                                    teaching={teaching}
                                    handlePress={() =>
                                        navigation.push('SermonLandingScreen', { item: teaching })
                                    } />
                            ))}
                    </View>
                    <AllButton handlePress={() => { navigation.push('AllSermonsScreen') }}>All sermons</AllButton>
                </View>

                <View style={style.categorySection}>
                    <Text style={style.categoryTitle}>Highlights</Text>
                    <Text style={style.highlightsText}>Short snippets of teaching</Text>
                    <FlatList
                        contentContainerStyle={style.horizontalListContentContainer}
                        getItemLayout={(data, index) => { return { length: 80 * (16 / 9), offset: 80 * (16 / 9) + 16, index } }}
                        horizontal={true}
                        data={highlights.items}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => navigation.push('HighlightScreen', { highlights: highlights.items.slice(index), nextToken: highlights.nextToken })} >
                                <Image
                                    style={[style.highlightsThumbnail, index === (highlights.items.length - 1) ? style.lastHorizontalListItem : {}]}
                                    source={{ uri: getTeachingImage(item) }}
                                />
                            </TouchableOpacity>
                        )}
                        onEndReached={loadHighlightsAsync}
                        onEndReachedThreshold={0.8}
                        ListFooterComponent={() => (
                            <ActivityIndicator />
                        )}
                    ></FlatList>
                </View>

                <View style={style.categorySection}>
                    <Text style={style.categoryTitle}>Popular Teaching</Text>
                    <View style={style.listContentContainer}>
                        {popular.sort((a, b) => sortByViews(a, b)).slice(0, 6).map(video => (
                            <TeachingListItem
                                key={video?.id}
                                teaching={video}
                                handlePress={() =>
                                    navigation.push('SermonLandingScreen', { item: video })
                                } />
                        ))}
                    </View>
                    <AllButton handlePress={() => navigation.navigate('PopularTeachingScreen', { popularTeaching: popular.sort((a, b) => sortByViews(a, b)) })} >More popular teaching</AllButton>
                </View>
                <View style={style.categorySection}>
                    <Text style={style.categoryTitle}>Curated Sermon Playlists</Text>
                    <Text style={style.highlightsText}>Some sort of description of what these are.</Text>
                    {customPlaylists.loading &&
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <ActivityIndicator />
                        </View>
                    }
                    <View style={style.seriesListContainer}>
                        {customPlaylists?.items?.map((s: any, key: any) => {
                            if (key < 4)
                                return (<SeriesItem key={s.id} customPlaylist={true} navigation={navigation as any} seriesData={s}></SeriesItem>)
                            else
                                return null;
                        })}
                    </View>
                    <AllButton handlePress={() => navigation.push('AllSeriesScreen', { customPlaylists: true })}>More Playlists</AllButton>
                </View>
                <View style={style.categorySectionLast}>
                    <Text style={[style.categoryTitle, { marginBottom: 4 }]}>Teachers</Text>
                    {!speakers.loading ?
                        <>
                            <FlatList
                                contentContainerStyle={[style.horizontalListContentContainer, { marginBottom: 2 }]}
                                horizontal={true}
                                data={speakers.items}
                                renderItem={({ item, index, separators }: any) => !item.hidden ? (
                                    <TouchableOpacity onPress={() => navigation.push("Main", { screen: "More", params: { screen: "TeacherProfile", params: { staff: { ...item, uri: item.image, idFromTeaching: item.name } } } })}>
                                        <View style={style.teacherContainer}>
                                            <View style={[style.teacherThumbnailContainer, {
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }]}>
                                                <Image style={{ width: 30, height: 30 }} source={Theme.icons.white.user}></Image>
                                                <Image style={[style.teacherThumbnail, index === (speakers.items.length - 1) ? style.lastHorizontalListItem : {}]} source={{ uri: item.image }}></Image>
                                            </View>
                                            <Text style={style.teacherDetail1}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : null}
                                ListFooterComponent={() => (
                                    speakers.loading ? <ActivityIndicator /> : null
                                )}
                            ></FlatList>
                            <AllButton handlePress={() => navigation.push('TeacherList')}>All teachers</AllButton>
                        </>
                        : <ActivityIndicator />}
                </View>
            </ScrollView >
        </Container >
    )
}
export const getVideoByVideoType = `query GetVideoByVideoType(
    $videoTypes: String
    $publishedDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelVideoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getVideoByVideoType(
      videoTypes: $videoTypes
      publishedDate: $publishedDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        viewCount
        YoutubeIdent
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
          }
        }
        videoTypes
        notesURL
        videoURL
        audioURL
      }
      nextToken
    }
  }
  `;