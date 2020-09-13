import React, { useState, useEffect, useContext } from 'react';
import { Container, Header, Content, Text, Left, Body, Right, View, Thumbnail, Item, Input, List, ListItem } from 'native-base';
import Theme, { Style, HeaderStyle } from '../Theme.style';
import { StatusBar, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import LocationsService from '../services/LocationsService';
import LocationContext, { LocationData } from '../contexts/LocationContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { Auth } from '@aws-amplify/auth';
import UserContext from '../contexts/UserContext';
import * as SecureStore from 'expo-secure-store';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from 'navigation/AppNavigator';

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.black,
            padding: 16,
            paddingBottom: 150,
        }
    },
    header: Style.header,
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 70
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
    headerTitle: {
        ...HeaderStyle.title, ...{
            width: "100%",
        }
    },
    headerButtonText: HeaderStyle.linkText,
    title: {
        ...Style.title, ...{
            marginTop: 130,
            marginBottom: 16,
        }
    },
    body: {
        ...Style.body, ...{
            marginBottom: 40,
        }
    },
    searchIcon: Style.icon,
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
    listCheckIcon: Style.icon,
})

type LocationSelectionScreenInput = {
    navigation: StackNavigationProp<MainStackParamList>;
    route: RouteProp<MainStackParamList, 'LocationSelectionScreen'>;
}


export default function LocationSelectionScreen({ navigation, route }: LocationSelectionScreenInput): JSX.Element {

    const location = useContext(LocationContext);
    const userContext = useContext(UserContext);

    const [locations, setLocations] = useState<LocationData[]>([]);
    const [selectedLocation, setSelectedLocation] = useState(location?.locationData);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const loadLocations = () => {
            const locationsResult = LocationsService.loadLocationDataForContext();
            setLocations(locationsResult.sort((a, b) => (a?.locationName as string).localeCompare(b?.locationName as string)));
        }
        loadLocations();
    }, []);

    async function updateUser(locationId: string | undefined) {
        if (locationId && userContext?.userData?.email_verified) {
            try {
                const user = await Auth.currentAuthenticatedUser();
                userContext.setUserData({ ...user.attributes, 'custom:home_location': locationId });
                const update = await Auth.updateUserAttributes(user, { ...user.attributes, 'custom:home_location': locationId });
                console.log(update);
            } catch (e) {
                console.error(e)
            }
        } else if (locationId) {
            try {
                const updateLocalStore = await SecureStore.setItemAsync('location', locationId);
                console.log(updateLocalStore)
            } catch (e) {
                console.error(e)
            }
        } else {
            console.debug('locationId is undefined');
        }
    }

    return (
        <Container style={{ backgroundColor: 'black' }} >
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={style.headerButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </Left>
                <Body style={style.headerBody}>
                    <Text style={style.headerTitle}>Location</Text>
                </Body>
                <Right style={style.headerRight}>
                    <TouchableOpacity onPress={() => {
                        location?.setLocationData(selectedLocation);
                        if (route.params.persist)
                            updateUser(selectedLocation?.locationId);
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
                <View style={{ paddingVertical: 24 }}>
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
