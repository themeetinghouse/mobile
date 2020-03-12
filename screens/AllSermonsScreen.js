import React, { useState, useEffect } from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View, Body, Title, Input, Thumbnail, Row } from 'native-base';
import moment from 'moment';
import { StatusBar, TouchableOpacity, Image, FlatList } from 'react-native';
import SearchBar from '../components/SearchBar';
import TeachingListItem from '../components/teaching/TeachingListItem';
import { connect } from 'react-redux';
import SermonsService from '../services/SermonsService';
import { loadSomeAsync } from '../utils/loading';
import ActivityIndicator from '../components/ActivityIndicator';

const style = {
    content: [ Style.cardContainer, {
        backgroundColor: Theme.colors.black,
        padding: 16
    }],
    header: [ Style.header, {
    }],
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
    headerTitle: [Style.header.title, {
        width: "100%",
    }],
    title: [Style.title, {
    }],
    body: [Style.body, {
    }],

    searchBar: {
        marginBottom: 16,
    },
    
    dateSelectBar: {
        marginBottom: 32,
        alignItems: "flex-start",
    },
    dateRangeItem: {
        padding: 20,
        paddingTop: 8,
        paddingBottom: 12,
        marginRight: 8,
        borderRadius: 100,
        backgroundColor: Theme.colors.gray2,
    },
    dateRangeItemText: {
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.gray5,
    },

    sermonListContainer: {

    },
}

function AllSermonsScreen({ navigation, dateStart, dateEnd }){

    const [searchText, setSearchText] = useState("");
    const [sermons, setSermons] = useState({loading: true, items: [], nextToken: null});
    
    const loadSermonsAsync = async () => {
        loadSomeAsync(SermonsService.loadSermonsList, sermons, setSermons, 30);
    }

    useEffect(() => {
        loadSermonsAsync();
    }, [])

    let filteredSermons = sermons.items.filter(s => searchText ? (s.episodeTitle).toLowerCase().includes(searchText.toLowerCase()): true);
    
    let dateStartStr = "", dateEndStr = "";
    if (dateStart && dateEnd) {
        dateStartStr = dateStart.format("MMM" + ((dateStart.get('year') !== dateEnd.get('year')) ? ", YYYY" : ""));
        dateEndStr = dateEnd.format("MMM, YYYY");
        filteredSermons = filteredSermons.filter(s => dateStart && dateEnd && moment(s.publishedDate).isBetween(dateStart, dateEnd));
    }
    return (
    <Container>

        <Header style={style.header}>
            <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
            <Left style={style.headerLeft}>
                <Button transparent onPress={ () => navigation.goBack() }>
                    <Icon name='arrow-back' />
                </Button>
            </Left>
            <Body style={style.headerBody}>
                <Text style={style.headerTitle}>All Sermons</Text>
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
                <TouchableOpacity style={style.dateRangeItem} onPress={() => { navigation.push('DateRangeSelectScreen') }}>
                    { (dateStart && dateEnd)
                        ? <Text style={style.dateRangeItemText}>{dateStartStr} - {dateEndStr}</Text>
                        : <Text style={style.dateRangeItemText}>Date range</Text>
                    }
                </TouchableOpacity>
            </View>

            <View style={style.sermonListContainer}>
                { sermons.loading
                    && <ActivityIndicator/>
                }
                { filteredSermons.map(sermon => (
                    <TeachingListItem 
                        key={sermon.id} 
                        teaching={sermon} 
                        handlePress={() => 
                            navigation.push('SermonLandingScreen', {item: sermon})
                        }>
                    </TeachingListItem>
                ))}
            </View>
        </Content>
    </Container>
    )
}

function mapStateToProps(state){
    return {
        dateStart: state.viewNav.sermonSearchDateStart,
        dateEnd: state.viewNav.sermonSearchDateEnd,
    }
}

export default connect(mapStateToProps)(AllSermonsScreen);
