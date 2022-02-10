import React, { useEffect, useState } from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
  Text,
} from 'react-native';
import moment from 'moment';
import API, { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import { LoadSermonResult } from '../../services/SermonsService';
import {
  GetCommentsByOwnerQueryVariables,
  GetCommentsByOwnerQuery,
} from '../../services/API';
import Theme from '../../Theme.style';
import { TMHCognitoUser } from '../../contexts/UserContext';
import { commentExistsQuery } from '../../graphql/queries';

const imageWidth = 0.42 * Dimensions.get('screen').width;

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
  },
  thumbnail: {
    width: imageWidth,
    height: (9 / 16) * imageWidth,
    flexShrink: 0,
  },
  title: {
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.smallMedium,
    color: Theme.colors.white,
    lineHeight: 18,
    flexWrap: 'wrap',
    maxWidth: imageWidth,
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
    lineHeight: 18,
    flexWrap: 'wrap',
    maxWidth: imageWidth,
  },
  detailText2: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.small,
    color: Theme.colors.gray5,
    lineHeight: 18,
  },
});

interface Params {
  handlePress: () => void;
  teaching: NonNullable<LoadSermonResult['items']>[0];
}

export default function TeachingListItem({
  teaching,
  handlePress,
}: Params): JSX.Element {
  const [hasComments, setHasComments] = useState(false);

  useEffect(() => {
    const getComments = async () => {
      try {
        const cognitoUser: TMHCognitoUser =
          await Auth.currentAuthenticatedUser();
        const input: GetCommentsByOwnerQueryVariables = {
          owner: cognitoUser.username,
          noteId: { eq: teaching?.publishedDate },
        };
        const json = (await API.graphql({
          query: commentExistsQuery,
          variables: input,
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        })) as GraphQLResult<GetCommentsByOwnerQuery>;

        if (
          json.data?.getCommentsByOwner?.items &&
          json.data?.getCommentsByOwner?.items?.length > 0
        )
          setHasComments(true);
      } catch (e) {
        console.debug(e);
      }
    };
    getComments();
  }, [teaching?.publishedDate]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={style.container}>
        <Image
          style={style.thumbnail}
          source={{
            uri:
              teaching?.Youtube?.snippet?.thumbnails?.standard?.url ??
              teaching?.Youtube?.snippet?.thumbnails?.high?.url ??
              'https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg',
          }}
        />
        <View style={style.detailsContainer}>
          <Text style={style.title}>{teaching?.episodeTitle}</Text>
          <Text style={style.detailText1}>
            {teaching?.episodeNumber ? `E${teaching?.episodeNumber},` : ''}{' '}
            {teaching?.seriesTitle}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            {teaching?.publishedDate ? (
              <Text style={style.detailText2}>
                {moment(teaching?.publishedDate).format('MMMM, D, YYYY')}
              </Text>
            ) : null}
            {hasComments ? (
              <Image
                source={Theme.icons.grey.comment}
                style={{ width: 12, height: 12 }}
              />
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
