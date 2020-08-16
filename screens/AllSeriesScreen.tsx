import React, { useState, useEffect } from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View, Body } from 'native-base';
import moment from 'moment';
import { StatusBar, TouchableOpacity, Image, FlatList, TextStyle, ViewStyle } from 'react-native';
import SearchBar from '../components/SearchBar';
import SeriesService from '../services/SeriesService';
import { loadSomeAsync } from '../utils/loading';
import ActivityIndicator from '../components/ActivityIndicator';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

const style = {
    content: [Style.cardContainer, {
        backgroundColor: Theme.colors.black,
        padding: 16
    }],
    header: [Style.header, {
    }],
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
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
    }] as TextStyle,
    title: [Style.title, {
    }],
    body: [Style.body, {
    }],

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
    } as ViewStyle,
    dateSelectYear: {
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.white,
        padding: 16,
        paddingTop: 8,
        paddingBottom: 8,
        marginRight: 8,
        borderRadius: 100,
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
        justifyContent: 'center',
    } as ViewStyle,
    seriesItem: {
        marginBottom: 20,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 0,
    },
    seriesThumbnail: {
        width: 160,
        height: 160 * (1248 / 1056),
    },
    seriesDetail: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.gray5,
        textAlign: 'center',
        marginTop: 8,
    } as TextStyle
}

interface Params {
    navigation: StackNavigationProp<TeachingStackParamList>;
}

export default function AllSeriesScreen({ navigation }: Params): JSX.Element {

    const allYear = { id: "All" };

    const [searchText, setSearchText] = useState("");
    const [selectedYear, setSelectedYear] = useState(allYear);

    const [allSeries, setAllSeries] = useState({ loading: true, items: [], nextToken: null });

    const loadAllSeriesAsync = async () => {
        loadSomeAsync(SeriesService.loadSeriesList, allSeries, setAllSeries);
    }
    useEffect(() => {
        loadAllSeriesAsync();
    }, [])

    const series = allSeries.items.filter((s: any) => searchText ? s.title.toLowerCase().includes(searchText.toLowerCase()) : true);

    const getSeriesDate = (series: any) => {
        return moment(series.startDate || moment()).format("YYYY");
    }

    const seriesYears = [allYear, { id: "2020" }, { id: "2019" }, { id: "2018" }, { id: "2017" }, { id: "2016" }, { id: "2015" }, { id: "2014" }, { id: "2013" }, { id: "2012" }];
    console.log("AllSeriesScreen(): seriesYears = ", seriesYears);

    return (
        <Container>

            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body style={style.headerBody}>
                    <Text style={style.headerTitle}>All Series</Text>
                </Body>
                <Right style={style.headerRight}>
                </Right>
            </Header>

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
                        renderItem={({ item, index, separators }) => (
                            <TouchableOpacity onPress={() => setSelectedYear(item)}>
                                <Text style={[style.dateSelectYear, item.id === selectedYear.id ? style.dateSelectYearSelected : {}]}>{item.id}</Text>
                            </TouchableOpacity>
                        )}
                    ></FlatList>
                </View>

                <View style={style.seriesListContainer}>
                    {allSeries.loading &&
                        <ActivityIndicator />
                    }
                    {series.map((s: any) => (
                        (selectedYear.id === "All" || getSeriesDate(s) === selectedYear.id) &&
                        <TouchableOpacity onPress={() => navigation.push('SeriesLandingScreen', { seriesId: s.id })} style={style.seriesItem} key={s.id}>
                            <Image style={style.seriesThumbnail} source={{ uri: s.image }}></Image>
                            <Text style={style.seriesDetail}>{getSeriesDate(s)} &bull; {s.videos.items.length} episodes</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Content>
        </Container>
    )
}

