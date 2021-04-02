import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import moment from 'moment';
import API from '@aws-amplify/api';
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
  homeChurchCard: {
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
    paddingVertical: 4,
  },
  locationBadgeText: {
    color: 'white',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Theme.fonts.fontFamilyRegular,
  },
});

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
}

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

  const [homeChurches, setHomeChurches] = useState([]);
  useEffect(() => {
    const loadHomeChurches = async () => {
      try {
        const json = (await API.graphql({
          query: listF1ListGroup2s,
          variables: {
            limit: 300,
          },
        })) as any;
        setHomeChurches(
          json.data.listF1ListGroup2s.items.filter(
            (a) =>
              a.location.address.city ===
                location?.locationData?.locationName ?? 'Oakville'
          )
        );
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeChurches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  const HomeChurchItem = ({ item }: any): JSX.Element => {
    return (
      <View style={style.homeChurchCard}>
        <Text style={style.hmName}>{item.name}</Text>
        <Text style={style.hmAddress}>{item.location.address.address1}</Text>
        <Text style={style.hmDate}>
          {getDayOfWeek(item)}s{'\n'}
          {moment(item.schedule?.startTime).format('h:mm a')}
        </Text>

        <Text style={style.hmDescription}>{item.description}</Text>
        <View style={style.badgesContainer}>
          <View style={style.locationBadge}>
            <Text style={style.locationBadgeText}>
              {item.location.address.city}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View>
      <FlatList
        data={homeChurches}
        renderItem={({ item }) => <HomeChurchItem item={item} />}
        keyExtractor={(item) => {
          return item.id;
        }}
        ListHeaderComponent={
          <View>
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
