import React, { useEffect, useState } from 'react';
import { Text, View } from 'native-base';
import { Image, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Theme, Style } from '../../../Theme.style';
import IconButton from '../../buttons/IconButton';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { GetVideoByVideoTypeQuery, GetVideoByVideoTypeQueryVariables, ModelSortDirection, GetNotesQuery } from '../../../services/API';
import { MainStackParamList } from '../../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ActivityIndicator from '../../../components/ActivityIndicator';
import { API, GraphQLResult, graphqlOperation } from '@aws-amplify/api';
import NotesService from '../../../services/NotesService';

const screenWidth = Dimensions.get('window').width;

const style = StyleSheet.create({
    container: {
        alignItems: "center",
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

type VideoData = NonNullable<NonNullable<GetVideoByVideoTypeQuery['getVideoByVideoType']>['items']>[0]

export default function RecentTeaching(): JSX.Element {

    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
    const [teaching, setTeaching] = useState<VideoData>(null);
    const [note, setNote] = useState<GetNotesQuery['getNotes']>();
    const [fullDescription, setFullDescription] = useState(false);

    function getLastSunday() {
        const lastSunday = moment();
        if (lastSunday.isoWeekday() < 7) {
            lastSunday.isoWeekday(0);
        }
        return lastSunday.format('YYYY-MM-DD');
    }

    useEffect(() => {
        const load = async () => {
            const query: GetVideoByVideoTypeQueryVariables = {
                videoTypes: 'adult-sunday',
                limit: 1,
                sortDirection: ModelSortDirection.DESC
            }
            const json = await API.graphql(graphqlOperation(getVideoByVideoType, query)) as GraphQLResult<GetVideoByVideoTypeQuery>;
            if (json.data?.getVideoByVideoType?.items && json.data?.getVideoByVideoType?.items?.length > 0) {

                const date = json.data.getVideoByVideoType.items[0]?.publishedDate;

                const today = moment();

                if (today.diff(moment(date), 'days') >= 7) {
                    const json2 = await NotesService.loadNotes(getLastSunday());
                    setNote(json2);
                } else {
                    setTeaching(json.data.getVideoByVideoType.items[0]);
                }
            }
        }
        load();
    }, [])


    if (!teaching && !note) {
        return <ActivityIndicator />;
    }

    if (teaching) {
        const series = teaching.series || { title: "" };
        const seriesImageUri = series.title
            ? `https://themeetinghouse.com/static/photos/series/adult-sunday-${teaching?.series?.title?.replace("?", "")}.jpg`
            : "https://www.themeetinghouse.com/static/NoCompassionLogo.png";

        let teachingImage = null;
        if (teaching?.Youtube?.snippet?.thumbnails?.standard) {
            teachingImage = teaching.Youtube.snippet.thumbnails.standard;
        }

        const openNotes = () => {
            navigation.push("NotesScreen", { date: moment(teaching.publishedDate as string).format("YYYY-MM-DD") })
        }

        return (
            <View style={style.container}>
                {teachingImage?.url ?
                    <View style={{ width: '100%' }}>
                        <TouchableWithoutFeedback onPress={() => {
                            navigation.navigate("Main", { screen: "Teaching" });
                            navigation.navigate("SermonLandingScreen", { item: teaching })
                        }} >
                            <Image style={style.teachingImage} source={{ uri: teachingImage.url }} />
                        </TouchableWithoutFeedback>
                        <Image style={[style.seriesImage, style.seriesImageWithTeachingImage]} source={{ uri: seriesImageUri }} />
                    </View>
                    : <Image style={style.seriesImage} source={{ uri: seriesImageUri }}></Image>
                }
                <View style={{ marginHorizontal: 16, alignItems: 'center' }} >
                    <Text style={style.title}>{teaching.episodeTitle}</Text>
                    <Text style={style.subtitle}>{moment(teaching.publishedDate as string).format("MMMM D, YYYY")}</Text>
                    <Text style={style.description} numberOfLines={fullDescription ? undefined : 2} ellipsizeMode='tail' onPress={() => setFullDescription(!fullDescription)}>{teaching.description}</Text>
                </View>
                <View>
                    <IconButton icon={Theme.icons.white.notes} label="Notes" onPress={openNotes}></IconButton>
                </View>
            </View>
        )
    }

    if (note) {
        const seriesImageUri = `https://themeetinghouse.com/static/photos/series/adult-sunday-${note?.seriesId.replace("?", "")}.jpg`

        const openNotes = () => {
            navigation.navigate("NotesScreen", { date: note.id })
        }

        return (
            <View style={style.container}>
                <Image style={style.seriesImage} source={{ uri: seriesImageUri }}></Image>
                <Text style={style.title}>{note.title}</Text>
                <Text style={style.subtitle}>{moment(note.id).format("MMMM D, YYYY")}</Text>
                <Text style={style.description} numberOfLines={fullDescription ? undefined : 2} ellipsizeMode='tail' onPress={() => setFullDescription(!fullDescription)} >{note.episodeDescription}</Text>
                <View>
                    <IconButton icon={Theme.icons.white.notes} label="Notes" onPress={openNotes}></IconButton>
                </View>
            </View>
        )
    }

    return <View />


}

export const getVideoByVideoType = `query GetVideoByVideoType(
    $videoTypes: String
    $publishedDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelVideoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getVideoByVideoType(
      videoTypes: $videoTypes
      publishedDate: $publishedDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        episodeTitle
        episodeNumber
        seriesTitle
        series {
          id
          title
        }
        publishedDate
        description
        length
        viewCount
        YoutubeIdent
        Youtube {
          snippet {
            thumbnails {
              default {
                url
              }
              medium {
                url
              }
              high {
                url
              }
              standard {
                url
              }
              maxres {
                url
              }
            }
          }
        }
        videoTypes
        notesURL
        videoURL
        audioURL
      }
      nextToken
    }
  }
  `;