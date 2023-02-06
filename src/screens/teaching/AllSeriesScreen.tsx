import React, { useState, useEffect, useLayoutEffect } from 'react';
import moment from 'moment';
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  ScrollView,
  View,
  Text,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { RouteProp } from '@react-navigation/native';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import SearchBar from '../../components/SearchBar';
import SeriesService from '../../services/SeriesService';
import ActivityIndicator from '../../components/ActivityIndicator';
import { TeachingStackParamList } from '../../navigation/MainTabNavigator';
import AllButton from '../../components/buttons/AllButton';
import SeriesItem from '../../components/teaching/SeriesItem';

const style = StyleSheet.create({
  content: {
    backgroundColor: Theme.colors.black,
    padding: 16,
  },
  header: Style.header,
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 70,
    left: 12,
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
  headerTitle: HeaderStyle.title,
  title: Style.title,
  body: Style.body,
  horizontalListContentContainer: {},
  lastHorizontalListItem: {
    marginRight: 16,
  },
  searchBar: {
    marginBottom: 16,
    height: 48,
  },
  dateSelectBar: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  dateSelectYear: {
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.smallMedium,
    color: Theme.colors.white,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 8 : 10,
    paddingBottom: 8,
    backgroundColor: Theme.colors.gray2,
  },
  dateSelectYearSelected: {
    backgroundColor: Theme.colors.white,
    color: Theme.colors.black,
  },
  seriesListContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

interface Params {
  navigation: StackNavigationProp<TeachingStackParamList, 'AllSeriesScreen'>;
  route: RouteProp<TeachingStackParamList, 'AllSeriesScreen'>;
}

export default function AllSeriesScreen({
  navigation,
  route,
}: Params): JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [seriesYears, setSeriesYears] = useState(['All']);
  const [showCount, setShowCount] = useState(20);
  const [allSeries, setAllSeries] = useState<{
    loading: boolean;
    items: any[];
    nextToken: string | undefined;
  }>({
    loading: true,
    items: [],
    nextToken: undefined,
  });

  useEffect(() => {
    const generateYears = () => {
      let currentYear = new Date().getFullYear();
      const years = [];

      while (currentYear >= 2006) {
        years.push(currentYear.toString());
        currentYear -= 1;
      }
      setSeriesYears(['All'].concat(years));
    };

    const loadAllSeriesAsync = async () => {
      try {
        const response = await SeriesService.loadSeriesList(
          100,
          allSeries.nextToken
        );
        setAllSeries({
          items: response.items ?? [],
          loading: false,
          nextToken: response.nextToken ?? undefined,
        });
      } catch (error) {
        console.error({ error });
        setAllSeries({
          items: [],
          loading: false,
          nextToken: undefined,
        });
      }
    };

    const loadCustomPlaylists = async () => {
      try {
        const response = await SeriesService.loadCustomPlaylists(
          100,
          allSeries.nextToken
        );
        setAllSeries({
          items: response.items,
          loading: false,
          nextToken: undefined,
        });
      } catch (error) {
        console.error(error);
        setAllSeries({
          items: [],
          loading: false,
          nextToken: undefined,
        });
      }
    };
    const loadPopularSeries = async () => {
      const data: any = await SeriesService.fetchPopularSeries();
      setAllSeries({ items: data, loading: false, nextToken: undefined });
    };

    generateYears();
    if (route?.params?.popularSeries || route?.params?.customPlaylists) {
      if (route?.params?.popularSeries) loadPopularSeries();
      if (route?.params?.customPlaylists) loadCustomPlaylists();
    } else {
      loadAllSeriesAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.customPlaylists]);

  const getSeriesDate = (series: any) => {
    return moment(series.startDate || moment()).format('YYYY');
  };
  const series = allSeries.items
    .filter((s: any) =>
      searchText
        ? s.title.toLowerCase().includes(searchText.toLowerCase())
        : true
    )
    .filter((a) => {
      return selectedYear === 'All' || getSeriesDate(a) === selectedYear;
    })
    .filter((a) => {
      return selectedYear === 'All' || getSeriesDate(a) === selectedYear;
    });

  useLayoutEffect(() => {
    const headerRight = () => {
      return <View style={{ flex: 1 }} />;
    };
    const headerLeft = () => {
      return (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            accessibilityLabel="Go back"
            source={Theme.icons.white.back}
            style={{ width: 24, height: 24 }}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              transform: [{ translateX: -8 }],
            }}
          >
            Teaching
          </Text>
        </TouchableOpacity>
      );
    };
    navigation.setOptions({
      headerShown: true,
      title: route?.params?.customPlaylists
        ? 'Teaching Topics'
        : route?.params?.popularSeries
        ? 'Popular Series'
        : 'All Series',
      headerTitleStyle: style.headerTitle,
      headerStyle: {
        backgroundColor: Theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.gray2,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerLeft: headerLeft(),
      headerLeftContainerStyle: { left: 16 },
      headerRight: headerRight(),
    });
  }, [navigation, route]);

  return (
    <ScrollView style={style.content}>
      {!route?.params?.popularSeries ? (
        <SearchBar
          style={style.searchBar}
          searchText={searchText}
          handleTextChanged={(newStr) => setSearchText(newStr)}
          placeholderLabel="Search by name..."
        />
      ) : null}
      {!route?.params?.customPlaylists && !route?.params?.popularSeries ? (
        <View style={style.dateSelectBar}>
          <FlatList
            style={style.horizontalListContentContainer}
            horizontal
            data={seriesYears}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableHighlight
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${item}`}
                accessibilityState={{
                  selected: selectedYear === item,
                }}
                underlayColor={Theme.colors.grey3}
                onPress={() => setSelectedYear(item)}
                style={{
                  borderRadius: 50,
                  overflow: 'hidden',
                  marginRight: 8,
                }}
              >
                <Text
                  style={[
                    style.dateSelectYear,
                    item === selectedYear ? style.dateSelectYearSelected : {},
                  ]}
                >
                  {item}
                </Text>
              </TouchableHighlight>
            )}
          />
        </View>
      ) : null}
      <View style={style.seriesListContainer}>
        {allSeries.loading && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator />
          </View>
        )}
        {series.map((s: any, key: any) => {
          if (key < showCount) {
            if (route?.params?.customPlaylists) {
              return (
                <SeriesItem
                  key={s.id}
                  customPlaylist
                  navigation={navigation}
                  seriesData={s}
                  year={getSeriesDate(s)}
                />
              );
            }
            return (
              <SeriesItem
                key={s.id}
                navigation={navigation}
                seriesData={s}
                year={getSeriesDate(s)}
              />
            );
          }
          return null;
        })}
      </View>
      {series?.length > 20 && showCount < series.length ? (
        <View style={{ marginBottom: 20 }}>
          <AllButton onPress={() => setShowCount(showCount + 20)}>
            Load More
          </AllButton>
        </View>
      ) : null}
    </ScrollView>
  );
}
