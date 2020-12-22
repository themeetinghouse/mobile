import React, { useEffect, useState } from "react";
import { View, Text, Thumbnail } from "native-base";
import Theme from "../../Theme.style";
import { Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import moment from "moment";
import { LoadSermonResult } from "../../services/SermonsService";
import {
  GetCommentsByOwnerQueryVariables,
  GetCommentsByOwnerQuery,
} from "services/API";
import API, { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import Auth from "@aws-amplify/auth";
import { TMHCognitoUser } from "contexts/UserContext";

const imageWidth = 0.42 * Dimensions.get("screen").width;

const style = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
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
    flexWrap: "wrap",
    maxWidth: imageWidth,
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 16,
    flexWrap: "nowrap",
    flexGrow: 1,
  },
  detailText1: {
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: Theme.fonts.small,
    color: Theme.colors.white,
    lineHeight: 18,
    flexWrap: "wrap",
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
  handlePress: () => any;
  teaching: NonNullable<LoadSermonResult["items"]>[0];
}

export default function TeachingListItem({
  teaching,
  handlePress,
}: Params): JSX.Element {
  const [hasComments, setHasComments] = useState(false);
  useEffect(() => {
    const getComments = async () => {
      try {
        const cognitoUser: TMHCognitoUser = await Auth.currentAuthenticatedUser();
        const input: GetCommentsByOwnerQueryVariables = {
          owner: cognitoUser.username,
          noteId: { eq: teaching?.publishedDate },
        };
        const json = (await API.graphql({
          query: getCommentsByOwner,
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
  }, []);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={style.container}>
        <Image
          style={style.thumbnail}
          source={{
            uri:
              teaching?.Youtube?.snippet?.thumbnails?.standard?.url ??
              teaching?.Youtube?.snippet?.thumbnails?.high?.url ??
              "https://www.themeetinghouse.com/static/photos/series/series-fallback-app.jpg",
          }}
        />
        <View style={style.detailsContainer}>
          <Text style={style.title}>{teaching?.episodeTitle}</Text>
          <Text style={style.detailText1}>
            {teaching?.episodeNumber ? `E${teaching?.episodeNumber},` : ""}{" "}
            {teaching?.seriesTitle}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {teaching?.publishedDate ? (
              <Text style={style.detailText2}>
                {moment(teaching?.publishedDate).format("MMMM, D, YYYY")}
              </Text>
            ) : null}
            {hasComments ? (
              <Thumbnail
                square
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
