import React from 'react';
import { View, Text, Thumbnail } from 'native-base';
import Theme, { Style } from '../../Theme.style';
import { Image, TouchableOpacity } from 'react-native';
import moment from 'moment';

const style = {
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    thumbnail: {
        width: 158,
        height: 88,
        flexShrink: 0,
    },
    title: {
        fontFamily: Theme.fonts.fontFamilySemiBold,
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.white,
        flexWrap: 'wrap',
        lineHeight: 20,
    },
    detailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 16,
        flexWrap: 'nowrap',
        flexShrink: 1,
    },
    detailText1: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.small,
        color: Theme.colors.white,
        marginTop: 1,
    },
    detailText2: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.small,
        color: Theme.colors.gray5,
        marginTop: 1,
    },
}
export default function TeachingListItem({ teaching, handlePress }) {
    //console.log("TeachingListItem(): teaching = ", teaching);
    let imageUrl = "";
    if (teaching.Youtube.snippet.thumbnails.standard) {
        imageUrl = teaching.Youtube.snippet.thumbnails.standard.url;
    } else if (teaching.Youtube.snippet.thumbnails.high){
        imageUrl = teaching.Youtube.snippet.thumbnails.high.url;
    }
    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={style.container}>
                <Image style={style.thumbnail} source={{uri: imageUrl}}></Image>
                {/* <Thumbnail style={style.thumbnail} source={teaching.thumbnail} square ></Thumbnail> */}
                <View style={style.detailsContainer}>
                    <Text style={style.title}>{teaching.episodeTitle}</Text>
                    <Text style={style.detailText1}>E{teaching.episodeNumber}, {teaching.seriesTitle}</Text>
                    <Text style={style.detailText2}>{moment(teaching.publishedDate).format("MMMM, D, YYYY")}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}