import React from 'react';
import { View, Text } from 'native-base';
import Theme, { Style } from '../../../Theme.style';
import Verse from './VerseLink';

const style = {
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "baseline",
    },
}

export default function NoteItem({containerStyle, children}){


    return (
        <View style={[style.container, containerStyle]}>
            {children}
        </View>
    )
}