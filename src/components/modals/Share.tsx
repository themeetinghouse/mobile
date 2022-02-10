import React, { useState } from 'react';
import {
  Share,
  Platform,
  Animated,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { Theme } from '../../Theme.style';

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
        ? { url: link, message }
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
        <TouchableOpacity
          style={{
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 0,
            backgroundColor: Theme.colors.background,
          }}
          onPress={() => {
            Clipboard.setString(link);
            setCopyLinkText('Copied');
          }}
        >
          <Image
            accessibilityLabel="link icon"
            source={Theme.icons.white.link}
            style={{ width: 24, height: 24 }}
          />
          <Text
            style={{
              color: 'white',
              fontFamily: Theme.fonts.fontFamilyBold,
              fontSize: 16,
              marginLeft: 8,
              lineHeight: 18,
            }}
          >
            {copyLinkText}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 16,
          }}
        >
          <TouchableOpacity
            testID="twitter"
            style={{
              padding: 12,

              borderWidth: 3,
              flexGrow: 1,
              borderColor: Theme.colors.background,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}
            onPress={shareToTwitter}
          >
            <Image
              accessibilityLabel="Share to Twitter"
              source={Theme.icons.black.twitter}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            testID="share"
            style={{
              padding: 12,

              borderWidth: 3,
              flexGrow: 1,
              borderColor: Theme.colors.background,
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={share}
          >
            <Image
              accessibilityLabel="Share"
              source={Theme.icons.black.share}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}
