import React, { useState } from 'react';
import { Image, ImageStyle, ImageBackground, Animated } from 'react-native';

interface Props {
  uri: string;
  catchUri: string;
  style?: ImageStyle;
}

export default function FallbackImage({
  uri,
  catchUri,
  style,
}: Props): JSX.Element {
  const [source, setSource] = useState(uri);

  return (
    <Image
      source={{ uri: source }}
      style={style}
      onError={() => setSource(catchUri)}
    />
  );
}

interface AnimatedProps extends Pick<Props, 'uri' | 'catchUri'> {
  style: Animated.WithAnimatedObject<ImageStyle>;
}

export function AnimatedFallbackImage({
  uri,
  catchUri,
  style,
}: AnimatedProps): JSX.Element {
  const [source, setSource] = useState(uri);

  return (
    <Animated.Image
      source={{ uri: source }}
      style={style}
      onError={() => setSource(catchUri)}
    />
  );
}

interface PropsWithChildren extends Props {
  children: JSX.Element;
}

export function FallbackImageBackground({
  uri,
  catchUri,
  style,
  children,
}: PropsWithChildren): JSX.Element {
  const [source, setSource] = useState(uri);

  return (
    <ImageBackground
      source={{ uri: source }}
      style={style}
      onError={() => setSource(catchUri)}
    >
      {children}
    </ImageBackground>
  );
}
