import { Thumbnail } from 'native-base';
import React, { useState, memo, useLayoutEffect, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import CachedImage from 'react-native-expo-cached-image';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MoreStackParamList } from 'src/navigation/MainTabNavigator';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import SearchBar from '../../components/SearchBar';
import TeachingListItem from '../../components/teaching/TeachingListItem';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { runGraphQLQuery } from '../../services/ApiService';
import ActivityIndicator from '../../components/ActivityIndicator';
import AllButton from '../../components/buttons/AllButton';
import StaffDirectoryService from '../../services/StaffDirectoryService';
import { listSpeakersQuery } from '../../graphql/queries';

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fallbackPictureContainer: {
    backgroundColor: '#54565A',
    borderRadius: 100,
    width: 120,
    height: 120,
    padding: 45,
  },
  fallBackPicture: {
    height: 30,
    width: 30,
  },
  pictureContainer: {
    marginTop: 30,
    flexDirection: 'row',
    borderRadius: 100,
    alignSelf: 'center',
    width: 120,
    height: 120,
  },
  picture: {
    borderRadius: 100,
    width: 120,
    height: 120,
  },
  Name: {
    marginTop: 24,
    color: 'white',
    fontSize: 24,
    lineHeight: 32,
    fontFamily: Theme.fonts.fontFamilyBold,
    textAlign: 'center',
  },
  Position: {
    textAlign: 'center',
    marginTop: 2,
    color: '#C8C8C8',
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  icon: { ...Style.icon, width: 23, height: 23 },
  iconContainer: {
    justifyContent: 'center',
    padding: 16,
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
    flex: 1,
  },
});

interface Props {
  navigation: StackNavigationProp<MainStackParamList>;
  route: RouteProp<MoreStackParamList, 'TeacherProfile'>;
}

function TeacherProfile({ navigation, route }: Props): JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [teachings, setTeachings] = useState<any>({
    items: [],
    nextToken: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCount, setShowCount] = useState(20);
  const [nextToken, setNextToken] = useState(null);
  const [uri, setUri] = useState(route.params?.staff?.uri);
  const [teacherData, setTeacherData] = useState({
    Phone: '',
    Email: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: 'black' },
      headerLeft: function render() {
        return (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingRight: 12,
              paddingBottom: 12,
              paddingTop: 12,
            }}
          >
            <Thumbnail
              square
              source={Theme.icons.white.back}
              style={{ width: 24, height: 24 }}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                transform: [{ translateX: -4 }],
              }}
            />
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return (
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              {teacherData.Phone !== '' ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${teacherData.Phone}`)}
                  style={style.iconContainer}
                >
                  <Thumbnail
                    style={style.icon}
                    source={Theme.icons.white.phone}
                    square
                  />
                </TouchableOpacity>
              ) : null}
              {teacherData.Email !== '' ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${teacherData.Email}`)}
                  style={style.iconContainer}
                >
                  <Thumbnail
                    style={style.icon}
                    source={Theme.icons.white.contact}
                    square
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        );
      },
    });
  }, [navigation, teacherData.Email, teacherData.Phone]);

  const uriError = () => {
    setUri(Theme.icons.white.user);
  };

  useEffect(() => {
    const nameOrId = () => {
      if (route.params?.staff.idFromTeaching)
        return route.params?.staff.idFromTeaching.toString();
      return `${route.params?.staff.FirstName} ${route.params?.staff.LastName}`.toString();
    };

    const loadSpeakerData = async () => {
      try {
        const staffData = await StaffDirectoryService.loadStaffJson();
        const teacher = staffData.filter(
          (a: any) => `${a.FirstName} ${a.LastName}` === nameOrId()
        )?.[0];
        if (teacher)
          setTeacherData({
            Email: teacher.Email,
            Phone: teacher.Phone,
          });
      } catch (error) {
        console.log(error);
      }
    };
    const loadSpeakerVideos = async () => {
      setIsLoading(true);
      try {
        const queryResult = await runGraphQLQuery({
          query: listSpeakersQuery,
          variables: { nextToken, filter: { id: { eq: nameOrId() } } },
        });
        setTeachings({
          items: teachings.items.concat(
            queryResult.listSpeakers.items[0].videos.items
          ),
        });
        setUri(queryResult.listSpeakers.items[0].image);
        setNextToken(queryResult.listSpeakers.items[0].videos.nextToken);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    loadSpeakerVideos();
    loadSpeakerData();
  }, []);

  const renderImage = () => {
    if (uri && uri !== Theme.icons.white.user) {
      if (Platform.OS === 'android') {
        return (
          <CachedImage
            onLoadEnd={() => setIsLoading(false)}
            style={style.picture}
            onError={() => {
              uriError();
            }}
            source={{ uri }}
          />
        );
      }

      return (
        <Image
          onLoadEnd={() => setIsLoading(false)}
          style={style.picture}
          onError={() => {
            setIsLoading(false);
            uriError();
          }}
          source={{ uri, cache: 'default' }}
        />
      );
    }

    return (
      <View style={style.fallbackPictureContainer}>
        <Image style={style.fallBackPicture} source={Theme.icons.white.user} />
      </View>
    );
  };

  return (
    <View style={style.container}>
      <View
        style={{
          position: 'absolute',
          zIndex: 5,
          alignSelf: 'center',
          top: '45%',
        }}
      >
        <ActivityIndicator animating={isLoading} />
      </View>
      <ScrollView>
        <View>
          <View style={style.pictureContainer}>{renderImage()}</View>
          <Text style={style.Name}>
            {route.params?.staff.idFromTeaching
              ? route.params?.staff.idFromTeaching
              : route.params?.staff.FirstName}{' '}
            {route.params?.staff.LastName}
          </Text>
          <Text style={style.Position}>{route.params?.staff.Position}</Text>
        </View>
        <SearchBar
          style={style.searchBar}
          searchText={searchText}
          handleTextChanged={(newStr) => setSearchText(newStr)}
          placeholderLabel="Search sermons..."
        />
        <View style={style.listContentContainer}>
          {teachings.items.length > 0
            ? teachings.items
                .filter(
                  (a: any) =>
                    searchText === '' ||
                    a?.video?.episodeTitle
                      ?.toLowerCase()
                      .includes(searchText.toLowerCase()) ||
                    a?.video?.seriesTitle
                      ?.toLowerCase()
                      .includes(searchText.toLowerCase())
                )
                .map((item: any, index: number) => {
                  if (index < showCount) {
                    return (
                      <TeachingListItem
                        key={item.id}
                        teaching={item.video}
                        handlePress={() =>
                          navigation.navigate('SermonLandingScreen', {
                            item: item.video,
                          })
                        }
                      />
                    );
                  }

                  return null;
                })
            : null}
        </View>
        {teachings?.items?.filter(
          (a: any) =>
            searchText === '' ||
            a?.video?.episodeTitle
              ?.toLowerCase()
              .includes(searchText.toLowerCase()) ||
            a?.video?.seriesTitle
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
        ).length > 20 &&
        showCount <
          teachings?.items?.filter(
            (a: any) =>
              searchText === '' ||
              a?.video?.episodeTitle
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              a?.video.seriesTitle
                ?.toLowerCase()
                .includes(searchText.toLowerCase())
          ).length ? (
          <View style={{ marginBottom: 10 }}>
            <AllButton handlePress={() => setShowCount(showCount + 20)}>
              Load More
            </AllButton>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

export default memo(TeacherProfile);
