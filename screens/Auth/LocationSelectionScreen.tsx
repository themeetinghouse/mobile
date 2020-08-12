import React, { useState, useEffect } from 'react';
import { Container, Header, Content, Text, Left, Body, Right, View, Thumbnail, Item, Input, List, ListItem } from 'native-base';
import Theme, { Style } from '../../Theme.style';
import { StatusBar, ViewStyle, TextStyle } from 'react-native';
import { TouchableOpacity } from 'react-native';
import LocationsService from '../../services/LocationsService';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { LocationData } from '../../contexts/LocationContext';

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
        flexBasis: 70
    },
    headerBody: {
        flexGrow: 3,
        justifyContent: "center",
    } as ViewStyle,
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 70
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
        color: Theme.colors.grey3,
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.medium,
        marginLeft: 20
    },
    searchInputActive: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.medium,
        marginLeft: 20
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
    navigation: StackNavigationProp<AuthStackParamList>;
}

export default function LocationSelectionScreen({ navigation }: LocationSelectionScreenInput): JSX.Element {

    const [locations, setLocations] = useState<LocationData[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<LocationData>();
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const loadLocations = () => {
            const locationsResult = LocationsService.loadLocationDataForContext();
            console.log(locationsResult)
            setLocations(locationsResult.sort((a, b) => (a?.locationName as string).localeCompare(b?.locationName as string)));
        }
        loadLocations();
    }, []);

    return (
        <Container>
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={style.headerButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </Left>
                <Body style={style.headerBody}>
                    <Text style={style.headerTitle}>Your Home Location</Text>
                </Body>
                <Right style={style.headerRight}>
                    <TouchableOpacity onPress={() => {
                        if (selectedLocation?.locationId)
                            navigation.navigate('SignUpScreen', { locationId: selectedLocation.locationId, locationName: selectedLocation.locationName });
                        else
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
                        <Input style={searchText ? style.searchInputActive : style.searchInput} value={searchText} onChangeText={(str) => setSearchText(str)} placeholder='Search locations...' />
                        {searchText ? (
                            <TouchableOpacity onPress={() => { setSearchText("") }}>
                                <Thumbnail style={style.searchIcon} source={Theme.icons.white.closeCancel} square></Thumbnail>
                            </TouchableOpacity>
                        ) : null
                        }
                    </Item>
                </View>
                <View style={{ marginTop: 24 }}>
                    <List>
                        {locations.map(location => (
                            location?.locationName.toLowerCase().includes(searchText.toLowerCase()) &&
                            <ListItem key={location.locationId} style={style.listItem} onPress={() => setSelectedLocation(location)}>
                                <Left>
                                    <Text style={style.listText}>{location.locationName}</Text>
                                </Left>
                                <Right>
                                    {selectedLocation?.locationId === location.locationId &&
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
