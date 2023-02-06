import React from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import ActivityIndicator from './ActivityIndicator';
import { Theme, Style } from '../Theme.style';
import CachedImage from './CachedImage';

const style = StyleSheet.create({
  categoryTitle: {
    ...Style.categoryTitle,
    ...{
      marginTop: 16,
    },
  },
  categorySection: {
    backgroundColor: Theme.colors.black,
    paddingTop: 16,
    marginBottom: 16,
  },
  horizontalListContentContainer: {
    marginTop: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  highlightsText: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.medium,
    color: Theme.colors.gray5,
    marginLeft: 16,
    marginTop: -10,
  },
  highlightsThumbnail: {
    width: 80 * (16 / 9),
    height: 80,
    marginLeft: 16,
  },
});

interface Props {
  data: {
    items: Array<any>;
    loading: boolean;
    nextToken: string;
  };
  header?: string;
  subHeader?: string;
  loadMore?: () => void;
  handleNavigation: (item?: any, index?: number) => void;
}

export default function GenericCarousel({
  data,
  header,
  subHeader,
  loadMore,
  handleNavigation,
}: Props): JSX.Element {
  const getImage = (item: any) => {
    const thumbnails =
      item?.video?.Youtube?.snippet?.thumbnails ??
      item?.Youtube?.snippet?.thumbnails;
    const url =
      thumbnails?.standard?.url ??
      thumbnails?.high?.url ??
      thumbnails?.maxres?.url;
    return url;
  };
  return (
    <View style={style.categorySection}>
      {header ? <Text style={style.categoryTitle}>{header}</Text> : null}
      {subHeader ? <Text style={style.highlightsText}>{subHeader}</Text> : null}
      <FlatList
        contentContainerStyle={style.horizontalListContentContainer}
        horizontal
        data={data.items}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Navigate to ${header?.slice(0, -1)} ${
                item?.episodeTitle
              }`}
              onPress={() => handleNavigation(item, index)}
            >
              <CachedImage
                style={style.highlightsThumbnail}
                url={getImage(item)}
                fallbackUrl="https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg"
                cacheKey={getImage(item)}
              />
            </TouchableOpacity>
          );
        }}
        onEndReached={loadMore ?? null}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<ActivityIndicator animating={data.loading} />}
      />
    </View>
  );
}
