import React from 'react';
import { View, Text, Thumbnail } from 'native-base';
import Theme, { Style } from '../../../Theme.style';
import WhiteButton from '../../buttons/WhiteButton';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

const style = {
    cardContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 40,
        paddingTop: 40,
        backgroundColor: Theme.colors.gray1,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#313131",
    },
    title: [ Style.title, {
        marginBottom: 8,
    }],
    body: [ Style.body, {
    }],
    icon: [ Style.icon, {
        width: 30,
        height: 30,
        marginBottom: 56,
    }]
}

export default function AnnouncementCard( { announcement, handlePress }) {
    return (
        <TouchableWithoutFeedback style={style.cardContainer} onPress={handlePress}>
            <Thumbnail style={style.icon} source={Theme.icons.white.announcement}></Thumbnail>
            <Text style={style.title}>{announcement.title}</Text>
            <Text style={style.body}>{announcement.description}</Text>
        </TouchableWithoutFeedback>
    )
}