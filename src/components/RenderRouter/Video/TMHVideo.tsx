import React, { useRef } from 'react';
import { Dimensions } from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { VideoType } from '../ContentTypes';

export default function Video({ item }: { item: VideoType }) {
  const playerRef = useRef<YoutubeIframeRef>(null);
  const deviceWidth = Dimensions.get('window').width;
  const handleVideoReady = () => {
    playerRef?.current?.seekTo(0, true);
  };
  return (
    <YoutubePlayer
      volume={100}
      ref={playerRef}
      onReady={handleVideoReady}
      forceAndroidAutoplay
      height={Math.round(deviceWidth * (9 / 16))}
      width={Math.round(deviceWidth)}
      videoId={item.youtubeID}
      play
      initialPlayerParams={{ modestbranding: true }}
    />
  );
}
