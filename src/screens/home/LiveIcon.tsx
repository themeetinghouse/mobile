import { Animated, ViewProps } from 'react-native';
import React, { useRef, useEffect } from 'react';

type LiveIconProps = {
  width: number;
  height: number;
  style?: ViewProps['style'];
};
export default function LiveIcon({ width, height, style }: LiveIconProps) {
  const fadeAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const animation1 = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    const animation2 = Animated.timing(fadeAnim, {
      toValue: 0.4,
      duration: 1000,
      useNativeDriver: true,
    });
    const animationSequence = Animated.sequence([animation1, animation2]);

    Animated.loop(animationSequence).start();
  }, [fadeAnim]);
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: 'red',
          borderRadius: 50,
          opacity: fadeAnim,
        },
        style,
      ]}
    />
  );
}
