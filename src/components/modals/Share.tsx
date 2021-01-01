import React, { useState } from 'react';
import { Clipboard, Share, Platform, Animated } from 'react-native';
import { Button, View, Text, Thumbnail } from 'native-base';
import { Theme } from '../../Theme.style';
import * as Linking from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

interface Params {
  link: string;
  message: string;
  closeCallback: () => void;
  noBottomPadding?: boolean;
}

export default function ShareModal({
  link,
  message,
  closeCallback,
  noBottomPadding,
}: Params): JSX.Element {
  const [copyLinkText, setCopyLinkText] = useState('Copy Link');
  const safeArea = useSafeAreaInsets();

  const translateY = new Animated.Value(0);
  const handleGesture = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  function handleGestureEnd(e: PanGestureHandlerStateChangeEvent) {
    if (e.nativeEvent.translationY > 60) {
      Animated.timing(translateY, {
        duration: 500,
        useNativeDriver: true,
        toValue: 275,
      }).start();
      setTimeout(closeCallback, 500);
    } else {
      Animated.timing(translateY, {
        duration: 200,
        useNativeDriver: true,
        toValue: 0,
      }).start();
    }
  }

  const shareToTwitter = async () => {
    const url = `https://twitter.com/intent/tweet?text=${message}&url=${link}&via=themeetinghouse`;

    try {
      await Linking.openURL(url);
    } catch (e) {
      console.debug(e);
    }
  };

  const share = async () => {
    const params =
      Platform.OS === 'ios'
        ? { url: link, message: message }
        : { message: link, title: message };

    try {
      await Share.share(params);
    } catch (e) {
      console.debug(e);
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onHandlerStateChange={(e) => handleGestureEnd(e)}
    >
      <Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          height: 200 + (noBottomPadding ? 0 : safeArea.bottom),
          backgroundColor: 'white',
          paddingHorizontal: 16,
          transform: [
            {
              translateY: translateY.interpolate({
                inputRange: [0, 275],
                outputRange: [0, 275],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      >
        <View
          style={{ height: 36, justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{
              width: 50,
              backgroundColor: Theme.colors.background,
              height: 6,
              borderRadius: 20,
            }}
          />
        </View>
        <Button
          style={{
            height: 56,
            borderRadius: 0,
            backgroundColor: Theme.colors.background,
          }}
          block
          onPress={() => {
            Clipboard.setString(link);
            setCopyLinkText('Copied');
          }}
        >
          <Thumbnail
            square
            source={Theme.icons.white.link}
            style={{ width: 24, height: 24 }}
          ></Thumbnail>
          <Text
            style={{
              color: 'white',
              fontFamily: Theme.fonts.fontFamilyBold,
              fontSize: 16,
              lineHeight: 24,
            }}
            uppercase={false}
          >
            {copyLinkText}
          </Text>
        </Button>
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }}>
          <Button
            style={{
              flexGrow: 1,
              height: 56,
              borderRadius: 0,
              borderWidth: 3,
              borderColor: Theme.colors.background,
              backgroundColor: 'transparent',
              marginRight: 16,
            }}
            block
            onPress={shareToTwitter}
          >
            <Thumbnail
              square
              accessibilityLabel="Share to Twitter"
              source={Theme.icons.black.twitter}
              style={{ width: 24, height: 24 }}
            ></Thumbnail>
          </Button>
          <Button
            style={{
              flexGrow: 1,
              height: 56,
              borderRadius: 0,
              borderWidth: 3,
              borderColor: Theme.colors.background,
              backgroundColor: 'transparent',
            }}
            block
            onPress={share}
          >
            <Thumbnail
              square
              accessibilityLabel="Share"
              source={Theme.icons.black.share}
              style={{ width: 24, height: 24 }}
            ></Thumbnail>
          </Button>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}
