/* eslint-disable global-require */
import React, { useEffect, useMemo, useState } from 'react';
import { Animated, View } from 'react-native';
import Constants from 'expo-constants';

type AnimatedSplashScreenProps = {
  children: JSX.Element;
};

export default function AnimatedSplashScreen({
  children,
}: AnimatedSplashScreenProps) {
  const scaleAnim = useMemo(() => new Animated.Value(1), []);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(0), []);
  const [animationFinished, setAnimationFinished] = useState(false);
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.601473,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          delay: 100,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start((event) => {
      if (event.finished) {
        setTimeout(() => {
          setAnimationFinished(true);
        }, 1000);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (animationFinished) {
    return children;
  }
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Splash Screen"
      style={{
        flex: 1,
        backgroundColor: Constants.manifest?.splash?.backgroundColor as string,
        justifyContent: 'center',
        paddingTop: 300,
        flexDirection: 'row',
      }}
    >
      <Animated.View
        style={{ flexDirection: 'row', transform: [{ translateX: slideAnim }] }}
      >
        <Animated.Image
          style={{
            marginLeft: 99.25,
            width: 89.29,
            height: 104.56,
            resizeMode: 'contain',
            transform: [{ scale: scaleAnim }],
          }}
          source={require('../assets/icons/logo.png')}
        />
        <Animated.Image
          style={{
            marginLeft: -7,
            width: 99.25,
            height: 104.56,
            opacity: fadeAnim,
            resizeMode: 'contain',
          }}
          source={require('../assets/icons/logo-word.png')}
        />
      </Animated.View>
    </View>
  );
}
