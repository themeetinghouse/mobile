import React, { useState, useLayoutEffect, useEffect } from 'react';
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
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import SearchBar from '../../components/SearchBar';
import TeachingListItem from '../../components/teaching/TeachingListItem';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { runGraphQLQuery } from '../../services/ApiService';
import ActivityIndicator from '../../components/ActivityIndicator';
import AllButton from '../../components/buttons/AllButton';
import { getSpeaker, listSpeakersQuery } from '../../graphql/queries';
import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { GetSpeakerQuery, ListSpeakersQuery } from 'src/services/API';

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
    marginTop: 30,
    minWidth: Dimensions.get('window').width - 40,
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
  route: RouteProp<MainStackParamList, 'TeacherProfile'>;
}

export default function TeacherProfile({
  navigation,
  route,
}: Props): JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [teachings, setTeachings] = useState<any>({
    items: [],
    nextToken: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCount, setShowCount] = useState(20);
  const [uri, setUri] = useState(route.params?.staff?.uri);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: '',
      headerTitleStyle: style.headerTitle,
      cardShadowEnabled: false,
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        backgroundColor: 'black',
      },
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
            <Image
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
          <View
            style={{
              flexDirection: 'column',
              flex: 1,
              paddingRight: 12,
              paddingBottom: 12,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              {route?.params?.staff?.phone !== '' ? (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${route.params?.staff.phone}`)
                  }
                  style={style.iconContainer}
                >
                  <Image style={style.icon} source={Theme.icons.white.phone} />
                </TouchableOpacity>
              ) : null}
              {route?.params?.staff?.email !== '' ? (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`mailto:${route.params?.staff.email}`)
                  }
                  style={style.iconContainer}
                >
                  <Image
                    style={style.icon}
                    source={Theme.icons.white.contact}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        );
      },
    });
  }, [navigation, route?.params?.staff?.email, route?.params?.staff?.phone]);

  const uriError = () => {
    setUri(Theme.icons.white.user);
  };

  useEffect(() => {
    const nameOrId = (): string => {
      if (route.params?.staff.idFromTeaching)
        return route.params?.staff.idFromTeaching;
      return `${route.params?.staff.firstName} ${route.params?.staff.lastName}`;
    };

    const loadSpeakerVideos = async () => {
      setIsLoading(true);
      try {
        const speakersData = (await API.graphql({
          query: getSpeaker,
          variables: { id: nameOrId() },
        })) as GraphQLResult<GetSpeakerQuery>;
        const speakerItems = speakersData.data?.getSpeaker?.videos?.items ?? [];
        setTeachings({
          items: teachings.items.concat(speakerItems),
        });
        setUri(speakersData.data?.getSpeaker?.image);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSpeakerVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    route.params?.staff.firstName,
    route.params?.staff.lastName,
    route.params?.staff.idFromTeaching,
  ]);

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
            {route.params?.staff.idFromTeaching ??
              route.params?.staff.firstName}{' '}
            {route.params?.staff.lastName}
          </Text>
          <Text style={style.Position}>{route.params?.staff.position}</Text>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <SearchBar
            style={style.searchBar}
            searchText={searchText}
            handleTextChanged={(newStr) => setSearchText(newStr)}
            placeholderLabel="Search sermons..."
          />
        </View>

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
            <AllButton onPress={() => setShowCount(showCount + 20)}>
              Load More
            </AllButton>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
