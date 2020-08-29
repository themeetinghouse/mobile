import React from 'react';
import { Text, View } from 'native-base';
import { Image, StyleSheet, Dimensions } from 'react-native';
import { Theme, Style } from '../../../Theme.style';
import IconButton from '../../buttons/IconButton';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { LoadSermonResult } from '../../../services/SermonsService';
import { MainStackParamList } from '../../../navigation/AppNavigator'
import { StackNavigationProp } from '@react-navigation/stack'

const screenWidth = Dimensions.get('window').width;

const style = StyleSheet.create({
    container: {
        alignItems: "center",
        marginLeft: 16,
        marginRight: 16,
        backgroundColor: Theme.colors.black,
    },
    teachingImage: {
        width: screenWidth,
        height: (9 / 16) * screenWidth,
        position: 'absolute'
    },
    seriesImage: {
        alignSelf: 'center',
        width: screenWidth * 0.2133,
        height: screenWidth * 0.256,
        marginBottom: 24
    },
    seriesImageWithTeachingImage: {
        marginTop: 32 + (0.75 * (9 / 16) * screenWidth),
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
    },
    subtitle: {
        color: Theme.colors.gray5,
        fontSize: Theme.fonts.small,
        marginBottom: 14
    },
    description: {
        ...Style.cardDescription,
        ...{
            color: Theme.colors.gray5,
            fontSize: Theme.fonts.medium,
            marginBottom: 32,
            textAlign: "center",
        }
    }
})

interface RecentTeachingInput {
    teaching: NonNullable<LoadSermonResult['items']>[0];
}

export default function RecentTeaching({ teaching }: RecentTeachingInput): JSX.Element {
    //console.log("RecentTeaching.render(): props = ", props)

    const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Main'>>();
    if (!teaching) {
        return <View />;
    }

    const series = teaching.series || { title: "" };
    const seriesImageUri = series.title
        ? `https://themeetinghouse.com/static/photos/series/adult-sunday-${teaching?.series?.title?.replace("?", "")}.jpg`
        : "https://www.themeetinghouse.com/static/NoCompassionLogo.png";

    let teachingImage = null;
    if (teaching?.Youtube?.snippet?.thumbnails?.standard) {
        teachingImage = teaching.Youtube.snippet.thumbnails.standard;
    }

    const openNotes = () => {
        navigation.navigate("NotesScreen", { date: moment(teaching.publishedDate as string).format("YYYY-MM-DD") })
    }

    return (
        <View style={style.container}>
            {teachingImage?.url ?
                <View style={{ width: '100%' }}>
                    <Image style={style.teachingImage} source={{ uri: teachingImage.url }}></Image>
                    <Image style={[style.seriesImage, style.seriesImageWithTeachingImage]} source={{ uri: seriesImageUri }}></Image>
                </View>
                : <Image style={style.seriesImage} source={{ uri: seriesImageUri }}></Image>
            }
            <Text style={style.episodeNumber}>Week {teaching.episodeNumber}</Text>
            <Text style={style.title}>{teaching.episodeTitle}</Text>
            <Text style={style.subtitle}>{moment(teaching.publishedDate as string).format("MMMM D, YYYY")}</Text>
            <Text style={style.description}>{teaching.description}</Text>
            <View>
                <IconButton icon={Theme.icons.white.notes} label="Notes" onPress={openNotes}></IconButton>
            </View>
        </View>
    )
}