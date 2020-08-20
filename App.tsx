import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import LocationsService, { LocationKey } from './services/LocationsService';
import { Auth } from '@aws-amplify/auth';
import Amplify from '@aws-amplify/core';
import UserContext, { UserData } from './contexts/UserContext';
import LocationContext, { LocationData } from './contexts/LocationContext';
import MediaContext, { MediaData } from './contexts/MediaContext';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MiniPlayer from './components/MiniPlayer';
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
  }
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

  /*useEffect(() => {
    const setInitialAppState = async () => {
      const selectedLocation = await LocationsService.getLocationById("oakville");
      props.dispatch(selectLocation(selectedLocation));
    }
    setInitialAppState();
  }, [])*/

  const setVideoTime = (data: number) => {
    setMedia(prevState => { return { ...prevState, videoTime: data } })
  }

  const setAudioNull = () => {
    setMedia(prevState => { return { ...prevState, audio: null } })
  }

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
        try {
          const location = await SecureStore.getItemAsync('location')
          if (location) {
            const selectedLocation = LocationsService.mapLocationIdToName(location as LocationKey);
            setLocationData({ locationId: location, locationName: selectedLocation });
          }
        } catch (e) {
          console.debug(e)
          setLocationData({ locationId: "", locationName: "" });
        }
      }
    }
    checkForUser();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => setLoadingComplete(true)}
      />
    );
  } else {
    return (
      <MediaContext.Provider value={{ media, setMedia, setVideoTime, setAudioNull }}>
        <LocationContext.Provider value={{ locationData, setLocationData }}>
          <UserContext.Provider value={{ userData, setUserData }}>
            <SafeAreaProvider>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <NavigationContainer theme={CustomTheme}>
                <AppNavigator />
                <MiniPlayer />
              </NavigationContainer>
            </SafeAreaProvider>
          </UserContext.Provider>
        </LocationContext.Provider>
      </MediaContext.Provider>
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
      //This is the font that we are using for our tab bar
      ...Ionicons.font,
    }),
  ]);
}

function handleLoadingError(error: Error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}