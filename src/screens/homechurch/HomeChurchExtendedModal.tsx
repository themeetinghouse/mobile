import React, { useEffect } from 'react';
import { Animated, Dimensions } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import HomeChurchItem from './HomeChurchItem';
import { HomeChurch } from './HomeChurchScreen';

const { height } = Dimensions.get('window');

interface Params {
  selected: HomeChurch;
  setShowModal: (a: boolean) => void;
}

export default function HomeChurchExtendedModal({
  selected,
  setShowModal,
}: Params): JSX.Element {
  const translateY = new Animated.Value(height * 0.4);
  const handleGesture = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  function handleGestureEnd(e: PanGestureHandlerStateChangeEvent) {
    if (e.nativeEvent.translationY > 60) {
      Animated.timing(translateY, {
        duration: 150,
        useNativeDriver: true,
        toValue: height * 0.4,
      }).start();
      setTimeout(() => setShowModal(false), 200);
    } else {
      Animated.timing(translateY, {
        duration: 150,
        useNativeDriver: true,
        toValue: 0,
      }).start();
    }
  }

  useEffect(() => {
    Animated.timing(translateY, {
      duration: 150,
      useNativeDriver: true,
      toValue: 0,
    }).start();
  });

  return (
    <PanGestureHandler
      onGestureEvent={handleGesture}
      onHandlerStateChange={(e) => handleGestureEnd(e)}
    >
      <Animated.View
        style={{
          bottom: 0,
          position: 'absolute',
          zIndex: 200,
          transform: [
            {
              translateY: translateY.interpolate({
                inputRange: [0, height * 0.4],
                outputRange: [0, height * 0.4],
                extrapolate: 'clamp',
              }),
            },
          ],
        }}
      >
        <HomeChurchItem modal item={selected} />
      </Animated.View>
    </PanGestureHandler>
  );
}
