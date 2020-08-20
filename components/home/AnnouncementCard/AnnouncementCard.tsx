import React from 'react';
import { Text, Thumbnail } from 'native-base';
import Theme, { Style } from '../../../Theme.style';
//import WhiteButton from '../../buttons/WhiteButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Announcement } from '../../../services/AnnouncementService';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
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
    title: { ...Style.title, ...{ marginBottom: 8 } },
    body: Style.body,
    icon: {
        ...Style.icon,
        ...{
            width: 30,
            height: 30,
            marginBottom: 56,
        }
    }
})

type AnnouncementCardInput = {
    announcement: Announcement;
    handlePress(): any;
}

export default function AnnouncementCard({ announcement, handlePress }: AnnouncementCardInput): JSX.Element {
    return (
        <TouchableWithoutFeedback style={style.cardContainer} onPress={handlePress}>
            <Thumbnail style={style.icon} source={Theme.icons.white.announcement}></Thumbnail>
            <Text style={style.title}>{announcement.title}</Text>
            <Text style={style.body}>{announcement.description}</Text>
        </TouchableWithoutFeedback>
    )
}