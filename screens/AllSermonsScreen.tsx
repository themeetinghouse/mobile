import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, Text, Content, View, Thumbnail } from 'native-base';
import moment from 'moment';
import { TouchableOpacity, StyleSheet, TouchableHighlight, Platform, Button } from 'react-native';
import SearchBar from '../components/SearchBar';
import TeachingListItem from '../components/teaching/TeachingListItem';
import ActivityIndicator from '../components/ActivityIndicator';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from 'navigation/AppNavigator';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { GetVideoByVideoTypeQuery, GetVideoByVideoTypeQueryVariables, ModelSortDirection } from '../services/API';
import AllButton from '../components/buttons/AllButton'

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
    title: Style.title,
    body: Style.body,
    searchBar: {
        marginBottom: 16,
    },
    dateSelectBar: {
        marginBottom: 32,
        alignItems: "flex-start",
    },
    dateRangeItemText: {
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.gray5,
        backgroundColor: Theme.colors.gray2,
        borderRadius: 50,
        padding: 16,
        paddingTop: Platform.OS === 'android' ? 8 : 10,
        paddingBottom: 8,
    },
})

type VideoData = NonNullable<NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['items']>

interface Params {
    navigation: StackNavigationProp<MainStackParamList>;
    route: RouteProp<TeachingStackParamList, 'AllSermonsScreen'>;
}

export default function AllSermonsScreen({ navigation, route }: Params): JSX.Element {

    const isSame = route.params?.startDate === route.params?.endDate

    const dateStart = route.params?.startDate ? moment(route.params?.startDate) : null;
    const dateEnd = route.params?.endDate ? moment(route.params?.endDate)?.endOf('month') : null;
    const [searchText, setSearchText] = useState("");
    const [sermons, setSermons] = useState<VideoData>([]);
    const [showCount, setShowCount] = useState(20);
    const [blurred, setBlurred] = useState(false);

    useEffect(() => {
        navigation.addListener('blur', () => {
            setBlurred(true);
        })
    }, [])

    async function loadSermonsAsync(nextToken?: string) {
        if (!blurred) {
            const query: GetVideoByVideoTypeQueryVariables = { limit: 50, nextToken: nextToken, videoTypes: 'adult-sunday', sortDirection: ModelSortDirection.DESC };
            try {
                const videos = await API.graphql(graphqlOperation(getVideoByVideoType, query)) as GraphQLResult<GetVideoByVideoTypeQuery>;
                if (videos.data?.getVideoByVideoType?.items)
                    setSermons(prevState => { return prevState.concat(videos.data?.getVideoByVideoType?.items ?? []) })
                if (videos.data?.getVideoByVideoType?.nextToken) {
                    loadSermonsAsync(videos.data?.getVideoByVideoType?.nextToken)
                }
            } catch (e) {
                console.debug(e)
            }
        }
    }

    useEffect(() => {
        loadSermonsAsync();
    }, [])

    let filteredSermons = sermons.filter(s => searchText ? (s?.episodeTitle ?? '').toLowerCase().includes(searchText.toLowerCase()) : true);

    let dateStartStr = "", dateEndStr = "";
    if (dateStart && dateEnd) {
        dateStartStr = dateStart.format("MMM" + ((dateStart.get('year') !== dateEnd.get('year')) ? ", YYYY" : ""));
        dateEndStr = dateEnd.format("MMM, YYYY");
        filteredSermons = filteredSermons.filter((s: any) => dateStart && dateEnd && moment(s.publishedDate).isBetween(dateStart, dateEnd));
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'All Teaching',
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
    }, [])


    return (
        <Container>
            <Content style={style.content}>
                <SearchBar
                    style={style.searchBar}
                    searchText={searchText}
                    handleTextChanged={(newStr) => setSearchText(newStr)}
                    placeholderLabel="Search by name..."></SearchBar>
                <View style={style.dateSelectBar}>

                    <TouchableHighlight style={{ borderRadius: 50, overflow: 'hidden', marginRight: 8 }} onPress={() => {
                        setShowCount(20);
                        navigation.push('DateRangeSelectScreen')
                    }} underlayColor={Theme.colors.grey3}  >
                        {(dateStart && dateEnd)
                            ? isSame
                                ? <Text style={style.dateRangeItemText}>{dateEndStr}</Text>
                                : <Text style={style.dateRangeItemText}>{dateStartStr} - {dateEndStr}</Text> : <Text style={style.dateRangeItemText}>Date range</Text>
                        }
                    </TouchableHighlight>
                </View>
                <View>
                    {sermons && sermons.length > 0 ?
                        filteredSermons.map((sermon: any, key: any) => {
                            if (key < showCount)
                                return (<TeachingListItem
                                    key={sermon.id}
                                    teaching={sermon}
                                    handlePress={() =>
                                        navigation.push('SermonLandingScreen', { item: sermon })
                                    } />)
                            else {
                                return null
                            }
                        }
                        )
                        : <ActivityIndicator />}
                    {filteredSermons?.length > 20 && showCount < filteredSermons.length ?

                        <View style={{ marginBottom: 20 }}>
                            <AllButton handlePress={() => setShowCount(showCount + 20)}>Load More</AllButton>
                        </View>
                        : null}

                </View>

            </Content>
        </Container>
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