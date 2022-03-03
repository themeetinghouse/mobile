import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';

import { MainStackParamList } from 'src/navigation/AppNavigator';
import StaffItem from '../../components/staff/StaffItem';
import StaffDirectoryService from '../../services/StaffDirectoryService';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import SearchBar from '../../components/SearchBar';
import LocationContext from '../../contexts/LocationContext';
import ActivityIndicator from '../../components/ActivityIndicator';

const style = StyleSheet.create({
  content: {
    backgroundColor: Theme.colors.black,
    padding: 16,
  },
  header: Style.header,
  headerTitle: HeaderStyle.title,
  searchBar: {
    marginBottom: 16,
  },
});

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
}

export default function ParishTeam({ navigation }: Params): JSX.Element {
  const location = useContext(LocationContext);
  const [staffByLocation, setStaffByLocation] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'My Parish Team',
      headerTitleStyle: style.headerTitle,
      headerStyle: {
        backgroundColor: Theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.gray2,
        shadowOpacity: 0,
      },
      headerLeft: function render() {
        return (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingRight: 12,
              paddingBottom: 12,
              paddingTop: 12,
            }}
          >
            <Image
              source={Theme.icons.white.back}
              style={{ width: 24, height: 24 }}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                transform: [{ translateX: -4 }],
              }}
            >
              More
            </Text>
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return <View style={{ flex: 1 }} />;
      },
    });
  }, [navigation]);

  useEffect(() => {
    const loadStaff = async () => {
      setIsLoading(true);
      const staffByLocationResults =
        await StaffDirectoryService.loadStaffListByLocation(location as any);
      setStaffByLocation(staffByLocationResults);
      setIsLoading(false);
    };
    loadStaff();

    return () => {
      console.log('Cleanup');
    };
  }, [location]);

  return (
    <>
      {isLoading ? (
        <View
          style={{
            zIndex: 100,
            position: 'absolute',
            left: 50,
            right: 50,
            bottom: '50%',
          }}
        >
          <ActivityIndicator animating={isLoading} />
        </View>
      ) : null}
      <SectionList
        stickySectionHeadersEnabled={false}
        sections={staffByLocation}
        ListHeaderComponent={
          <View style={style.content}>
            <SearchBar
              style={style.searchBar}
              searchText={searchText}
              handleTextChanged={(newStr) => setSearchText(newStr)}
              placeholderLabel="Search by name"
            />
          </View>
        }
        renderSectionHeader={({ section: { title, data } }) => {
          if (
            data.filter(
              (a) =>
                a.LastName.toLowerCase().includes(searchText.toLowerCase()) ||
                a.FirstName.toLowerCase().includes(searchText.toLowerCase())
            ).length > 0
          ) {
            return (
              <>
                <Text
                  style={{
                    left: 16,
                    marginBottom: 4,
                    color: '#646469',
                    fontSize: 14,
                    lineHeight: 18,
                    fontFamily: Theme.fonts.fontFamilyBold,
                  }}
                >
                  Your Home Parish
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      left: 16,
                      color: 'white',
                      fontSize: 24,
                      lineHeight: 32,
                      fontFamily: Theme.fonts.fontFamilyBold,
                    }}
                  >
                    {title}
                  </Text>
                </View>
              </>
            );
          }
          return null; // no results message here
        }}
        renderSectionFooter={({ section: { data } }) => {
          if (data.length === 0) return null;
          return <View style={{ marginBottom: 15 }} />;
        }}
        renderItem={({ item }) => {
          if (
            item.FirstName.toLowerCase().includes(searchText.toLowerCase()) ||
            item.LastName.toLowerCase().includes(searchText.toLowerCase())
          )
            return <StaffItem staff={item} />;

          return null;
        }}
        keyExtractor={(item: any) => item.FirstName + item.LastName}
        progressViewOffset={300}
      />
    </>
  );
}
