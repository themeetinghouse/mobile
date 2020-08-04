import React from 'react';
import { View, Text } from 'native-base';
//import Theme, { Style } from '../../../Theme.style';
//import Verse from './VerseLink';
import { ViewStyle } from 'react-native';

const style = {
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "baseline",
    } as ViewStyle,
}

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