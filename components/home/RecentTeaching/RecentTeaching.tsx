import React from 'react';
import { Text, View } from 'native-base';
import { Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme, Style } from '../../../Theme.style';
import IconButton from '../../buttons/IconButton';
import moment from 'moment';

const style = {
    container: {
        alignItems: "center",
        marginLeft: 16,
        marginRight: 16,
        backgroundColor: Theme.colors.black,
    } as ViewStyle,
    teachingImage: {
        width: "100%",
        height: 280,
        position: "absolute"
    } as ImageStyle,
    seriesImage: {
        width: 80,
        height: 96,
        marginBottom: 24
    },
    seriesImageWithTeachingImage: {
        marginTop: 208,
    },
    episodeNumber: {
        color: Theme.colors.white,
        fontSize: Theme.fonts.smallMedium,
        fontFamily: Theme.fonts.fontFamilyBold,
        marginBottom: 4
    },
    title: {
        color: Theme.colors.white,
        fontSize: Theme.fonts.extraLarge,
        fontFamily: Theme.fonts.fontFamilyBold,
        marginBottom: 8,
        textAlign: "center",
    } as TextStyle,
    subtitle: {
        color: Theme.colors.gray5,
        fontSize: Theme.fonts.small,
        marginBottom: 14
    },
    description: [
        Style.cardDescription,
        {
            color: Theme.colors.gray5,
            fontSize: Theme.fonts.medium,
            marginBottom: 32,
            textAlign: "center",
        }
    ] as TextStyle,
    noteButtonContainer: {
    }
}

interface RecentTeachingInput {
    teaching: any;
    navigation: any;
}

export default function RecentTeaching({ teaching, navigation }: RecentTeachingInput): JSX.Element {
    //console.log("RecentTeaching.render(): props = ", props)

    if (!teaching) {
        return (<View></View>);
    }

    const series = teaching.series || { title: "" };
    series.seriesImageUri = series.title
        ? `https://themeetinghouse.com/static/photos/series/adult-sunday-${teaching.series.title.replace("?", "")}.jpg`
        : "https://www.themeetinghouse.com/static/NoCompassionLogo.png";

    let teachingImage = null;
    if (teaching.Youtube.snippet.thumbnails.standard) {
        teachingImage = teaching.Youtube.snippet.thumbnails.standard;
    }

    const openNotes = (teachingId: string) => {
        console.log("RecentTeaching.openNotes(): teachingId = ", teachingId);
        navigation.navigate("NotesScreen")
    }

    return (
        <View style={style.container}>
            {teachingImage &&
                <>
                    <Image style={style.teachingImage} source={{ uri: teachingImage.url }}></Image>
                    <Image style={[style.seriesImage, style.seriesImageWithTeachingImage]} source={{ uri: series.seriesImageUri }}></Image>
                </>
            }
            {!teachingImage &&
                <Image style={style.seriesImage} source={{ uri: series.seriesImageUri }}></Image>
            }
            <Text style={style.episodeNumber}>Week {teaching.episodeNumber}</Text>
            <Text style={style.title}>{teaching.episodeTitle}</Text>
            <Text style={style.subtitle}>{moment(teaching.publishedDate).format("MMMM D, YYYY")}</Text>
            <Text style={style.description}>{teaching.description}</Text>
            <View style={style.noteButtonContainer}>
                <IconButton icon={Theme.icons.white.notes} label="Notes" onPress={() => openNotes(teaching.id)}></IconButton>
            </View>
        </View>
    )
}