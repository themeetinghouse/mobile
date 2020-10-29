import React, { useState, useEffect } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, Text, Content, View, Thumbnail } from 'native-base';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import SearchBar from '../components/SearchBar';
import SeriesService from '../services/SeriesService';
import { loadSomeAsync } from '../utils/loading';
import ActivityIndicator from '../components/ActivityIndicator';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableHighlight } from 'react-native-gesture-handler';
import FallbackImage from '../components/FallbackImage';
import AllButton from '../components//buttons/AllButton';

const width = Dimensions.get('screen').width;

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.black,
            padding: 16
        }
    },
    header: Style.header,
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 70,
        left: 12
    },
    headerBody: {
        flexGrow: 3,
        justifyContent: "center",
    },
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 70
    },
    headerTitle: HeaderStyle.title,
    title: Style.title,
    body: Style.body,
    horizontalListContentContainer: {
    },
    lastHorizontalListItem: {
        marginRight: 16,
    },
    searchBar: {
        marginBottom: 16,
    },
    dateSelectBar: {
        flexDirection: "row",
        marginBottom: 32,
    },
    dateSelectYear: {
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.white,
        padding: 16,
        paddingTop: Platform.OS === 'android' ? 8 : 10,
        paddingBottom: 8,
        backgroundColor: Theme.colors.gray2,
    },
    dateSelectYearSelected: {
        backgroundColor: Theme.colors.white,
        color: Theme.colors.black,
    },
    seriesListContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    seriesItem: {
        marginBottom: 20,
        marginTop: 0,
    },
    seriesThumbnail: {
        width: width * 0.44,
        height: width * 0.44 * (1248 / 1056),
    },
    seriesDetail: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.gray5,
        textAlign: 'center',
        marginTop: 8,
    }
});

interface Params {
    navigation: StackNavigationProp<TeachingStackParamList, 'AllSeriesScreen'>;
}

export default function AllSeriesScreen({ navigation }: Params): JSX.Element {

    const [searchText, setSearchText] = useState("");
    const [selectedYear, setSelectedYear] = useState("All");
    const [seriesYears, setSeriesYears] = useState(["All"])
    const [showCount, setShowCount] = useState(20);
    const [allSeries, setAllSeries] = useState({ loading: true, items: [], nextToken: null });

    const loadAllSeriesAsync = async () => {
        loadSomeAsync(SeriesService.loadSeriesList, allSeries, setAllSeries);
    }

    const generateYears = () => {
        let currentYear = new Date().getFullYear();
        const years = [];

        while (currentYear >= 2006) {
            years.push(currentYear.toString())
            currentYear--
        }
        setSeriesYears(["All"].concat(years));
    }

    useEffect(() => {
        generateYears();
        loadAllSeriesAsync();
    }, [])
    const getSeriesDate = (series: any) => {
        return moment(series.startDate || moment()).format("YYYY");
    }
    const series = allSeries.items.filter((s: any) => searchText ? s.title.toLowerCase().includes(searchText.toLowerCase()) : true).filter((a) => { return selectedYear === "All" || getSeriesDate(a) === selectedYear }).filter((a) => { return selectedYear === "All" || getSeriesDate(a) === selectedYear });;


    navigation.setOptions({
        headerShown: true,
        title: 'All Series',
        headerTitleStyle: style.headerTitle,
        headerStyle: { backgroundColor: Theme.colors.background },
        headerLeft: function render() {
            return <TouchableOpacity onPress={() => navigation.goBack()} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <Thumbnail square source={Theme.icons.white.back} style={{ width: 24, height: 24 }} />
                <Text style={{ color: 'white', fontSize: 16, transform: [{ translateX: -4 }] }}>Teaching</Text>
            </TouchableOpacity>
        },
        headerLeftContainerStyle: { left: 16 },
        headerRight: function render() { return <View style={{ flex: 1 }} /> }
    })

    return (
        <Container>
            <Content style={style.content}>
                <SearchBar
                    style={style.searchBar}
                    searchText={searchText}
                    handleTextChanged={(newStr) => setSearchText(newStr)}
                    placeholderLabel="Search by name..."></SearchBar>
                <View style={style.dateSelectBar}>
                    <FlatList
                        style={style.horizontalListContentContainer}
                        horizontal={true}
                        data={seriesYears}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableHighlight underlayColor={Theme.colors.grey3} onPress={() => setSelectedYear(item)} style={{ borderRadius: 50, overflow: 'hidden', marginRight: 8 }} >
                                <Text style={[style.dateSelectYear, item === selectedYear ? style.dateSelectYearSelected : {}]}>{item}</Text>
                            </TouchableHighlight>
                        )}
                    />
                </View>
                <View style={style.seriesListContainer}>
                    {allSeries.loading &&
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                            <ActivityIndicator />
                        </View>
                    }
                    {series.map((s: any, key: any) => {
                        if (key < showCount) {
                            return (
                                <TouchableOpacity onPress={() => navigation.push('SeriesLandingScreen', { seriesId: s.id })} style={style.seriesItem} key={s.id}>
                                    <FallbackImage style={style.seriesThumbnail} uri={s.image} catchUri='https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg' />
                                    <Text style={style.seriesDetail}>{getSeriesDate(s)} &bull; {s.videos.items.length} episodes</Text>
                                </TouchableOpacity>)
                        } else {
                            return null
                        }
                    })}

                </View>
                {series?.length > 20 && showCount < series.length ?
                    <View style={{ marginBottom: 20 }}>
                        <AllButton handlePress={() => setShowCount(showCount + 20)}>Load More</AllButton>
                    </View>
                    : null}
            </Content>
        </Container>
    )
}

