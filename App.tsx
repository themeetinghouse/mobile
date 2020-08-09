import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './navigation/AppNavigator';
import { Root } from 'native-base';
import LocationsService from './services/LocationsService';
import Amplify, { Auth } from 'aws-amplify';
import UserContext, { UserData } from './contexts/UserContext';
import LocationContext, { LocationData } from './contexts/LocationContext';
import { NavigationContainer } from '@react-navigation/native'

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

function App(props: Props): JSX.Element {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [userData, setUserData] = useState<UserData>(null)
  const [locationData, setLocationData] = useState<LocationData>(null);

  /*useEffect(() => {
    const setInitialAppState = async () => {
      const selectedLocation = await LocationsService.getLocationById("oakville");
      props.dispatch(selectLocation(selectedLocation));
    }
    setInitialAppState();
  }, [])*/

  useEffect(() => {
    async function checkForUser() {
      try {
        const user = await Auth.currentAuthenticatedUser()
        if (user.attributes.email_verified) {
          setUserData(user.attributes)
        }

        if (user.attributes['custom:home_location']) {
          const selectedLocation = await LocationsService.getLocationById(user.attributes['custom:home_location']);
          setLocationData(selectedLocation);
        } else {
          const selectedLocation = await LocationsService.getLocationById("oakville");
          setLocationData(selectedLocation);
        }
      } catch (e) {
        console.debug(e)
        const selectedLocation = await LocationsService.getLocationById("oakville");
        setLocationData(selectedLocation);
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
      <LocationContext.Provider value={{ locationData, setLocationData }}>
        <UserContext.Provider value={{ userData, setUserData }}>
          <Root>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </Root>
        </UserContext.Provider>
      </LocationContext.Provider>
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