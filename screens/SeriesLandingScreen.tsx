import React, { useState, useEffect } from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View, Body, Thumbnail } from 'native-base';
import moment from 'moment';
import { Dimensions, StatusBar, ViewStyle } from 'react-native';
import TeachingListItem from '../components/teaching/TeachingListItem';
import SermonsService from '../services/SermonsService';
import SeriesService from '../services/SeriesService';
import { loadSomeAsync } from '../utils/loading';
import ActivityIndicator from '../components/ActivityIndicator';

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
    }],
    body: [Style.body, {
    }],

    seriesImage: {
        aspectRatio: 1061 / 848,
        width: 0,
        height: 0,
    },
    detailsContainer: {
        padding: 16,
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
    descriptionText: [Style.body, {
        marginTop: 24,

    }],

    listContentContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 16,
        marginBottom: 16,
    },

    seriesContainer: {}
}

interface Params {
    navigation: any;
}

function SeriesLandingScreen({ navigation }: Params): JSX.Element {

    const seriesParam = navigation.getParam("item");
    const seriesId = navigation.getParam("seriesId");

    const [series, setSeries] = useState(seriesParam);
    const [sermonsInSeries, setSermonsInSeries] = useState({ loading: true, items: [], nextToken: null });

    console.log("SeriesLandingScreen(): series = ", series);

    const width = Dimensions.get('window').width;
    style.seriesImage.width = width;
    style.seriesImage.height = width * (1 / style.seriesImage.aspectRatio);

    useEffect(() => {
        const loadSermonsInSeriesAsync = async () => {
            let loadedSeries = series;
            if (!loadedSeries) {
                loadedSeries = await SeriesService.loadSeriesById(seriesId);
                setSeries(loadedSeries);
            }

            loadSomeAsync(() => SermonsService.loadSermonsInSeriesList(loadedSeries.title), sermonsInSeries, setSermonsInSeries)
        }
        loadSermonsInSeriesAsync();
    }, [])

    console.log(series)

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
                </Body>
                <Right style={style.headerRight}>
                    <Button transparent>
                        <Icon name='share' />
                    </Button>
                </Right>
            </Header>

            <Content style={style.content}>

                {series &&
                    <View>
                        <View style={style.seriesContainer}>

                            <Thumbnail style={style.seriesImage} square source={{ uri: series.heroImage }} />
                            <View style={style.detailsContainer}>
                                <Text style={style.detailsTitle}>{series.title}</Text>
                                <View>
                                    <Text style={style.detailsText}>{moment(series.startDate).year()} &bull; {series.videos.items.length} {series.videos.items.length == 1 ? 'episode' : 'episodes'}</Text>
                                </View>
                                {series.description &&
                                    <View>
                                        <Text style={style.descriptionText}>{series.description}</Text>
                                    </View>
                                }
                            </View>
                        </View>

                        <View style={style.listContentContainer}>
                            {sermonsInSeries.loading &&
                                <ActivityIndicator />
                            }
                            {sermonsInSeries.items.map((seriesSermon: any) => (
                                <TeachingListItem
                                    key={seriesSermon.id}
                                    teaching={seriesSermon}
                                    handlePress={() =>
                                        navigation.push('SermonLandingScreen', { item: seriesSermon })
                                    } />
                            ))}
                        </View>
                    </View>
                }
            </Content>
        </Container>
    )
}


export default SeriesLandingScreen;
