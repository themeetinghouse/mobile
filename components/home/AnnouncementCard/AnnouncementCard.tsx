import React from 'react';
import { Text, Thumbnail } from 'native-base';
import Theme, { Style } from '../../../Theme.style';
//import WhiteButton from '../../buttons/WhiteButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Announcement } from '../../../services/AnnouncementService';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const style = StyleSheet.create({
    cardContainer: {
        height: 300,
        flexWrap: "nowrap",
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 40,
        paddingTop: 40,
        backgroundColor: Theme.colors.gray1,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#313131",
    },
    imageCardContainer: {
        height: 300,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 40,
        paddingTop: 40,
        marginBottom: 16,
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
        announcement?.image ?
            <View style={{ paddingBottom: 16, backgroundColor: Theme.colors.black, }}>
                <ImageBackground style={{ flex: 1, backgroundColor: Theme.colors.gray1, borderBottomWidth: 1, borderBottomColor: "#313131", }} source={{ uri: announcement.image }}>
                    <LinearGradient
                        colors={["rgba(0,0,0, 0.2)", "rgba(0,0,0, 0.9)"]}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            height: "100%"
                        }}
                    />
                    <TouchableWithoutFeedback style={style.imageCardContainer} onPress={handlePress}>
                        <Thumbnail style={style.icon} source={Theme.icons.white.announcement}></Thumbnail>
                        <Text style={style.title}>{announcement.title}</Text>
                        <Text style={style.body}>{announcement.description.slice(0, 100).trim() + "..."}</Text>
                    </TouchableWithoutFeedback>
                </ImageBackground>
            </View>
            :
            <TouchableWithoutFeedback style={style.cardContainer} onPress={handlePress}>
                <Thumbnail style={style.icon} source={Theme.icons.white.announcement}></Thumbnail>
                <Text style={style.title}>{announcement.title}</Text>
                <Text style={style.body}>{announcement.description.slice(0, 100).trim() + "..."}</Text>
            </TouchableWithoutFeedback>
    )
}