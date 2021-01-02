import { Button, Text, Thumbnail, View } from 'native-base';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Image } from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { AVPlaybackStatus } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../Theme.style';
import MediaContext from '../../contexts/MediaContext';
import MiniPlayerStyleContext from '../../contexts/MiniPlayerStyleContext';

interface Params {
  currentScreen: string;
}

export default function MediaPlayer({ currentScreen }: Params): JSX.Element {
  const { width } = Dimensions.get('window');
  const mediaContext = useContext(MediaContext);
  const [videoReady, setVideoReady] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0.1);
  const [audioPosition, setAudioPosition] = useState(0);
  const playerRef = useRef<YoutubeIframeRef>(null);
  const [bottomPos, setBottomPos] = useState(90);

  const safeArea = useSafeAreaInsets();
  const display = useContext(MiniPlayerStyleContext);

  const style = StyleSheet.create({
    containerVideo: {
      height: 56,
      width: Dimensions.get('window').width,
      backgroundColor: Theme.colors.black,
      display: display.display,
      flexDirection: 'row',
      alignItems: 'center',
      position: bottomPos ? 'absolute' : 'relative',
      bottom: bottomPos,
      marginBottom: bottomPos ? 0 : safeArea.bottom,
    },
    containerAudioInner: {
      height: 56,
      width: Dimensions.get('window').width,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerAudioOuter: {
      height: 58,
      width: Dimensions.get('window').width,
      backgroundColor: Theme.colors.black,
      position: bottomPos ? 'absolute' : 'relative',
      bottom: bottomPos,
      marginBottom: bottomPos ? 0 : safeArea.bottom,
      display: display.display,
    },
    title: {
      fontFamily: Theme.fonts.fontFamilyBold,
      fontSize: 12,
      lineHeight: 18,
      color: 'white',
    },
    subTitle: {
      fontFamily: Theme.fonts.fontFamilyRegular,
      fontSize: 12,
      lineHeight: 18,
      color: Theme.colors.grey5,
    },
    skipText: {
      fontFamily: Theme.fonts.fontFamilyBold,
      fontSize: 12,
      lineHeight: 18,
      color: Theme.colors.grey5,
      marginTop: 8,
    },
    speedText: {
      fontFamily: Theme.fonts.fontFamilyBold,
      fontSize: 16,
      lineHeight: 24,
      color: Theme.colors.grey5,
    },
    timeText: {
      fontFamily: Theme.fonts.fontFamilyRegular,
      fontSize: 12,
      lineHeight: 18,
      color: Theme.colors.grey5,
    },
  });

  useEffect(() => {
    const bottomTabHidden = [
      'NotesScreen',
      'ProfileScreen',
      'AccountScreen',
      'ChangePasswordScreen',
      'LocationSelectionScreen',
      'DateRangeSelectScreen',
      'SermonLandingScreen',
    ];

    if (bottomTabHidden.includes(currentScreen)) {
      setBottomPos(0);
    } else {
      setBottomPos(90);
    }
  }, [currentScreen]);

  useEffect(() => {
    async function updateTime() {
      const videoTime = await playerRef?.current?.getCurrentTime();
      if (videoTime) mediaContext.setVideoTime(videoTime);
    }
    const interval = setInterval(() => {
      updateTime();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function updateAudioPosition(e: AVPlaybackStatus) {
    if (e.isLoaded) {
      setAudioPosition(Math.round(e.positionMillis));
      if (e.durationMillis) setAudioDuration(Math.round(e.durationMillis));
    }
  }

  useEffect(() => {
    async function updateAudio() {
      if (mediaContext.media.playerType === 'mini audio') {
        await mediaContext.media.audio?.sound.setProgressUpdateIntervalAsync(
          1000
        );
        mediaContext.media.audio?.sound.setOnPlaybackStatusUpdate((e) =>
          updateAudioPosition(e)
        );
      }
    }
    updateAudio();
  }, [mediaContext]);

  const handleVideoReady = () => {
    playerRef?.current?.seekTo(mediaContext.media.videoTime, true);
    setVideoReady(true);
  };

  const closeVideo = () => {
    mediaContext.setMedia({
      playerType: 'none',
      playing: false,
      audio: null,
      video: null,
      videoTime: 0,
      series: '',
      episode: '',
    });
  };

  const closeAudio = async () => {
    try {
      await mediaContext?.media?.audio?.sound.unloadAsync();
      mediaContext.setMedia({
        playerType: 'none',
        playing: false,
        audio: null,
        video: null,
        videoTime: 0,
        series: '',
        episode: '',
      });
    } catch (e) {
      console.debug(e);
    }
  };

  const pauseVideo = () => {
    mediaContext?.setMedia({
      ...mediaContext.media,
      playing: !mediaContext.media.playing,
    });
  };

  const pauseAudio = async () => {
    try {
      const status = await mediaContext?.media.audio?.sound.getStatusAsync();
      if (status?.isLoaded) {
        mediaContext.setMedia({
          ...mediaContext.media,
          playing: !mediaContext.media.playing,
        });
        if (status.isPlaying) {
          await mediaContext?.media.audio?.sound.pauseAsync();
        } else {
          await mediaContext?.media.audio?.sound.playAsync();
        }
      }
    } catch (e) {
      console.debug(e);
    }
  };

  switch (mediaContext.media.playerType) {
    case 'mini audio':
      return (
        <View style={style.containerAudioOuter}>
          <View style={style.containerAudioInner}>
            <Image
              source={{
                uri: `https://themeetinghouse.com/static/photos/series/adult-sunday-${mediaContext.media.series}.jpg`,
              }}
              style={{ width: 34, height: 40, marginHorizontal: 15 }}
            />
            <View
              style={{
                marginLeft: 8,
                width: width - (64 + 56 + 56),
                paddingRight: 12,
              }}
            >
              <Text numberOfLines={1} ellipsizeMode="tail" style={style.title}>
                {mediaContext.media.episode}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={style.subTitle}
              >
                {mediaContext.media.series}
              </Text>
            </View>
            <View
              style={{ display: 'flex', flexDirection: 'row', flexBasis: 112 }}
            >
              <Button
                transparent
                onPress={pauseAudio}
                style={{ width: 56, height: 56 }}
              >
                <Thumbnail
                  accessibilityLabel={
                    mediaContext.media.playing ? 'Pause Button' : 'Play Button'
                  }
                  source={
                    mediaContext.media.playing
                      ? Theme.icons.white.pauseMiniPlayer
                      : Theme.icons.white.playMiniPlayer
                  }
                  style={{ width: 24, height: 24 }}
                />
              </Button>
              <Button
                transparent
                onPress={closeAudio}
                style={{ width: 56, height: 56 }}
              >
                <Thumbnail
                  accessibilityLabel="Close Mini-player"
                  source={Theme.icons.white.closeCancel}
                  style={{ width: 24, height: 24 }}
                />
              </Button>
            </View>
          </View>
          <View
            style={{ width, height: 2, display: 'flex', flexDirection: 'row' }}
          >
            <View
              style={{
                width: width * (audioPosition / audioDuration),
                backgroundColor: Theme.colors.grey5,
              }}
            />
            <View
              style={{
                width: width * (audioDuration - audioPosition / audioDuration),
                backgroundColor: Theme.colors.grey2,
              }}
            />
          </View>
        </View>
      );
    case 'mini video':
      return (
        <View style={style.containerVideo}>
          <View pointerEvents="none">
            <YoutubePlayer
              ref={playerRef}
              onReady={handleVideoReady}
              forceAndroidAutoplay
              height={videoReady && mediaContext.media.playing ? 56 : 0}
              width={videoReady && mediaContext.media.playing ? 100 : 0}
              videoId={mediaContext.media.video as string}
              play={
                mediaContext.media.playing && Boolean(mediaContext.media.video)
              }
              initialPlayerParams={{ controls: false, modestbranding: true }}
            />
            <Image
              source={{
                uri: `https://img.youtube.com/vi/${mediaContext.media.video}/sddefault.jpg`,
              }}
              style={{
                width: videoReady && mediaContext.media.playing ? 0 : 100,
                height: videoReady && mediaContext.media.playing ? 0 : 56,
              }}
            />
          </View>
          <View
            style={{
              marginLeft: 8,
              width: width - (100 + 56 + 56),
              paddingRight: 12,
            }}
          >
            <Text numberOfLines={1} ellipsizeMode="tail" style={style.title}>
              {mediaContext.media.episode}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={style.subTitle}>
              {mediaContext.media.series}
            </Text>
          </View>
          <View
            style={{ display: 'flex', flexDirection: 'row', flexBasis: 112 }}
          >
            <Button
              transparent
              onPress={pauseVideo}
              style={{ width: 56, height: 56 }}
            >
              <Thumbnail
                accessibilityLabel={
                  mediaContext.media.playing ? 'Pause Button' : 'Play Button'
                }
                source={
                  mediaContext.media.playing
                    ? Theme.icons.white.pauseMiniPlayer
                    : Theme.icons.white.playMiniPlayer
                }
                style={{ width: 24, height: 24 }}
              />
            </Button>
            <Button
              transparent
              onPress={closeVideo}
              style={{ width: 56, height: 56 }}
            >
              <Thumbnail
                accessibilityLabel="Close Mini-player"
                source={Theme.icons.white.closeCancel}
                style={{ width: 24, height: 24 }}
              />
            </Button>
          </View>
        </View>
      );
    default:
      return <View />;
  }
}
