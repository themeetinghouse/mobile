import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  Container,
  Content,
  Text,
  Left,
  Right,
  View,
  Thumbnail,
  Item,
  Input,
  List,
  ListItem,
} from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { LocationData } from '../../contexts/LocationContext';
import LocationsService from '../../services/LocationsService';
import Theme, { Style, HeaderStyle } from '../../Theme.style';
import { MainStackParamList } from '../../navigation/AppNavigator';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: Theme.colors.black,
      padding: 16,
      paddingBottom: 150,
    },
  },
  header: Style.header,
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 70,
  },
  headerBody: {
    flexGrow: 3,
    justifyContent: 'center',
  },
  headerRight: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 70,
  },
  headerTitle: {
    ...HeaderStyle.title,
    ...{
      width: '100%',
    },
  },
  headerButtonText: HeaderStyle.linkText,
  title: {
    ...Style.title,
    ...{
      marginTop: 130,
      marginBottom: 16,
    },
  },
  body: {
    ...Style.body,
    ...{
      marginBottom: 40,
    },
  },
  searchIcon: Style.icon,
  searchInput: {
    color: Theme.colors.grey3,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    marginLeft: 20,
  },
  searchInputActive: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    marginLeft: 20,
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
});

type Params = {
  navigation: StackNavigationProp<MainStackParamList>;
};

export default function HomeChurchLocationSelect({
  navigation,
}: Params): JSX.Element {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState({
    locationName: '',
    locationId: '',
  });
  const [searchText, setSearchText] = useState('');
  // eslint-disable-next-line camelcase

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Site Location',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={style.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('HomeChurchScreen', { loc: selectedLocation })
            }
          >
            <Text style={style.headerButtonText}>Done</Text>
          </TouchableOpacity>
        );
      },
      headerRightContainerStyle: { right: 16 },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);
  useEffect(() => {
    const loadLocations = () => {
      const locationsResult = LocationsService.loadLocationDataForContext();
      setLocations([
        { locationName: 'All Locations', locationId: 'all' },
        { locationName: 'Global', locationId: 'global' },
        ...locationsResult.sort((a, b) =>
          (a?.locationName as string).localeCompare(b?.locationName as string)
        ),
      ]);
    };
    loadLocations();
    async function getLocation() {
      const location = await SecureStore.getItemAsync('location');
      setSelectedLocation({ ...selectedLocation, locationId: location ?? '' });
    }
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container style={{ backgroundColor: 'black' }}>
      <Content style={style.content}>
        <View>
          <Item>
            <Thumbnail
              style={style.searchIcon}
              source={Theme.icons.white.search}
              square
            />
            <Input
              style={searchText ? style.searchInputActive : style.searchInput}
              value={searchText}
              onChangeText={(str) => setSearchText(str)}
              placeholder="Search locations..."
            />
            {searchText ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
                }}
              >
                <Thumbnail
                  style={style.searchIcon}
                  source={Theme.icons.white.closeCancel}
                  square
                />
              </TouchableOpacity>
            ) : null}
          </Item>
        </View>
        <View style={{ paddingVertical: 24 }}>
          <List>
            {locations.map(
              (item) =>
                item?.locationName
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) && (
                  <ListItem
                    key={item.locationId}
                    style={style.listItem}
                    onPress={() => setSelectedLocation(item)}
                  >
                    <Left>
                      <Text style={style.listText}>{item.locationName}</Text>
                    </Left>
                    <Right>
                      {selectedLocation?.locationId === item.locationId && (
                        <Thumbnail
                          style={style.listCheckIcon}
                          source={Theme.icons.white.check}
                          square
                        />
                      )}
                    </Right>
                  </ListItem>
                )
            )}
          </List>
        </View>
      </Content>
    </Container>
  );
}
