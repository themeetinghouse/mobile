import React from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  ImageErrorEventData,
  ImageProps,
  NativeSyntheticEvent,
  View,
} from 'react-native';
import useCachedImage from '../hooks/useCachedImage';

type CachedImage = {
  cacheKey: string;
  url: string;
  fallbackUrl?: string;
  animated?: boolean;
  background?: boolean;
  children?: JSX.Element;
};

type CachedImageProps =
  | (CachedImage & Omit<ImageProps, 'source'>)
  | (CachedImage & Animated.AnimatedProps<Omit<ImageProps, 'source'>>);
export default function CachedImage({
  url,
  cacheKey,
  fallbackUrl,
  animated,
  background,
  children,
  ...props
}: CachedImageProps) {
  const { isLoading, uri, setUri } = useCachedImage(url, cacheKey);
  const onError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    if (props.onError) {
      props.onError(error);
    }
    if (fallbackUrl) {
      setUri(fallbackUrl);
    }
  };
  if (isLoading) return <View />;
  if (animated)
    return (
      <Animated.Image
        {...(props as Animated.AnimatedProps<ImageProps>)}
        onError={onError}
        source={{ uri }}
      />
    );
  if (background)
    return (
      <ImageBackground
        {...(props as ImageProps)}
        onError={onError}
        source={{ uri }}
      >
        {children}
      </ImageBackground>
    );
  return (
    <Image {...(props as ImageProps)} onError={onError} source={{ uri }} />
  );
}
