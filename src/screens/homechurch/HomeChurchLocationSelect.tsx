import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LocationData } from '../../contexts/LocationContext';
import LocationsService from '../../services/LocationsService';
import Theme, { Style, HeaderStyle } from '../../Theme.style';
import { MainStackParamList } from '../../navigation/AppNavigator';

const style = StyleSheet.create({
  content: {
    backgroundColor: Theme.colors.black,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingBottom: 150,
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
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.gray2,
    paddingTop: 16,
  },
  listText: {
    flex: 1,
    borderColor: '#1A1A1A',
    borderBottomWidth: 1,
    paddingBottom: 16,
    fontSize: Theme.fonts.medium,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilySemiBold,
  },
  listCheckIcon: {
    ...Style.icon,
    position: 'absolute',
    right: 20,
    alignSelf: 'center',
  },
});

type Params = {
  navigation: StackNavigationProp<MainStackParamList>;
  route?: RouteProp<MainStackParamList, 'HomeChurchLocationSelect'>;
};

export default function HomeChurchLocationSelect({
  navigation,
  route,
}: Params): JSX.Element {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState({
    locationName: route?.params?.location?.locationName ?? '',
    locationId: route?.params?.location?.locationId ?? '',
  });
  const [searchText, setSearchText] = useState('');
  // eslint-disable-next-line camelcase

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Site Location',
      headerTitleAlign: 'center',
      headerTitleStyle: style.headerTitle,
      headerStyle: {
        backgroundColor: Theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.gray2,
        shadowOpacity: 0,
      },
      headerLeft: function render() {
        return (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={style.headerButtonText}>Cancel</Text>
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ScrollView style={style.content}>
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: '#54565A',
          borderBottomWidth: 1,
          paddingBottom: 16,
          marginRight: 16,
        }}
      >
        <Image style={style.searchIcon} source={Theme.icons.white.search} />
        <TextInput
          style={searchText ? style.searchInputActive : style.searchInput}
          value={searchText}
          onChangeText={(str) => setSearchText(str)}
          placeholder="Search locations..."
          placeholderTextColor="#54565A"
        />
        {searchText ? (
          <TouchableOpacity
            onPress={() => {
              setSearchText('');
            }}
          >
            <Image
              style={style.searchIcon}
              source={Theme.icons.white.closeCancel}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={{ paddingVertical: 24 }}>
        {locations.map((item) => {
          return (
            item?.locationName
              .toLowerCase()
              .includes(searchText.toLowerCase()) && (
              <TouchableOpacity
                key={item.locationId}
                onPress={async () => {
                  await setSelectedLocation(item);
                  navigation.navigate('HomeChurchScreen', {
                    loc: item,
                  });
                }}
                style={style.listItem}
              >
                <Text style={style.listText}>{item.locationName}</Text>
                {selectedLocation?.locationId === item.locationId && (
                  <Image
                    style={style.listCheckIcon}
                    source={Theme.icons.white.check}
                    accessibilityLabel="check icon"
                  />
                )}
              </TouchableOpacity>
            )
          );
        })}
      </View>
    </ScrollView>
  );
}
