import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, Animated } from 'react-native';
import { View, Text } from 'native-base';
import { Theme } from '../../Theme.style'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PanGestureHandler, PanGestureHandlerStateChangeEvent } from 'react-native-gesture-handler';

const style = StyleSheet.create({
    text: {
        fontFamily: Theme.fonts.fontFamilyBold,
        color: 'white',
    },
    textWrapper: {
        width: 96,
        margin: 2,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    textWrapper2: {
        width: 146,
        margin: 2,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    }
})

interface Params {
    modeCallback: (data: 'light' | 'dark') => void;
    fontScaleCallback: (data: number) => void;
    defaultMode: 'light' | 'dark';
    defaultFontScale: number;
    noBottomPadding?: boolean;
    closeCallback: () => void;
}

export default function TextOpts({ modeCallback, fontScaleCallback, defaultMode, defaultFontScale, noBottomPadding, closeCallback }: Params): JSX.Element {

    const isAndroid = Platform.OS === 'android';

    const [mode, setMode] = useState<'light' | 'dark'>('dark');
    const [fontScale, setFontScale] = useState(1);
    const safeArea = useSafeAreaInsets();

    const translateY = new Animated.Value(0)
    const handleGesture = Animated.event([{ nativeEvent: { translationY: translateY } }], { useNativeDriver: true });

    function handleGestureEnd(e: PanGestureHandlerStateChangeEvent) {
        if (e.nativeEvent.translationY > 20) {
            Animated.timing(translateY, { duration: 500, useNativeDriver: true, toValue: 275 }).start();
            setTimeout(closeCallback, 500);
        } else {
            Animated.timing(translateY, { duration: 200, useNativeDriver: true, toValue: 0 }).start();
        }
    }

    useEffect(() => {
        setMode(defaultMode);
        setFontScale(defaultFontScale);
    }, [defaultMode, defaultFontScale])

    const toggleDarkMode = (to: 'light' | 'dark') => {
        setMode(to);
        modeCallback(to);
    }

    const toggleFontScale = (to: number) => {
        setFontScale(to);
        fontScaleCallback(to);
    }

    return <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={e => handleGestureEnd(e)} >
        <Animated.View style={{
            position: 'absolute', width: '100%',
            bottom: 0, height: 150 + (noBottomPadding ? 0 : safeArea.bottom), backgroundColor: 'white', paddingHorizontal: 16,
            alignItems: 'center',
            transform: [
                {
                    translateY: translateY.interpolate({
                        inputRange: [0, 275],
                        outputRange: [0, 275],
                        extrapolate: 'clamp'
                    }),
                },
            ]
        }}>
            <View style={{ height: 36, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: 50, backgroundColor: Theme.colors.background, height: 6, borderRadius: 20 }} />
            </View>
            <View style={{ width: 300, height: 36, backgroundColor: Theme.colors.grey2, borderRadius: 50, marginBottom: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity style={[style.textWrapper, { paddingTop: isAndroid ? 0 : 2, backgroundColor: fontScale === 1 ? Theme.colors.grey4 : 'transparent' }]} onPress={() => toggleFontScale(1)} >
                    <Text style={[style.text, { fontSize: 12 }]}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.textWrapper, { paddingTop: isAndroid ? 0 : 4, backgroundColor: fontScale === 1.25 ? Theme.colors.grey4 : 'transparent' }]} onPress={() => toggleFontScale(1.25)}>
                    <Text style={[style.text, { fontSize: 16 }]}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.textWrapper, { paddingTop: isAndroid ? 0 : 6, backgroundColor: fontScale === 1.5 ? Theme.colors.grey4 : 'transparent' }]} onPress={() => toggleFontScale(1.5)}>
                    <Text style={[style.text, { fontSize: 24 }]}>A</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: 300, height: 36, backgroundColor: Theme.colors.grey2, borderRadius: 50, marginBottom: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity style={[style.textWrapper2, { paddingTop: isAndroid ? 0 : 2, backgroundColor: mode === 'dark' ? Theme.colors.grey4 : 'transparent' }]} onPress={() => toggleDarkMode('dark')}>
                    <Text style={[style.text, { fontSize: 12 }]}>Dark Mode</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.textWrapper2, { paddingTop: isAndroid ? 0 : 4, backgroundColor: mode === 'light' ? Theme.colors.grey4 : 'transparent' }]} onPress={() => toggleDarkMode('light')} >
                    <Text style={[style.text, { fontSize: 12 }]}>Light Mode</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    </PanGestureHandler >
}