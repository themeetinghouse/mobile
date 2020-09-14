import React, { useEffect, useState } from 'react';
import { View, Text, Thumbnail } from 'native-base';
import Theme from '../../Theme.style';
import { Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import { LoadSermonResult } from '../../services/SermonsService';
import { GetCommentsByOwnerQueryVariables, GetCommentsByOwnerQuery } from 'services/API';
import API, { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';

const style = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 16,
    },
    thumbnail: {
        width: 158,
        height: 88,
        flexShrink: 0,
    },
    title: {
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.white,
        flexWrap: 'wrap',
        lineHeight: 18,
        maxWidth: Dimensions.get('screen').width * 0.5
    },
    detailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 16,
        flexWrap: 'nowrap',
        flexGrow: 1,
    },
    detailText1: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.small,
        color: Theme.colors.white,
        lineHeight: 18
    },
    detailText2: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.small,
        color: Theme.colors.gray5,
        lineHeight: 18
    },
})

interface Params {
    handlePress: () => any;
    teaching: NonNullable<LoadSermonResult['items']>[0];
}

export default function TeachingListItem({ teaching, handlePress }: Params): JSX.Element {
    const [hasComments, setHasComments] = useState(false);

    let imageUrl = "";
    if (teaching?.Youtube?.snippet?.thumbnails?.standard) {
        imageUrl = teaching.Youtube.snippet.thumbnails.standard.url ?? "";
    } else if (teaching?.Youtube?.snippet?.thumbnails?.high) {
        imageUrl = teaching.Youtube.snippet.thumbnails.high.url ?? "";
    }


    useEffect(() => {
        const getComments = async () => {
            try {
                const cognitoUser = await Auth.currentAuthenticatedUser();
                const input: GetCommentsByOwnerQueryVariables = {
                    owner: cognitoUser.username,
                    noteId: { eq: teaching?.publishedDate },
                }
                const json = await API.graphql({
                    query: getCommentsByOwner,
                    variables: input,
                    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
                }) as GraphQLResult<GetCommentsByOwnerQuery>;

                if (json.data?.getCommentsByOwner?.items && json.data?.getCommentsByOwner?.items?.length > 0)
                    setHasComments(true)
            } catch (e) {
                console.error(e)
            }
        }
        getComments();
    }, [])

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={style.container}>
                <Image style={style.thumbnail} source={{ uri: imageUrl }} />
                {/* <Thumbnail style={style.thumbnail} source={teaching.thumbnail} square ></Thumbnail> */}
                <View style={style.detailsContainer}>
                    <Text style={style.title}>{teaching?.episodeTitle}</Text>
                    <Text style={style.detailText1}>{teaching?.episodeNumber ? `E${teaching?.episodeNumber},` : ''} {teaching?.seriesTitle}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                        {teaching?.publishedDate ?
                            <Text style={style.detailText2}>
                                {moment(teaching?.publishedDate).format("MMMM, D, YYYY")}
                            </Text> : null
                        }
                        {hasComments ? <Thumbnail source={Theme.icons.grey.comment} style={{ width: 12, height: 12 }} /> : null}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const getCommentsByOwner = /* GraphQL */ `
  query GetCommentsByOwner(
    $owner: String
    $noteId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getCommentsByOwner(
      owner: $owner
      noteId: $noteId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
      }
      nextToken
    }
  }
`;