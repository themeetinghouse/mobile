import React, { useState, useRef, useEffect, useContext } from 'react';
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
import { Theme, Style } from '../../Theme.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../navigation/AppNavigator';
import MediaContext from '../../contexts/MediaContext';
import SermonsService from '../../services/SermonsService';
import ActivityIndicator from '../../components/ActivityIndicator';

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

export default function HighlightPlayer({
  navigation,
  route,
}: Params): JSX.Element {
  const screenWidth = Dimensions.get('screen').width;
  const playerRef = useRef<YoutubeIframeRef>(null);
  const safeArea = useSafeAreaInsets();

  const [highlight, setHighlight] = useState(route.params?.highlights[0]);
  const [allHighlights, setAllHighlights] = useState(route.params?.highlights);
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(1);
  const [nextToken, setNextToken] = useState(route.params.nextToken);

  const media = useContext(MediaContext);

  const getMoreHighlights = async () => {
    const data = await SermonsService.loadHighlightsList(20, nextToken);
    setAllHighlights((prev) => {
      return prev.concat(data.items);
    });
    setNextToken(data.nextToken ?? undefined);
  };

  useEffect(() => {
    async function closeMedia() {
      media.setPlayerTypeNone();
      if (media.media.audio) {
        try {
          await media.media.audio?.sound.unloadAsync();
        } catch (e) {
          console.debug(e);
        }
      }
      media.setMedia({
        video: null,
        videoTime: 0,
        audio: null,
        playerType: 'none',
        playing: false,
        series: '',
        episode: '',
      });
    }
    closeMedia();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await playerRef.current?.getCurrentTime();
      if (data) setElapsed(data);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDuration = async () => {
    const data = await playerRef.current?.getDuration();
    if (data) setDuration(data);
  };

  function handleStateChange(event: string) {
    if (event === 'ended') {
      setHighlight(allHighlights[index + 1]);
      setIndex(index + 1);
      setElapsed(0);
    }
  }

  const getTeachingImage = (teaching: any) => {
    const thumbnails = teaching.Youtube.snippet.thumbnails;
    if (thumbnails.standard) return thumbnails.standard.url;
    else if (thumbnails.maxres) return thumbnails.maxres.url;
  };

  return (
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
            <Text numberOfLines={1} ellipsizeMode="tail" style={style.episode}>
              {highlight.episodeTitle
                ? highlight.episodeTitle
                : highlight.Youtube?.snippet?.title}
            </Text>
          </View>
        </Body>
        <Right></Right>
      </Header>
      <View style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        <YoutubePlayer
          ref={playerRef}
          onReady={getDuration}
          onChangeState={(e) => handleStateChange(e as string)}
          forceAndroidAutoplay
          height={(9 / 16) * screenWidth}
          width={screenWidth}
          videoId={highlight.id}
          play={true}
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
          horizontal={true}
          data={allHighlights}
          initialScrollIndex={1}
          getItemLayout={(data, index) => {
            return { length: 80 * (16 / 9), offset: 80 * (16 / 9) + 16, index };
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                setHighlight(allHighlights[index]);
                setIndex(index);
                setElapsed(0);
              }}
            >
              <Image
                style={style.highlightsThumbnail}
                source={{ uri: getTeachingImage(item) }}
              />
            </TouchableOpacity>
          )}
          onEndReached={getMoreHighlights}
          onEndReachedThreshold={0.8}
          ListFooterComponent={() => <ActivityIndicator />}
        ></FlatList>
      </View>
    </Container>
  );
}
