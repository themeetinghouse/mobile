import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { View, Text } from 'native-base';
import { Theme } from '../../Theme.style'
import { TouchableOpacity } from 'react-native-gesture-handler';


const style = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
        marginRight: 10,
    },
    text: {
        fontFamily: Theme.fonts.fontFamilyBold,
        color: 'white',
    },
    textWrapper: {
        width: 70,
        margin: 2,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    textWrapper2: {
        width: 107,
        margin: 2,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    }
})

interface Params {
    show: boolean;
    top: number;
    modeCallback: (data: 'light' | 'dark') => void;
    fontScaleCallback: (data: number) => void;
    defaultMode: 'light' | 'dark';
    defaultFontScale: number;
}

export default function ShareModal({ show, top, modeCallback, fontScaleCallback, defaultMode, defaultFontScale }: Params): JSX.Element {


    const [mode, setMode] = useState<'light' | 'dark'>('dark');
    const [fontScale, setFontScale] = useState(1);

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

    if (show)
        return <View style={{ position: 'absolute', zIndex: 9999, top: top - (Platform.OS === 'ios' ? 6 : 10.5), right: 0 }} >
            <View style={[style.triangle, { alignSelf: 'flex-end', zIndex: -1 }]}></View>
            <View style={{ width: 254, height: 124, backgroundColor: 'white', padding: 16 }} >
                <View style={{ width: 222, height: 36, backgroundColor: Theme.colors.grey2, borderRadius: 50, marginBottom: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={[style.textWrapper, { paddingTop: 2, backgroundColor: fontScale === 1 ? Theme.colors.grey4 : 'transparent' }]} onPress={() => toggleFontScale(1)} >
                        <Text style={[style.text, { fontSize: 12 }]}>A</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.textWrapper, { paddingTop: 4, backgroundColor: fontScale === 1.25 ? Theme.colors.grey4 : 'transparent' }]} onPress={() => toggleFontScale(1.25)}>
                        <Text style={[style.text, { fontSize: 16 }]}>A</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.textWrapper, { paddingTop: 6, backgroundColor: fontScale === 1.5 ? Theme.colors.grey4 : 'transparent' }]} onPress={() => toggleFontScale(1.5)}>
                        <Text style={[style.text, { fontSize: 24 }]}>A</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: 222, height: 36, backgroundColor: Theme.colors.grey2, borderRadius: 50, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={[style.textWrapper2, { paddingTop: 2, backgroundColor: mode === 'dark' ? Theme.colors.grey4 : 'transparent' }]} onPress={() => toggleDarkMode('dark')}>
                        <Text style={[style.text, { fontSize: 12 }]}>Dark Mode</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.textWrapper2, { paddingTop: 4, backgroundColor: mode === 'light' ? Theme.colors.grey4 : 'transparent' }]} onPress={() => toggleDarkMode('light')} >
                        <Text style={[style.text, { fontSize: 12 }]}>Light Mode</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    else
        return <View />
}