import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import moment from 'moment';
import API, { GraphQLResult } from '@aws-amplify/api';
import { ListF1ListGroup2sQuery } from 'src/services/API';
import { listF1ListGroup2s } from '../../services/queries';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import LocationContext from '../../contexts/LocationContext';

const style = StyleSheet.create({
  header: Style.header,
  headerTitle: HeaderStyle.title,
  resultsCount: {
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: 16,
    lineHeight: 18,
    color: Theme.colors.grey5,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  /* =========== HomeChurchCard Item=========== */
});

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
}
type HomeChurchData = NonNullable<
  NonNullable<NonNullable<ListF1ListGroup2sQuery>['listF1ListGroup2s']>['items']
>;
type HomeChurch = HomeChurchData[0];

export default function HomeChurchScreen({ navigation }: Params): JSX.Element {
  const location = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(true);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Home Church Finder',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
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
            <Thumbnail
              square
              source={Theme.icons.white.back}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return <View style={{ flex: 1 }} />;
      },
    });
  }, [navigation]);

  const [homeChurches, setHomeChurches] = useState<HomeChurchData>([]);
  useEffect(() => {
    /*
      TODO: Not all locations are showing. City names not matching?
    */
    const loadHomeChurches = async () => {
      try {
        const json = (await API.graphql({
          query: listF1ListGroup2s,
          variables: {
            limit: 500,
          },
        })) as GraphQLResult<ListF1ListGroup2sQuery>;
        setHomeChurches(
          json?.data?.listF1ListGroup2s?.items?.filter(
            (a) =>
              a?.location?.address?.city ===
                location?.locationData?.locationName ?? 'Oakville'
          ) ?? []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeChurches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  const getDayOfWeek = (item) => {
    if (item?.recurrences?.recurrence?.recurrenceWeekly)
      if (item.recurrences.recurrence.recurrenceWeekly.occurOnSunday)
        return 'Sunday';
      else if (item.recurrences.recurrence.recurrenceWeekly.occurOnMonday)
        return 'Monday';
      else if (item.recurrences.recurrence.recurrenceWeekly.occurOnTuesday)
        return 'Tuesday';
      else if (item.recurrences.recurrence.recurrenceWeekly.occurOnWednesday)
        return 'Wednesday';
      else if (item.recurrences.recurrence.recurrenceWeekly.occurOnThursday)
        return 'Thursday';
      else if (item.recurrences.recurrence.recurrenceWeekly.occurOnFriday)
        return 'Friday';
      else if (item.recurrences.recurrence.recurrenceWeekly.occurOnSaturday)
        return 'Saturday';
      else return moment(item.startDate).format('dddd');
    else return moment(item?.startDate).format('dddd');
  };
  const HomeChurchLocationSelect = ({ loc }): JSX.Element => {
    /*
      TODO: Add clear all
      TODO: Vertical alignment for location
    */
    const [selectedLocation, setSelectedLocation] = useState(
      loc.locationData.locationName
    );
    const [postalCode, setPostalCode] = useState('');
    const style = StyleSheet.create({
      locationIcon: { ...Style.icon, marginRight: 20, alignSelf: 'center' },
      container: {
        backgroundColor: '#111111',
        margin: 16,
      },
      containerItem: {
        flexDirection: 'row',
        fontFamily: Theme.fonts.fontFamilyRegular,
        paddingHorizontal: 20,
        color: 'white',
        height: 56,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#1A1A1A',
      },
      locationSelect: {
        alignSelf: 'center',
        flex: 1,
        fontFamily: Theme.fonts.fontFamilyRegular,
        color: '#fff',
        fontSize: 16,
      },
    });
    return (
      <View style={style.container}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.push('LocationSelectionScreen', { persist: true })
          }
          style={style.containerItem}
        >
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Thumbnail
              style={style.locationIcon}
              source={Theme.icons.white.location}
              square
            />
            <Text style={style.locationSelect}>{selectedLocation}</Text>
          </View>
        </TouchableWithoutFeedback>

        <TextInput
          accessibilityLabel="Add Postal Code"
          keyboardAppearance="dark"
          placeholder="Add postal code"
          placeholderTextColor="#646469"
          textContentType="none"
          keyboardType="default"
          multiline
          value={postalCode}
          onChange={(text) => {
            if (!text.nativeEvent.text.includes(' '))
              setPostalCode(text.nativeEvent.text);
          }}
          textAlignVertical="center"
          maxLength={6}
          autoCapitalize="characters"
          style={style.containerItem}
        />
      </View>
    );
  };
  const HomeChurchItem = ({ item }: HomeChurch): JSX.Element => {
    const style = StyleSheet.create({
      homeChurchCard: {
        borderColor: '#1A1A1A',
        borderWidth: 1,
        backgroundColor: Theme.colors.gray1,
        padding: 16,
      },
      hmName: {
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: 16,
        lineHeight: 24,
        color: 'white',
      },
      hmAddress: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontWeight: '400',
        color: Theme.colors.grey5,
      },
      hmDate: {
        marginVertical: 8,
        color: 'white',
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: 12,
        lineHeight: 18,
      },
      hmDescription: {
        color: Theme.colors.grey5,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: 12,
        lineHeight: 18,
      },
      badgesContainer: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      locationBadge: {
        backgroundColor: Theme.colors.grey3,
        borderRadius: 50,
        paddingHorizontal: 12,
        marginHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
      },
      locationBadgeText: {
        color: 'white',
        fontSize: 12,
        lineHeight: 18,

        fontFamily: Theme.fonts.fontFamilyRegular,
      },
    });
    return (
      <View style={style.homeChurchCard}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={style.hmName}>{item.name}</Text>
            <Text style={style.hmAddress}>
              {item.location.address.address1}
            </Text>
            <Text style={style.hmDate}>
              {getDayOfWeek(item)}s{'\n'}
              {moment(item.schedule?.startTime).format('h:mm a')}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                margin: 4,
                marginRight: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Thumbnail
                square
                source={Theme.icons.white.calendarAdd}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                margin: 4,
                marginRight: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Thumbnail
                square
                source={Theme.icons.white.contact}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={style.hmDescription}>{item.description}</Text>
        <View style={style.badgesContainer}>
          <View style={style.locationBadge}>
            <Text style={style.locationBadgeText}>
              {item.location.address.city}
            </Text>
          </View>
          {item.name.includes('Family Friendly') && (
            <View
              style={[
                style.locationBadge,
                {
                  paddingHorizontal: 12,
                  backgroundColor: 'rgb(160, 226, 186)',
                },
              ]}
            >
              <Thumbnail // is this getting cropped?
                source={Theme.icons.black.familyFriendly}
                style={{ width: 16, height: 16 }}
              />
            </View>
          )}
        </View>
      </View>
    );
  };
  return (
    <View>
      <FlatList
        data={homeChurches}
        renderItem={({ item }) => <HomeChurchItem item={item} />}
        keyExtractor={(item, index) => {
          return item?.id ?? index.toString();
        }}
        ListHeaderComponent={
          <View>
            <HomeChurchLocationSelect loc={location} />
            <Text
              style={style.resultsCount}
            >{`${homeChurches.length} Results`}</Text>
          </View>
        }
        ListFooterComponent={
          isLoading ? (
            <View
              style={{
                backgroundColor: Theme.colors.gray1,
                flex: 1,
                justifyContent: 'center',
                paddingVertical: 32,
                alignItems: 'center',
              }}
            >
              <ActivityIndicator
                size="large"
                color="white"
                animating
                style={{ height: 50, width: 50 }}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}
