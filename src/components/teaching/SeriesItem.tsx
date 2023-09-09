import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { SeriesDataWithHeroImage } from '../../services/SeriesService';
import { Theme } from '../../Theme.style';
import { TeachingStackParamList } from '../../navigation/MainTabNavigator';
import useDebounce from '../../../src/hooks/useDebounce';
import CachedImage from '../CachedImage';
import { Series } from '../../services/API';

const { width } = Dimensions.get('screen');

export const SeriesStyle = StyleSheet.create({
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
  series: Series | SeriesDataWithHeroImage;
  year?: string;
  customPlaylist?: boolean;
}
export default function SeriesItem({
  series,
  year,
  customPlaylist,
}: Params): JSX.Element {
  const { debounce } = useDebounce();
  const navigation =
    useNavigation<StackNavigationProp<TeachingStackParamList>>();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Navigate to ${series.title} series screen ${series.videos?.items.length} episodes`}
      onPress={() =>
        debounce(() =>
          navigation.push('SeriesLandingScreen', {
            item: series,
            seriesId: series.id,
            customPlaylist,
          })
        )
      }
      style={SeriesStyle.seriesItem}
    >
      <CachedImage
        cacheKey={encodeURI(series.bannerImage?.src ?? '')}
        style={SeriesStyle.seriesThumbnail}
        url={encodeURI(series.bannerImage?.src ?? '')}
        fallbackUrl="https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg"
      />
      {year && !customPlaylist ? (
        <Text style={SeriesStyle.seriesDetail}>
          {year} &bull; {series.videos?.items.length} episodes
        </Text>
      ) : (
        <Text style={SeriesStyle.seriesDetail}>
          {series.videos?.items.length} episodes
        </Text>
      )}
    </TouchableOpacity>
  );
}
