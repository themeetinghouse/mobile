import { Thumbnail } from 'native-base';
import React, { useState, memo, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Linking, Platform, Dimensions } from 'react-native';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import CachedImage from "react-native-expo-cached-image";
import SearchBar from "../../components/SearchBar"
import TeachingListItem from "../../components/teaching/TeachingListItem";
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from "../../navigation/AppNavigator";
import { runGraphQLQuery } from "../../services/ApiService";
import ActivityIndicator from "../../components/ActivityIndicator";
import AllButton from '../../components/buttons/AllButton'

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  pictureContainer: {
    marginTop: 30,
    flexDirection: "row",
    borderRadius: 100,
    backgroundColor: "#54565A",
    alignSelf: "center",
    width: 120,
    height: 120,
  },
  picture: {
    borderRadius: 100,
    width: 120,
    height: 120
  },
  Name: {
    marginTop: 24,
    color: "white",
    fontSize: 24,
    lineHeight: 32,
    fontFamily: Theme.fonts.fontFamilyBold,
    textAlign: "center"
  },
  Position: {
    textAlign: "center",
    marginTop: 2,
    color: "#C8C8C8",
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  icon: { ...Style.icon, width: 23, height: 23, },
  iconContainer: {
    justifyContent: "center",
    padding: 16
  },
  header: Style.header,
  headerTitle: HeaderStyle.title,
  searchBar: {
    width: Dimensions.get('window').width - 16,
  },
  listContentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 24,
    flex: 1
  },
})
interface Props {
  navigation: StackNavigationProp<MainStackParamList>;
  route: any; // not any
}

function TeacherProfile({ navigation, route }: Props): JSX.Element {
  const [searchText, setSearchText] = useState("");
  const [teachings, setTeachings] = useState({ items: [], nextToken: null } as any);
  const [isLoading, setIsLoading] = useState(false);
  const [showCount, setShowCount] = useState(20);
  const [nextToken, setNextToken] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: "black" },
      headerLeft: function render() {
        return <TouchableOpacity onPress={() => navigation.goBack()} style={{ display: 'flex', flexDirection: 'row', paddingRight: 12, paddingBottom: 12, paddingTop: 12 }} >
          <Thumbnail square source={Theme.icons.white.back} style={{ width: 24, height: 24 }} />
          <Text style={{ color: 'white', fontSize: 16, transform: [{ translateX: -4 }] }}></Text>
        </TouchableOpacity>
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return (
          <View style={{ flexDirection: "column", flex: 1, }}>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              {route.params.staff.Phone ?
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${route.params.staff.Phone}`)} style={style.iconContainer}>
                  <Thumbnail style={style.icon} source={Theme.icons.white.phone} square></Thumbnail>
                </TouchableOpacity> : null}
              {route.params.staff.Email ?
                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${route.params.staff.Email}`)} style={style.iconContainer}>
                  <Thumbnail style={style.icon} source={Theme.icons.white.contact} square></Thumbnail>
                </TouchableOpacity>
                : null}
            </View>
          </View>
        )
      }
    })
  }, [navigation])
  const loadSpeakerVideos = async () => {
    setIsLoading(true)
    try {
      const queryResult = await runGraphQLQuery({
        query: listSpeakersQuery,
        variables: { nextToken: nextToken, filter: { id: { eq: (route.params.staff.FirstName + " " + route.params.staff.LastName) } } }
      })
      setTeachings({ items: teachings.items.concat(queryResult.listSpeakers.items[0].videos.items) })
      setNextToken(queryResult.listSpeakers.items[0].videos.nextToken)
      setIsLoading(false);
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    loadSpeakerVideos();
  }, [])
  return (
    <View style={style.container}>
      <View style={{ position: "absolute", zIndex: 5, alignSelf: "center", top: "45%" }}>
        <ActivityIndicator animating={isLoading}></ActivityIndicator>
      </View>
      <ScrollView>
        <View>
          <View style={style.pictureContainer}>
            {Platform.OS === "android" ?
              <CachedImage style={style.picture} source={{ uri: route.params.staff.uri }} />
              :
              <Image style={style.picture} source={{ uri: route.params.staff.uri }} />}
          </View>
          <Text style={style.Name}>{route.params.staff.FirstName} {route.params.staff.LastName}</Text>
          <Text style={style.Position}>{route.params.staff.Position}</Text>
        </View>
        <SearchBar
          style={style.searchBar}
          searchText={searchText}
          handleTextChanged={(newStr) => setSearchText(newStr)}
          placeholderLabel="Search sermons..."></SearchBar>
        <View style={style.listContentContainer}>


          {teachings.items.length > 0 ? teachings.items
            .sort((a: any, b: any) => (a.video.publishedDate > b.video.publishedDate) ? -1 : ((b.video.publishedDate > a.video.publishedDate) ? 1 : 0))
            .filter((a: any) => searchText === "" || a.video.episodeTitle.toLowerCase().includes(searchText.toLowerCase()) || a.video.seriesTitle.toLowerCase().includes(searchText.toLowerCase()))
            .map((item: any, index: number) => {
              if (index < showCount) {
                return <TeachingListItem
                  key={item.id}
                  teaching={item.video}
                  handlePress={() => navigation.navigate('SermonLandingScreen', { item: item.video })} />
              }
            }) : null}


        </View>
        {teachings.items?.filter((a: any) => searchText === "" || a.video.episodeTitle.toLowerCase().includes(searchText.toLowerCase()) || a.video.seriesTitle.toLowerCase().includes(searchText.toLowerCase())).length > 20 && showCount < teachings.items.filter((a: any) => searchText === "" || a.video.episodeTitle.toLowerCase().includes(searchText.toLowerCase()) || a.video.seriesTitle.toLowerCase().includes(searchText.toLowerCase())).length ?

          <View style={{ marginBottom: 10 }}>
            <AllButton handlePress={() => setShowCount(showCount + 20)}>Load More</AllButton>
          </View>
          : null}

      </ScrollView>

    </View >
  )
}
export default memo(TeacherProfile);

export const listSpeakersQuery = `
  query ListSpeakers(
    $filter: ModelSpeakerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSpeakers(filter: $filter, limit: $limit) {
      items {
        id
        name
        image
        videos (limit: 9999, sortDirection:DESC, nextToken: $nextToken) {
          items {
            id
            video{
              publishedDate
              description
              audioURL
              YoutubeIdent
              id
              episodeTitle
              episodeNumber
              seriesTitle
              Youtube{
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
                contentDetails{
                  videoId
                }
              }
            }
          }
          nextToken
        }
      }
      nextToken
    }
  }
  `;