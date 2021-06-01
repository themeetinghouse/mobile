import React, { useState, useRef, useEffect } from 'react';
import {
  StatusBar,
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
import {
  Header,
  Left,
  Button,
  Thumbnail,
  Container,
  Body,
  Right,
} from 'native-base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme, Style } from '../../Theme.style';
import { MainStackParamList } from '../../navigation/AppNavigator';
import SermonsService from '../../services/SermonsService';
import ActivityIndicator from '../../components/ActivityIndicator';
import NoMedia from '../../components/NoMedia';
import loadSomeAsync from '../../utils/loading';

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
  const safeArea = useSafeAreaInsets();
  const [highlight, setHighlight] = useState(route.params?.highlights[0]);
  const [highlights, setHighlights] = useState({
    loading: false,
    items: [...route.params?.highlights],
    nextToken: route?.params?.nextToken,
  });
  const [videoIndex, setVideoIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(1);

  const getMoreHighlights = async () => {
    loadSomeAsync(
      SermonsService.loadHighlightsList,
      highlights,
      setHighlights,
      5
    );
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
      setHighlight(highlights?.items?.[videoIndex + 1]);
      setVideoIndex(videoIndex + 1);
      setElapsed(0);
    }
  }

  function getTeachingImage(teaching: any) {
    const { thumbnails } = teaching?.Youtube?.snippet;
    if (thumbnails?.standard) return thumbnails?.standard?.url;
    return thumbnails?.maxres?.url;
  }

  return (
    <NoMedia>
      <Container style={{ backgroundColor: 'black', flex: 1 }}>
        <Header style={{ backgroundColor: 'black', height: 68 + safeArea.top }}>
          <StatusBar
            backgroundColor={Theme.colors.black}
            barStyle="light-content"
          />
          <Left style={[style.headerLeft, { height: 68 }]}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Thumbnail
                square
                accessibilityLabel="Close Highlight"
                source={Theme.icons.white.closeCancel}
                style={{ width: 24, height: 24 }}
              />
            </Button>
          </Left>
          <Body style={style.headerBody}>
            <Image
              source={{
                uri: `https://themeetinghouse.com/static/photos/series/adult-sunday-${highlight.seriesTitle}.jpg`,
              }}
              style={{ width: 56, height: 68, marginRight: 16 }}
            />
            <View>
              <Text numberOfLines={1} ellipsizeMode="tail" style={style.series}>
                {highlight.seriesTitle}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={style.episode}
              >
                {highlight.episodeTitle
                  ? highlight.episodeTitle
                  : highlight.Youtube?.snippet?.title}
              </Text>
            </View>
          </Body>
          <Right />
        </Header>
        <View
          style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
        >
          <YoutubePlayer
            ref={playerRef}
            onReady={getDuration}
            onChangeState={(e) => handleStateChange(e as string)}
            height={(9 / 16) * screenWidth}
            width={screenWidth}
            videoId={highlight.id}
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
            data={highlights?.items}
            initialScrollIndex={highlights?.items?.length === 1 ? 0 : 1}
            getItemLayout={(data, index) => {
              return {
                length: 80 * (16 / 9),
                offset: 80 * (16 / 9) + 16,
                index,
              };
            }}
            onEndReachedThreshold={0.9}
            onEndReached={route?.params?.fromSeries ? null : getMoreHighlights}
            ListFooterComponent={() =>
              highlights.loading ? <ActivityIndicator /> : null
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setHighlight(highlights?.items?.[index]);
                  setVideoIndex(index);
                  setElapsed(0);
                }}
              >
                <Image
                  style={style.highlightsThumbnail}
                  source={{ uri: getTeachingImage(item) }}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </Container>
    </NoMedia>
  );
}
