import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Video } from '../../services/API';
import Header from '../../components/Header';
import { Theme, Style } from '../../Theme.style';
import { MainStackParamList } from '../../navigation/AppNavigator';
import SermonsService from '../../services/SermonsService';
import ActivityIndicator from '../../components/ActivityIndicator';
import NoMedia from '../../components/NoMedia';

interface Params {
  navigation: StackNavigationProp<MainStackParamList, 'HighlightScreen'>;
  route: RouteProp<MainStackParamList, 'HighlightScreen'>;
}

const style = StyleSheet.create({
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerBody: {
    flexGrow: 3,
    display: 'flex',
    flexDirection: 'row',
  },
  series: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 12,
    lineHeight: 18,
    color: 'white',
  },
  episode: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 12,
    lineHeight: 18,
    color: Theme.colors.grey5,
  },
  categoryTitle: {
    ...Style.categoryTitle,
    ...{
      marginTop: 16,
    },
  },
  highlightsThumbnail: {
    width: 80 * (16 / 9),
    height: 80,
    marginLeft: 16,
  },
});

export default function HighlightScreen({
  navigation,
  route,
}: Params): JSX.Element {
  const screenWidth = Dimensions.get('screen').width;
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [highlight, setHighlight] = useState<Video>(
    route.params?.highlights[0]
  );
  const [highlights, setHighlights] = useState<Video[]>(
    route.params?.highlights
  );
  const [loading, setLoading] = useState(false);
  const [nextToken, setNextToken] = useState<undefined | string>(
    route?.params?.nextToken
  );
  const [videoIndex, setVideoIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(1);

  const loadMoreHighlights = async () => {
    try {
      const result = await SermonsService.loadHighlightsList(5, nextToken);
      const items = (result.items as Video[]) ?? [];
      setHighlights((prev) => [...prev, ...items]);
      setNextToken(result.nextToken ?? undefined);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await playerRef.current?.getCurrentTime();
        if (data) setElapsed(data);
      } catch (error) {
        // console.log(error);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDuration = async () => {
    try {
      const data = await playerRef.current?.getDuration();
      if (data) setDuration(data);
    } catch (error) {
      // console.log(error);
    }
  };

  function handleStateChange(event: string) {
    if (event === 'ended') {
      if (highlights?.[videoIndex + 1]) {
        setHighlight(highlights?.[videoIndex + 1]);
        setHighlights((prev) => prev.slice(1, prev.length));
        setVideoIndex(videoIndex + 1);
        setElapsed(0);
      } else {
        console.log(
          'NOT FOUND???',
          highlights?.[videoIndex + 1],
          { videoIndex },
          { length: highlights?.length },
          { highlights }
        );
      }
    }
  }

  function getTeachingImage(teaching: Video) {
    const thumbnails = teaching?.Youtube?.snippet?.thumbnails;
    return (
      thumbnails?.standard?.url ??
      thumbnails?.maxres?.url ??
      thumbnails?.high?.url
    );
  }
  const seriesImageURI = highlight?.seriesTitle
    ? `https://themeetinghouse.com/static/photos/series/adult-sunday-${highlight.seriesTitle}.jpg`
    : null;
  console.log({ highlights });
  return (
    <NoMedia>
      <View style={{ backgroundColor: 'black', flex: 1 }}>
        <Header style={{}}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: 'flex-start',
                paddingVertical: 16,
                paddingLeft: 16,
                paddingRight: 30,
              }}
              onPress={() => navigation.goBack()}
            >
              <Image
                accessibilityLabel="Close Highlight"
                source={Theme.icons.white.closeCancel}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>

            {seriesImageURI ? (
              <Image
                source={{
                  uri: seriesImageURI,
                }}
                style={{ width: 56, height: 68, marginRight: 16 }}
              />
            ) : null}
            <View style={{ flex: 1 }}>
              {highlight?.seriesTitle ? (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={style.series}
                >
                  {highlight.seriesTitle}
                </Text>
              ) : null}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={style.episode}
              >
                {highlight?.episodeTitle
                  ? highlight?.episodeTitle
                  : highlight?.Youtube?.snippet?.title}
              </Text>
            </View>
          </View>
        </Header>
        <View
          style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
          renderToHardwareTextureAndroid
        >
          <YoutubePlayer
            ref={playerRef}
            onReady={getDuration}
            onChangeState={(e) => handleStateChange(e as string)}
            height={(9 / 16) * screenWidth}
            width={screenWidth}
            videoId={highlight?.id}
            play
            initialPlayerParams={{ controls: false, modestbranding: true }}
          />
        </View>
        <View
          style={{
            height: 4,
            width: (elapsed / duration) * screenWidth,
            backgroundColor: 'white',
          }}
        />
        <View
          style={{
            paddingBottom: 48,
            paddingTop: 16,
            backgroundColor: Theme.colors.background,
          }}
        >
          <Text style={style.categoryTitle}>Up Next</Text>
          <FlatList
            horizontal
            data={highlights}
            onEndReachedThreshold={0.8}
            onEndReached={route?.params?.fromSeries ? null : loadMoreHighlights}
            ListFooterComponent={<ActivityIndicator animating={loading} />}
            renderItem={({ item, index }) => {
              const imageURI = getTeachingImage(item) ?? '';
              if (!imageURI) {
                console.log({ missing: item });
                return null;
              }

              return (
                <TouchableOpacity
                  onPress={() => {
                    setHighlight(highlights?.[index]);
                    setVideoIndex(index);
                    setElapsed(0);
                  }}
                >
                  <Image
                    style={style.highlightsThumbnail}
                    source={{ uri: imageURI }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </NoMedia>
  );
}
