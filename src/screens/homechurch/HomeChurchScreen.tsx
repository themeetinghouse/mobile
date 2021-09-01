import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import API, { GraphQLResult } from '@aws-amplify/api';
import { ListF1ListGroup2sQuery } from 'src/services/API';
import { RouteProp } from '@react-navigation/native';
import { listF1ListGroup2s } from '../../services/queries';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import LocationContext from '../../contexts/LocationContext';
import HomeChurchItem from './HomeChurchItem';
import IconButton from '../../components/buttons/IconButton';
import HomeChurchControls from './HomeChurchControls';
import AllButton from '../../../src/components/buttons/AllButton';
import { getDayOfWeek } from './HomeChurchUtils';

export const locationToGroupType = (groupId: string) => {
  switch (groupId) {
    case '62948':
      return 'alliston';
    case '58224':
      return 'brampton';
    case '58225':
      return 'brantford';
    case '58248':
      return 'burlington';
    case '58249':
      return 'hamilton-downtown';
    case '58250':
      return 'hamilton-mountain';
    case '58251':
      return 'ancaster';
    case '58253':
      return 'kitchener';
    case '58254':
      return 'london';
    case '58069':
      return 'newmarket';
    case '58082':
      return 'oakville';
    case '58255':
      return 'ottawa';
    case '58252':
      return 'owen-sound';
    case '58256':
      return 'parry-sound';
    case '58081':
      return 'richmond-hill';
    case '62947':
      return 'sandbanks';
    case '58083':
      return 'toronto-downtown';
    case '58258':
      return 'toronto-east';
    case '58257':
      return 'toronto-high-park';
    case '58259':
      return 'toronto-uptown';
    case '57909':
      return 'waterloo';
    case '65432':
      return 'global';

    default:
      return 'Unknown';
  }
};

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
  route: RouteProp<MainStackParamList, 'HomeChurchScreen'>;
}

const style = StyleSheet.create({
  header: Style.header,
  headerTitle: HeaderStyle.title,
  resultsCount: {
    flex: 1,
    alignSelf: 'flex-end',
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: 16,
    color: Theme.colors.grey5,
    marginHorizontal: 16,
  },
});

export type HomeChurchData = NonNullable<
  NonNullable<NonNullable<ListF1ListGroup2sQuery>['listF1ListGroup2s']>['items']
>;
export type HomeChurch = HomeChurchData[0];

export default function HomeChurchScreen({
  navigation,
  route,
}: Params): JSX.Element {
  const locationData = useContext(LocationContext)?.locationData;
  const [showCount, setShowCount] = useState(10);
  const [location, setLocation] = useState(
    locationData?.locationId === 'unknown'
      ? {
          locationName: 'All Locations',
          locationId: 'all',
        }
      : locationData
  );
  const [isLoading, setIsLoading] = useState(true);
  const [day, setDay] = useState('All Days');
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
  const [filtered, setFiltered] = useState<HomeChurchData>([]);
  const filterHelper = (church: HomeChurchData[0]) => {
    if (
      church?.location?.address?.latitude === '' ||
      church?.location?.address?.longitude === ''
    )
      return false;
    if (day === 'All Days' && location?.locationId === 'all') return true;
    if (location?.locationId === 'all' && getDayOfWeek(church) === day)
      return true;
    if (
      location?.locationId ===
        locationToGroupType(church?.groupType?.id ?? '') &&
      day === 'All Days'
    )
      return true;
    if (
      location?.locationId ===
        locationToGroupType(church?.groupType?.id ?? '') &&
      getDayOfWeek(church) === day
    )
      return true;
    return false;
  };

  useEffect(() => {
    if (homeChurches?.length > 0) {
      setFiltered(homeChurches.filter((church) => filterHelper(church)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, location?.locationId, homeChurches]);

  useEffect(() => {
    const loadHomeChurches = async () => {
      try {
        const json = (await API.graphql({
          query: listF1ListGroup2s,
          variables: {
            limit: 200,
          },
        })) as GraphQLResult<ListF1ListGroup2sQuery>;
        setHomeChurches(json.data?.listF1ListGroup2s?.items ?? []);
      } catch (err) {
        // catch error here
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeChurches();
    if (route?.params?.loc) {
      setLocation(route.params.loc);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.loc]);

  return (
    <View>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 200,
            top: '50%',
            left: '45%',
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
      ) : null}
      <ScrollView>
        <View style={{ marginBottom: 10 }}>
          <HomeChurchControls
            isLoading={isLoading}
            setDay={setDay}
            navigation={navigation}
            setLoc={(a) => setLocation(a)}
            loc={location}
          />
          <View style={{ flexDirection: 'row', zIndex: -2 }}>
            <Text style={style.resultsCount}>{`${
              homeChurches.filter((a) => {
                return (
                  (location?.locationId === 'all' && getDayOfWeek(a) === day) ||
                  (location?.locationId === 'all' && day === 'All Days') ||
                  (locationToGroupType(a?.groupType?.id ?? '') ===
                    location?.locationId &&
                    getDayOfWeek(a) === day) ||
                  (locationToGroupType(a?.groupType?.id ?? '') ===
                    location?.locationId &&
                    day === 'All Days')
                );
              }).length
            } Results`}</Text>
            <IconButton
              disabled={
                homeChurches.filter((church) => filterHelper(church)).length < 1
              }
              labelStyle={{
                color: 'black',
                fontFamily: Theme.fonts.fontFamilyBold,
              }}
              icon={Theme.icons.black.map}
              label="Map"
              style={{
                alignSelf: 'flex-end',
                paddingLeft: 12,
                marginRight: 16,
                backgroundColor: '#fff',
              }}
              onPress={() =>
                navigation.navigate('HomeChurchMapScreen', { items: filtered })
              }
            />
          </View>
        </View>
        <View
          style={{
            zIndex: -1,
            minHeight: Dimensions.get('window').height / 2,
          }}
        >
          {homeChurches
            .filter((a, index) => {
              if (
                location?.locationId === 'all' &&
                day === 'All Days' &&
                index > showCount
              )
                return false;
              return (
                (location?.locationId === 'all' && getDayOfWeek(a) === day) ||
                (location?.locationId === 'all' && day === 'All Days') ||
                (locationToGroupType(a?.groupType?.id ?? '') ===
                  location?.locationId &&
                  getDayOfWeek(a) === day) ||
                (locationToGroupType(a?.groupType?.id ?? '') ===
                  location?.locationId &&
                  day === 'All Days')
              );
            })
            .map((a) => {
              return (
                <HomeChurchItem
                  homeChurches={filtered}
                  locationToGroupType={locationToGroupType}
                  key={a?.id}
                  item={a}
                />
              );
            })}
        </View>
        {location?.locationId === 'all' &&
        day === 'All Days' &&
        !isLoading &&
        showCount !== homeChurches.length ? (
          <AllButton
            handlePress={() => {
              if (showCount + 20 >= homeChurches.length)
                setShowCount(homeChurches.length);
              else setShowCount(showCount + 20);
            }}
          >
            Load More
          </AllButton>
        ) : null}
      </ScrollView>
    </View>
  );
}
