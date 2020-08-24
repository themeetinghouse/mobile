import React from 'react';
import { View } from 'native-base';
//import Theme, { Style } from '../../../Theme.style';
//import Verse from './VerseLink';
import { ViewStyle, StyleSheet } from 'react-native';

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "baseline",
    },
})

interface Params {
    containerStyle: ViewStyle;
    children: React.ReactNode;
    note: any
}

export default function NoteItem({ containerStyle, children, note }: Params): JSX.Element {

    return (
        <View style={[style.container, containerStyle]}>
            {children}
        </View>
    )
}