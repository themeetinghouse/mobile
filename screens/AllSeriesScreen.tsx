import React, { useState, useEffect } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View, Body } from 'native-base';
import moment from 'moment';
import { StyleSheet, StatusBar, TouchableOpacity, Image, FlatList } from 'react-native';
import SearchBar from '../components/SearchBar';
import SeriesService from '../services/SeriesService';
import { loadSomeAsync } from '../utils/loading';
import ActivityIndicator from '../components/ActivityIndicator';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableHighlight } from 'react-native-gesture-handler';

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
        paddingTop: 10,
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
        justifyContent: 'center',
    },
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
    }
});

interface Params {
    navigation: StackNavigationProp<TeachingStackParamList>;
}

export default function AllSeriesScreen({ navigation }: Params): JSX.Element {

    const [searchText, setSearchText] = useState("");
    const [selectedYear, setSelectedYear] = useState("All");
    const [seriesYears, setSeriesYears] = useState(["All"])

    const [allSeries, setAllSeries] = useState({ loading: true, items: [], nextToken: null });

    const loadAllSeriesAsync = async () => {
        loadSomeAsync(SeriesService.loadSeriesList, allSeries, setAllSeries);
    }

    const generateYears = () => {
        let currentYear = new Date().getFullYear();
        const years = [];

        while (currentYear >= 2007) {
            years.push(currentYear.toString())
            currentYear--
        }
        setSeriesYears(["All"].concat(years));
    }

    useEffect(() => {
        loadAllSeriesAsync();
        generateYears();
    }, [])

    const series = allSeries.items.filter((s: any) => searchText ? s.title.toLowerCase().includes(searchText.toLowerCase()) : true);

    const getSeriesDate = (series: any) => {
        return moment(series.startDate || moment()).format("YYYY");
    }

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
                        <ActivityIndicator />
                    }
                    {series.map((s: any) => (
                        (selectedYear === "All" || getSeriesDate(s) === selectedYear) &&
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

