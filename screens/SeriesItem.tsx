import React from 'react';
import { Theme } from '../Theme.style';
import { Text } from 'native-base';
import FallbackImage from '../components/FallbackImage';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
const width = Dimensions.get('screen').width;

const style = StyleSheet.create({
    container: {
        marginTop: 6,
        padding: 15,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomLeftRadius: 25,
        borderColor: "gray",
    },
    seriesItem: {
        marginBottom: 20,
        marginTop: 0,
    },
    seriesThumbnail: {
        width: width * 0.44,
        height: width * 0.44 * (1248 / 1056),
    },
    seriesDetail: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.gray5,
        textAlign: 'center',
        marginTop: 8,
    }
})
interface Params {
    navigation: StackNavigationProp<TeachingStackParamList, 'AllSeriesScreen'>;
    seriesData: any;
    year?: string;
    customPlaylist?: boolean;
}
export default function SeriesItem({ navigation, seriesData, year, customPlaylist }: Params): JSX.Element {
    return (
        <TouchableOpacity onPress={() => {
            navigation.push('SeriesLandingScreen', { item: seriesData, seriesId: seriesData.id, customPlaylist: customPlaylist })
        }
        } style={style.seriesItem}>
            <FallbackImage style={style.seriesThumbnail} uri={seriesData.image} catchUri='https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg' />
            {year && !customPlaylist ? <Text style={style.seriesDetail}>{year} &bull; {seriesData.videos.items.length} episodes</Text>
                :
                <Text style={style.seriesDetail}>{seriesData.videos.items.length} episodes</Text>}
        </TouchableOpacity>)
}