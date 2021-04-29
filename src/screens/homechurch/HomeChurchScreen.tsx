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
import API, { GraphQLResult } from '@aws-amplify/api';
import { ListF1ListGroup2sQuery } from 'src/services/API';
import { listF1ListGroup2s } from '../../services/queries';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import LocationContext from '../../contexts/LocationContext';
import HomeChurchItem, { getDayOfWeek } from './HomeChurchItem';
import IconButton from '../../components/buttons/IconButton';
import HomeChurchControls from './HomeChurchControls';

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
  loc: any;
  route: any;
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
  loc,
}: Params): JSX.Element {
  const [location, setLocation] = useState(
    useContext(LocationContext)?.locationData
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

  const locationToGroupType = (groupId: string) => {
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
      default:
        return 'Unknown';
    }
  };

  useEffect(() => {
    const loadHomeChurches = async () => {
      try {
        const json = (await API.graphql({
          query: listF1ListGroup2s,
          variables: {
            limit: 200,
          },
        })) as GraphQLResult<ListF1ListGroup2sQuery>;
        // setHomeChurches(json.data?.listF1ListGroup2s?.items ?? []);
        setHomeChurches(json.data?.listF1ListGroup2s?.items ?? []);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeChurches();
    if (route?.params?.loc) {
      setLocation(route.params.loc);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, route?.params?.loc]);

  return (
    <View>
      {isLoading ? (
        <View
          style={{
            // TODO: fix this centering
            flex: 1,
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 200,
            top: '100%',
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
      <View style={{ marginBottom: 10 }}>
        <HomeChurchControls
          setDay={setDay}
          navigation={navigation}
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
            labelStyle={{
              color: 'black',
              fontFamily: Theme.fonts.fontFamilyBold,
            }}
            icon={Theme.icons.black.map}
            label="Map"
            style={{
              alignSelf: 'flex-end',
              paddingLeft: 12,
              height: 50,
              marginRight: 16,
              width: 100,
              backgroundColor: '#fff',
            }}
            onPress={() =>
              navigation.navigate('HomeChurchMapScreen', {
                items: homeChurches.filter(
                  (church) =>
                    church?.location?.address?.latitude &&
                    church.location.address.longitude
                ),
              })
            }
          />
        </View>
      </View>
      <FlatList
        style={{ zIndex: -1 }}
        data={homeChurches.filter((a) => {
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
        })}
        renderItem={({ item }) => <HomeChurchItem item={item} />}
        keyExtractor={(item, index) => {
          return item?.id ?? index.toString();
        }}
      />
    </View>
  );
}
