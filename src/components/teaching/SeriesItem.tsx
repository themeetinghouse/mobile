import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Theme } from '../../Theme.style';
import { TeachingStackParamList } from '../../navigation/MainTabNavigator';
import useDebounce from '../../../src/hooks/useDebounce';
import CachedImage from '../CachedImage';

const { width } = Dimensions.get('screen');

const style = StyleSheet.create({
  container: {
    marginTop: 6,
    padding: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomLeftRadius: 25,
    borderColor: 'gray',
  },
  seriesItem: {
    marginBottom: 20,
    marginTop: 0,
  },
  seriesThumbnail: {
    width: width * 0.44,
    height: width * 0.44 * (1248 / 1056),
  },
  seriesDetail: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.smallMedium,
    color: Theme.colors.gray5,
    textAlign: 'center',
    marginTop: 8,
  },
});
interface Params {
  navigation: StackNavigationProp<TeachingStackParamList, 'AllSeriesScreen'>;
  seriesData: any;
  year?: string;
  customPlaylist?: boolean;
}
export default function SeriesItem({
  navigation,
  seriesData,
  year,
  customPlaylist,
}: Params): JSX.Element {
  const { debounce } = useDebounce();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Navigate to ${seriesData.title} series screen ${seriesData.videos.items.length} episodes`}
      onPress={() =>
        debounce(() =>
          navigation.push('SeriesLandingScreen', {
            item: seriesData,
            seriesId: seriesData.id,
            customPlaylist,
          })
        )
      }
      style={style.seriesItem}
    >
      <CachedImage
        cacheKey={encodeURI(seriesData.image)}
        style={style.seriesThumbnail}
        url={encodeURI(seriesData.image)}
        fallbackUrl="https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg"
      />
      {year && !customPlaylist ? (
        <Text style={style.seriesDetail}>
          {year} &bull; {seriesData.videos.items.length} episodes
        </Text>
      ) : (
        <Text style={style.seriesDetail}>
          {seriesData.videos.items.length} episodes
        </Text>
      )}
    </TouchableOpacity>
  );
}
