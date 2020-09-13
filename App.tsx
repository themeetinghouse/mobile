import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { useEffect, useState, createRef } from 'react';
import { Platform, StatusBar, ViewStyle } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import LocationsService from './services/LocationsService';
import { Auth } from '@aws-amplify/auth';
import Amplify from '@aws-amplify/core';
import UserContext, { UserData } from './contexts/UserContext';
import CommentContext, { CommentContextType } from './contexts/CommentContext';
import LocationContext, { LocationData } from './contexts/LocationContext';
import MiniPlayerStyleContext from './contexts/MiniPlayerStyleContext';
import MediaContext, { MediaData } from './contexts/MediaContext';
import { DefaultTheme, NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import MiniPlayer from './components/MiniPlayer';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';
import { version } from './version'

Sentry.init({
  dsn: 'https://1063e7581bd847c686c2482a582c9e45@o390245.ingest.sentry.io/5397756',
  enableInExpoDevelopment: true,
  debug: false,
  environment: "prod",
  release: version.git
});
Amplify.configure({
  Auth: {
    identityPoolId: 'us-east-1:d3da58ee-46b8-4b00-aa3a-a14c37b64aa7',
    region: 'us-east-1',
    userPoolId: 'us-east-1_KiJzP2dH5',
    userPoolWebClientId: '3pf37ngd57hsk9ld12aha9bm2f',
  },
  aws_appsync_graphqlEndpoint: "https://qt6manqtzbhkvd6tcxvchusmyq.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-6zfuocqmhvecrfkng7hx2oipni",
});

interface Props {
  skipLoadingScreen?: boolean;
}

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'black'
  }
}

function App(props: Props): JSX.Element {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [userData, setUserData] = useState<UserData>(null)
  const [locationData, setLocationData] = useState<LocationData>(null);
  const [media, setMedia] = useState<MediaData>({ playerType: 'none', playing: false, audio: null, video: null, videoTime: 0, episode: '', series: '' });
  const [currentScreen, setCurrentScreen] = useState('HomeScreen');
  const [display, setDisplay] = useState<ViewStyle['display']>('flex');
  const [comments, setComments] = useState<CommentContextType['comments']>([]);

  const navRef = createRef<NavigationContainerRef>();

  const setVideoTime = (data: number) => {
    setMedia(prevState => { return { ...prevState, videoTime: data } })
  }

  const closeAudio = () => {
    setMedia(prevState => { return { ...prevState, audio: null, playing: false, playerType: 'none' } })
  }

  const closeVideo = () => {
    setMedia(prevState => { return { ...prevState, video: null, playing: false, playerType: 'none' } })
  }

  const setAudioNull = () => {
    setMedia(prevState => { return { ...prevState, audio: null } })
  }

  const setPlayerTypeNone = () => {
    setMedia(prevState => { return { ...prevState, playerType: 'none' } })

  }

  useEffect(() => {
    const unsub = navRef?.current?.addListener('state', () => {
      const screen = navRef.current?.getCurrentRoute()?.name;
      if (screen)
        setCurrentScreen(screen);
    })
    return unsub;
  }, [navRef])

  useEffect(() => {
    async function checkForUser() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        console.debug(user);
        if (user.attributes.email_verified) {
          setUserData(user.attributes)
        }
        if (user.attributes['custom:home_location']) {
          const selectedLocation = LocationsService.mapLocationIdToName(user.attributes['custom:home_location']);
          setLocationData({ locationId: user.attributes['custom:home_location'], locationName: selectedLocation });
        }
      } catch (e) {
        console.debug(e)
        setLocationData({ locationId: "unknown", locationName: "unknown" });
        try {
          const location = await SecureStore.getItemAsync('location')
          if (location) {
            const selectedLocation = LocationsService.mapLocationIdToName(location);
            setLocationData({ locationId: location, locationName: selectedLocation });
          }
        } catch (e) {
          console.debug(e)
        }
      }
    }
    checkForUser();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onFinish={() => setLoadingComplete(true)}
      />
    );
  } else {
    return (
      <CommentContext.Provider value={{ comments, setComments }} >
        <MiniPlayerStyleContext.Provider value={{ display, setDisplay }} >
          <MediaContext.Provider value={{ media, setMedia, setVideoTime, closeAudio, setAudioNull, closeVideo, setPlayerTypeNone }}>
            <LocationContext.Provider value={{ locationData, setLocationData }}>
              <UserContext.Provider value={{ userData, setUserData }}>
                <SafeAreaProvider style={{ backgroundColor: 'black' }} >
                  {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                  <NavigationContainer theme={CustomTheme} ref={navRef} >
                    <AppNavigator />
                    <MiniPlayer currentScreen={currentScreen} />
                  </NavigationContainer>
                </SafeAreaProvider>
              </UserContext.Provider>
            </LocationContext.Provider>
          </MediaContext.Provider>
        </MiniPlayerStyleContext.Provider>
      </CommentContext.Provider>
    );
  }
}

export default App;

async function loadResourcesAsync() {
  await Promise.all([
    /*Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),*/
    Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      'Graphik-Regular-App': require('./assets/fonts/Graphik-Regular-App.ttf'),
      'Graphik-Medium-App': require('./assets/fonts/Graphik-Medium-App.ttf'),
      'Graphik-Bold-App': require('./assets/fonts/Graphik-Bold-App.ttf'),
      'Graphik-Semibold-App': require('./assets/fonts/Graphik-Semibold-App.ttf'),
      'Graphik-RegularItalic': require('./assets/fonts/Graphik-RegularItalic.otf')
    }),
  ]);
}