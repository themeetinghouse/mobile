import React, { useState, useEffect } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, Text, Button, Content, Left, Right, Header, View, Body } from 'native-base';
import moment from 'moment';
import { StatusBar, Image, TouchableOpacity, Dimensions, StyleSheet, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
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

const screenWidth = Dimensions.get('screen').width;

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
    seriesThumbnailContainer: {
        width: 0.7867 * screenWidth,
        height: 1.11 * screenWidth,
        marginHorizontal: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    seriesThumbnail: {
        width: "100%",
        height: 0.944 * screenWidth,
    },
    seriesThumbnailSmall: {
        width: "93.22%",
        height: 0.88 * screenWidth,
        opacity: 0.8
    },
    seriesDetailContainer: {
        alignItems: "center",
        marginTop: 16,
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
        width: 80,
        height: 112,
        marginLeft: 16,
    },
    teacherContainer: {
        alignItems: "center",
        marginLeft: 16,
        maxWidth: 96,
    },
    teacherThumbnailContainer: {
        height: 96,
        width: 96,
        borderRadius: 96,
        borderColor: Theme.colors.gray3,
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
    image: {
        marginLeft: -50,
        marginTop: -50,
        width: 1280,
        height: 720,
    },
    cropped: {
        width: 150,
        height: 150,
        overflow: 'hidden',
        position: 'absolute',
        left: 50,
        top: 50,
    },
})

interface Params {
    navigation: StackNavigationProp<TeachingStackParamList>;
}

interface SeriesData extends LoadSeriesListData {
    loading: boolean;
}

export default function TeachingScreen({ navigation }: Params): JSX.Element {

    const [recentTeaching, setRecentTeaching] = useState({ loading: true, items: [], nextToken: null });
    const [recentSeries, setRecentSeries] = useState<SeriesData>({ loading: true, items: [], nextToken: null });
    const [highlights, setHighlights] = useState({ loading: true, items: [], nextToken: null });
    const [speakers, setSpeakers] = useState({ loading: true, items: [], nextToken: null });
    const [bounce, setBounce] = useState(false);

    const loadRecentSermonsAsync = async () => {
        loadSomeAsync(SermonsService.loadRecentSermonsList, recentTeaching, setRecentTeaching, 5);
    }
    const loadHighlightsAsync = async () => {
        loadSomeAsync(SermonsService.loadHighlightsList, highlights, setHighlights, 5);
    }
    const loadSpeakersAsync = async () => {
        loadSomeAsync(SpeakersService.loadSpeakersList, speakers, setSpeakers);
    }
    const loadRecentSeriesAsync = async () => {
        loadSomeAsync(SeriesService.loadSeriesList, recentSeries, setRecentSeries, 5);
    }

    useEffect(() => {
        loadRecentSeriesAsync();
        loadRecentSermonsAsync();
        loadHighlightsAsync();
        loadSpeakersAsync();
    }, [])

    const contentOffset = (screenWidth - (style.seriesThumbnailContainer.width + 10)) / 2;

    const getSeriesDate = (series: any) => {
        return moment(series.startDate || moment()).format("YYYY");
    }

    const getTeachingImage = (teaching: any) => {
        const thumbnails = teaching.Youtube.snippet.thumbnails;

        console.log(thumbnails.maxres.height, thumbnails.maxres.width)

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

    const getSpeakerImage = (speaker: any) => {
        return `https://www.themeetinghouse.com/static/photos/staff/${speaker.name.replace(/ /g, '_')}_app.jpg`
    }

    const renderSeriesSwipeItem = (itemIndex: number, currentIndex: number, item: any) => {
        if (item?.loading) {
            return <ActivityIndicator />
        }
        return (
            <TouchableOpacity key={item.id} onPress={() => navigation.push('SeriesLandingScreen', { item: item })} style={style.seriesThumbnailContainer}>
                <Animated.Image source={{ uri: item.image }} style={itemIndex === currentIndex ? style.seriesThumbnail : style.seriesThumbnailSmall}></Animated.Image>
                <View style={style.seriesDetailContainer}>
                    <Text style={style.seriesDetail1}>{item.title}</Text>
                    <Text style={style.seriesDetail2}>{getSeriesDate(item)} &bull; {item.videos.items.length} episodes</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <Container>
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                </Left>
                <Body style={style.headerBody}>
                    <Text style={style.headerTitle}>Teaching</Text>
                </Body>
                <Right style={style.headerRight}>
                    <Button transparent>
                        {/* <Thumbnail style={Style.icon} source={Theme.icons.white.user} square></Thumbnail> */}
                    </Button>
                </Right>
            </Header>

            <Content style={style.content} bounces={bounce} onScroll={(e) => handleScroll(e)} >

                <View style={style.categorySection} >
                    <SideSwipe
                        contentContainerStyle={style.horizontalListContentContainer}
                        data={recentSeries?.items?.concat({ loading: true })}
                        itemWidth={0.7867 * screenWidth + 10}
                        threshold={0.35 * screenWidth}
                        style={{ width: "100%" }}
                        contentOffset={contentOffset}
                        renderItem={({ itemIndex, currentIndex, item }) => renderSeriesSwipeItem(itemIndex, currentIndex, item)}
                        onEndReachedThreshold={0.2}
                        onEndReached={loadRecentSeriesAsync}
                        useVelocityForIndex={false}
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
                        horizontal={true}
                        data={highlights.items}
                        renderItem={({ item, index, separators }) => (
                            <Image
                                style={[style.highlightsThumbnail, index === (highlights.items.length - 1) ? style.lastHorizontalListItem : {}]}
                                source={{ uri: getTeachingImage(item) }}
                            ></Image>
                        )}
                        onEndReached={loadHighlightsAsync}
                        onEndReachedThreshold={0.8}
                        ListFooterComponent={() => (
                            <ActivityIndicator />
                        )}
                    ></FlatList>
                </View>


                <View style={style.categorySection}>
                    <Text style={style.categoryTitle}>Popular Sermons</Text>
                    <View style={style.listContentContainer}>
                        {recentTeaching.items.map((teaching: any) => (
                            <TeachingListItem
                                key={teaching.id}
                                teaching={teaching}
                                handlePress={() =>
                                    navigation.push('SermonLandingScreen', { item: teaching })
                                } />
                        ))}
                    </View>
                    <AllButton>More popular sermons</AllButton>
                </View>

                {/*<View style={style.categorySection}>
                    <Text style={style.categoryTitle}>Teachers</Text>
                    <FlatList
                        contentContainerStyle={style.horizontalListContentContainer}
                        horizontal={true}
                        data={speakers.items}
                        renderItem={({ item, index, separators }: any) => (
                            <View style={style.teacherContainer}>
                                <View style={style.teacherThumbnailContainer}>
                                    <Image style={[style.teacherThumbnail, index === (speakers.items.length - 1) ? style.lastHorizontalListItem : {}]} source={{ uri: getSpeakerImage(item) }}></Image>
                                </View>
                                <Text style={style.teacherDetail1}>{item.name}</Text>
                            </View>
                        )}
                        onEndReached={loadSpeakersAsync}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={() => (
                            speakers.loading ? <ActivityIndicator /> : null
                        )}
                    ></FlatList>
                    <AllButton>All teachers</AllButton>
                </View>*/}
            </Content >
        </Container >
    )
}
