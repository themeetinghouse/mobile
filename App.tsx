import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import React, { useEffect, useState, createRef, useRef } from "react";
import { Platform, StatusBar, ViewStyle } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import LocationsService from "./services/LocationsService";
import { Auth } from "@aws-amplify/auth";
import Amplify from "@aws-amplify/core";
import UserContext, { UserData } from "./contexts/UserContext";
import CommentContext, { CommentContextType } from "./contexts/CommentContext";
import LocationContext, { LocationData } from "./contexts/LocationContext";
import MiniPlayerStyleContext from "./contexts/MiniPlayerStyleContext";
import MediaContext, { MediaData } from "./contexts/MediaContext";
import {
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import MiniPlayer from "./components/MiniPlayer";
import * as SecureStore from "expo-secure-store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Sentry from "sentry-expo";
import { version } from "./version";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as Constants from "expo-constants";
import { Subscription } from "@unimodules/core";

Sentry.init({
  dsn:
    "https://1063e7581bd847c686c2482a582c9e45@o390245.ingest.sentry.io/5397756",
  enableInExpoDevelopment: true,
  debug: false,
  environment: "prod",
  release: version.git,
});
Amplify.configure({
  aws_project_region: "us-east-1",
  aws_cognito_identity_pool_id:
    "us-east-1:d3da58ee-46b8-4b00-aa3a-a14c37b64aa7",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_KiJzP2dH5",
  aws_user_pools_web_client_id: "3pf37ngd57hsk9ld12aha9bm2f",
  oauth: {},
  federationTarget: "COGNITO_IDENTITY_POOLS",
  aws_appsync_graphqlEndpoint:
    "https://qt6manqtzbhkvd6tcxvchusmyq.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-6zfuocqmhvecrfkng7hx2oipni",
  aws_cloud_logic_custom: [
    {
      name: "image",
      endpoint:
        "https://95i5crqja0.execute-api.us-east-1.amazonaws.com/tmhprod",
      region: "us-east-1",
    },
  ],
  aws_content_delivery_bucket:
    "heeetingouse-20190312104205-hostingbucket-tmhprod",
  aws_content_delivery_bucket_region: "us-east-1",
  aws_content_delivery_url: "https://d3ovx9jsa9o5gy.cloudfront.net",
  aws_mobile_analytics_app_id: "20b026ebefc445dd82e5a853dff62770",
  aws_mobile_analytics_app_region: "us-east-1",
  aws_user_files_s3_bucket:
    "themeetinghouse-usercontentstoragetmhusercontent-tmhprod",
  aws_user_files_s3_bucket_region: "us-east-1",
});

interface Props {
  skipLoadingScreen?: boolean;
}

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "black",
  },
};

function App(props: Props): JSX.Element {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [userData, setUserData] = useState<UserData>(null);
  const [locationData, setLocationData] = useState<LocationData>(null);
  const [media, setMedia] = useState<MediaData>({
    playerType: "none",
    playing: false,
    audio: null,
    video: null,
    videoTime: 0,
    episode: "",
    series: "",
  });
  const [currentScreen, setCurrentScreen] = useState("HomeScreen");
  const [display, setDisplay] = useState<ViewStyle["display"]>("flex");
  const [comments, setComments] = useState<CommentContextType["comments"]>([]);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef() as React.MutableRefObject<Subscription>;

  const navRef = createRef<NavigationContainerRef>();
  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.default.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log(token);
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }
  const setVideoTime = (data: number) => {
    setMedia((prevState) => {
      return { ...prevState, videoTime: data };
    });
  };

  const closeAudio = () => {
    setMedia((prevState) => {
      return { ...prevState, audio: null, playing: false, playerType: "none" };
    });
  };

  const closeVideo = () => {
    setMedia((prevState) => {
      return { ...prevState, video: null, playing: false, playerType: "none" };
    });
  };

  const setAudioNull = () => {
    setMedia((prevState) => {
      return { ...prevState, audio: null };
    });
  };

  const setPlayerTypeNone = () => {
    setMedia((prevState) => {
      return { ...prevState, playerType: "none" };
    });
  };

  const handleRouteChange = () => {
    const screen = navRef.current?.getCurrentRoute()?.name;
    setCurrentScreen(screen ?? "unknown");
  };
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification: any) => {
        setNotification(notification);
      }
    );
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, []);
  useEffect(() => {
    async function checkForUser() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        console.debug(user);
        if (user.attributes.email_verified) {
          setUserData(user.attributes);
        }
        if (user.attributes["custom:home_location"]) {
          const selectedLocation = LocationsService.mapLocationIdToName(
            user.attributes["custom:home_location"]
          );
          setLocationData({
            locationId: user.attributes["custom:home_location"],
            locationName: selectedLocation,
          });
        }
      } catch (e) {
        console.debug(e);
        setLocationData({ locationId: "unknown", locationName: "unknown" });
        try {
          const location = await SecureStore.getItemAsync("location");
          if (location) {
            const selectedLocation = LocationsService.mapLocationIdToName(
              location
            );
            setLocationData({
              locationId: location,
              locationName: selectedLocation,
            });
          }
        } catch (e) {
          console.debug(e);
        }
      }
    }
    checkForUser();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        onError={(error) => {
          console.log(error);
        }}
        startAsync={loadResourcesAsync}
        onFinish={() => setLoadingComplete(true)}
      />
    );
  } else {
    return (
      <CommentContext.Provider value={{ comments, setComments }}>
        <MiniPlayerStyleContext.Provider value={{ display, setDisplay }}>
          <MediaContext.Provider
            value={{
              media,
              setMedia,
              setVideoTime,
              closeAudio,
              setAudioNull,
              closeVideo,
              setPlayerTypeNone,
            }}
          >
            <LocationContext.Provider value={{ locationData, setLocationData }}>
              <UserContext.Provider value={{ userData, setUserData }}>
                <SafeAreaProvider style={{ backgroundColor: "black" }}>
                  {Platform.OS === "ios" && (
                    <StatusBar barStyle="light-content" />
                  )}
                  <NavigationContainer
                    theme={CustomTheme}
                    ref={navRef}
                    onStateChange={handleRouteChange}
                  >
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
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      "Graphik-Regular-App": require("./assets/fonts/Graphik-Regular-App.ttf"),
      "Graphik-Medium-App": require("./assets/fonts/Graphik-Medium-App.ttf"),
      "Graphik-Bold-App": require("./assets/fonts/Graphik-Bold-App.ttf"),
      "Graphik-Semibold-App": require("./assets/fonts/Graphik-Semibold-App.ttf"),
      "Graphik-RegularItalic": require("./assets/fonts/Graphik-RegularItalic.otf"),
    }),
  ]);
}
