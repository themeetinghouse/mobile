import React, { useState, useEffect } from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View, Body } from 'native-base';
import moment from 'moment';
import { StatusBar, ViewStyle } from 'react-native';
//import SearchBar from '../components/SearchBar';
import TeachingListItem from '../components/teaching/TeachingListItem';
import { connect } from 'react-redux';
import SermonsService from '../services/SermonsService';
import IconButton from '../components/buttons/IconButton';
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

    categoryTitle: [Style.categoryTitle, {
        marginTop: 16
    }],
    categorySection: {
        backgroundColor: Theme.colors.black,
        paddingTop: 16,
        marginBottom: 16,
    },
    listContentContainer: {
        paddingLeft: 16,
        paddingRight: 16,
    },

    sermonContainer: {
        padding: 16,
    },
    detailsContainer: {
        flexDirection: 'row',
    } as ViewStyle,
    detailsContainerItem: {
        flexBasis: 0,
        flexGrow: 1,
    },
    detailsTitle: {
        color: Theme.colors.gray4,
        fontSize: Theme.fonts.smallMedium,
        fontFamily: Theme.fonts.fontFamilyRegular,
        lineHeight: 18,
        marginBottom: 3,
        marginTop: 8,
    },
    detailsText: {
        color: Theme.colors.white,
        fontSize: Theme.fonts.smallMedium,
        fontFamily: Theme.fonts.fontFamilyRegular,
        lineHeight: 18,
    },
    detailsDescription: {
        marginTop: 14,
        marginBottom: 20,
    }
}

interface Params {
    navigation: any;
}

function SermonLandingScreen({ navigation }: Params) {

    const sermon = navigation.getParam("item");

    const [sermonsInSeries, setSermonsInSeries] = useState({ loading: true, items: [], nextToken: null });

    useEffect(() => {
        loadSomeAsync(() => SermonsService.loadSermonsInSeriesList(sermon.seriesTitle), sermonsInSeries, setSermonsInSeries);
    }, [])

    const loadAndNavigateToSeries = () => {
        navigation.navigate('SeriesLandingScreen', { seriesId: sermon.series.id });
    }

    return (
        <Container>

            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='close' />
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

                <View style={style.sermonContainer}>
                    <Text style={style.title}>{sermon.episodeTitle}</Text>
                    <View style={style.detailsContainer}>
                        <View style={style.detailsContainerItem}>
                            <Text style={style.detailsTitle}>Series</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={style.detailsText}>E{sermon.episodeNumber},</Text>
                                <IconButton onPress={() => loadAndNavigateToSeries()} style={{ paddingTop: 0, paddingBottom: 0, label: { marginLeft: 8, paddingTop: 0, fontSize: Theme.fonts.smallMedium } }} label={sermon.seriesTitle}></IconButton>
                            </View>
                        </View>
                        <View style={style.detailsContainerItem}>
                            <Text style={style.detailsTitle}>Date</Text>
                            <Text style={style.detailsText}>{moment(sermon.publishedDate).format("MMM D, YYYY")}</Text>
                        </View>
                    </View>
                    <View style={style.detailsDescription}>
                        <Text style={style.body}>{sermon.description}</Text>
                    </View>
                    <IconButton rightArrow icon={Theme.icons.white.notes} label="Notes"></IconButton>
                </View>

                <View style={style.categorySection}>
                    <Text style={style.categoryTitle}>More from this Series</Text>
                    <View style={style.listContentContainer}>
                        {sermonsInSeries.loading &&
                            <ActivityIndicator />
                        }
                        {sermonsInSeries.items.map((seriesSermon: any) => (
                            (seriesSermon.id !== sermon.id) ?
                                <TeachingListItem
                                    key={sermon.id}
                                    teaching={seriesSermon}
                                    handlePress={() =>
                                        navigation.push('SermonLandingScreen', { item: seriesSermon })
                                    } />
                                : null
                        ))}
                    </View>
                </View>

            </Content>
        </Container>
    )
}

function mapStateToProps(state: any) {
    return {
    }
}

export default connect(mapStateToProps)(SermonLandingScreen);
