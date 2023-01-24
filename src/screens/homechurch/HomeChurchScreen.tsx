import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import { ListF1ListGroup2sQuery } from '../../services/API';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import LocationContext, { LocationData } from '../../contexts/LocationContext';
import HomeChurchItem from './HomeChurchItem';
import IconButton from '../../components/buttons/IconButton';
import HomeChurchControls from './HomeChurchControls';
import AllButton from '../../../src/components/buttons/AllButton';
import useHomeChurches from '../../hooks/useHomeChurches';

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
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 200,
    top: '50%',
    left: '45%',
    paddingVertical: 32,
    alignItems: 'center',
  },
  spinner: {
    width: 50,
    height: 50,
  },
  mapButton: {
    alignSelf: 'flex-end',
    width: 123,
    padding: 16,
    paddingHorizontal: 24,
    textAlign: 'center',
    marginRight: 16,
    backgroundColor: '#fff',
  },
});

export type HomeChurchData = NonNullable<
  NonNullable<NonNullable<ListF1ListGroup2sQuery>['listF1ListGroup2s']>['items']
>;
export type HomeChurch = HomeChurchData[0];
const defaultLocationData = {
  name: 'All Locations',
  id: 'all',
} as LocationData;
export default function HomeChurchScreen({
  navigation,
  route,
}: Params): JSX.Element {
  const locationData = useContext(LocationContext)?.locationData;
  const initialLocationData = useMemo(
    () =>
      locationData?.id === 'unknown' ||
      locationData?.id === 'all' ||
      !locationData
        ? defaultLocationData
        : locationData,
    [locationData]
  );
  const [showCount, setShowCount] = useState(10);
  const [location, setLocation] = useState<LocationData>(initialLocationData);
  const [day, setDay] = useState('All Days');
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Home Church Finder',
      headerTitleStyle: style.headerTitle,
      headerStyle: {
        backgroundColor: Theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.gray2,
        shadowOpacity: 0,
      },
      // eslint-disable-next-line react/no-unstable-nested-components
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
              accessibilityLabel="back icon"
              source={Theme.icons.white.back}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: function render() {
        return <View style={{ flex: 1 }} />;
      },
    });
  }, [navigation]);
  const {
    homeChurchesWithLocation,
    homeChurchIsLoading,
    filteredHomeChurches,
  } = useHomeChurches(day, location);

  useEffect(() => {
    if (route?.params?.location) {
      setLocation(route.params.location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.location]);
  return (
    <View>
      {homeChurchIsLoading ? (
        <View style={style.spinnerContainer}>
          <ActivityIndicator
            size="large"
            color="white"
            animating
            style={style.spinner}
          />
        </View>
      ) : null}
      <ScrollView>
        <View style={{ marginBottom: 10 }}>
          <HomeChurchControls
            isLoading={homeChurchIsLoading}
            setDay={setDay}
            navigation={navigation}
            setLoc={(a) => setLocation(a)}
            loc={location}
          />
          <View style={{ flexDirection: 'row', zIndex: -2 }}>
            <Text style={style.resultsCount}>
              {!homeChurchIsLoading
                ? `${filteredHomeChurches.length} Results`
                : ''}
            </Text>
            <IconButton
              disabled={homeChurchesWithLocation.length < 1}
              labelStyle={{
                color: 'black',
                fontFamily: Theme.fonts.fontFamilyBold,
                textAlign: 'center',
              }}
              icon={Theme.icons.black.map}
              label="Map"
              style={style.mapButton}
              onPress={() => {
                navigation.navigate('HomeChurchMapScreen', {
                  items: homeChurchesWithLocation,
                });
              }}
            />
          </View>
        </View>
        <View
          style={{
            zIndex: -1,
            minHeight: Dimensions.get('window').height / 2,
          }}
        >
          {filteredHomeChurches.slice(0, showCount).map((homeChurch) => {
            return (
              <HomeChurchItem
                homeChurches={homeChurchesWithLocation}
                key={homeChurch?.id}
                item={homeChurch}
              />
            );
          })}
        </View>
        {filteredHomeChurches.length > showCount && !homeChurchIsLoading ? (
          <AllButton
            onPress={() => {
              if (showCount + 20 >= filteredHomeChurches.length)
                setShowCount(filteredHomeChurches.length);
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
