import React, { useState, useEffect } from 'react';
import { Container, Header, Content, Text, Left, Button, Body, Right, Icon, View, Thumbnail, Item, Input, List, ListItem } from 'native-base';
import Theme, { Style } from '../Theme.style';
import { StatusBar, ViewStyle, TextStyle } from 'react-native';
import { TouchableOpacity } from 'react-native';
import LocationsService from '../services/LocationsService';
import { connect } from 'react-redux';
import { selectLocation } from '../reducers/locationReducer';

const style = {
    content: [Style.cardContainer, {
        backgroundColor: Theme.colors.black,
        padding: 16,
        paddingBottom: 150,
    }],
    header: [Style.header, {}],
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
    headerButtonText: [Style.header.linkText, {}],
    title: [Style.title, {
        marginTop: 130,
        marginBottom: 16,
    }],
    body: [Style.body, {
        marginBottom: 40,
    }],
    searchIcon: [Style.icon, {}],
    searchInput: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
    },
    listItem: {
        marginLeft: 0,
        borderColor: Theme.colors.gray3,
    },
    listText: {
        fontSize: Theme.fonts.medium,
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilySemiBold,
    },
    listCheckIcon: [Style.icon, {}],
}

type LocationSelectionScreenInput = {
    navigation: any;
    location: any;
    dispatch: any;
}


function LocationSelectionScreen({ navigation, location, dispatch }: LocationSelectionScreenInput) {

    const [locations, setLocations] = useState<any>([]);
    const [selectedLocation, setSelectedLocation] = useState(location);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const loadLocations = async () => {
            const locationsResult = await LocationsService.loadLocations();
            setLocations(locationsResult);
        }
        loadLocations();
    }, [])

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
                    <Text style={style.headerTitle}>Your Home Location</Text>
                </Body>
                <Right style={style.headerRight}>
                    <TouchableOpacity onPress={() => {
                        dispatch(selectLocation(selectedLocation));
                        navigation.goBack();
                    }}>
                        <Text style={style.headerButtonText}>Done</Text>
                    </TouchableOpacity>
                </Right>
            </Header>
            <Content style={style.content}>

                <View>
                    <Item>
                        <Thumbnail style={style.searchIcon} source={Theme.icons.white.search} square></Thumbnail>
                        <Input style={style.searchInput} value={searchText} onChangeText={(str) => setSearchText(str)} placeholder='Search locations...' />
                        {searchText ? (
                            <TouchableOpacity onPress={() => { setSearchText("") }}>
                                <Thumbnail style={style.searchIcon} source={Theme.icons.white.closeCancel} square></Thumbnail>
                            </TouchableOpacity>
                        ) : null
                        }
                    </Item>
                </View>

                <View>
                    <List>
                        {locations.map((location: any) => (
                            location.name.toLowerCase().includes(searchText.toLowerCase()) &&
                            <ListItem key={location.id} style={style.listItem} onPress={() => setSelectedLocation(location)}>
                                <Left>
                                    <Text style={style.listText}>{location.name}</Text>
                                </Left>
                                <Right>
                                    {selectedLocation.id === location.id &&
                                        <Thumbnail style={style.listCheckIcon} source={Theme.icons.white.check} square></Thumbnail>
                                    }
                                </Right>
                            </ListItem>
                        ))}
                    </List>
                </View>
            </Content>
        </Container>

    )
}

function mapStateToProps(state: { location: { location: any; }; }) {
    return {
        location: state.location.location
    }
}

export default connect(mapStateToProps)(LocationSelectionScreen);

