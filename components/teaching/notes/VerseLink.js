import React from 'react';
import Theme, { Style } from '../../../Theme.style';
import { TouchableOpacity, Text } from 'react-native';

const style = {
    verseLink: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
        lineHeight: 24,
        marginBottom: 6,
        marginRight: 5,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.white,
    },
    verseLinkSelected: {
        borderBottomColor: Theme.colors.red,
        borderStyle: 'dashed',
    }
}

export default function VerseLink({note, verseId, chapterVerse, selected, onPress, children}){
    return (
        <TouchableOpacity 
            onPress={() => {
                onPress({note, verseId, chapterVerse});
            }
        }>
            <Text numberOfLines={1} style={[style.verseLink, selected ? style.verseLinkSelected : {}]}>
                {children}
            </Text>
        </TouchableOpacity>
    )
}