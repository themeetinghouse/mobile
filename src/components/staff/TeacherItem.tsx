import { Thumbnail } from 'native-base';
import React, { useState, memo } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
} from 'react-native';

import * as Linking from 'expo-linking';
import CachedImage from 'react-native-expo-cached-image';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { Theme, Style } from '../../Theme.style';
import ActivityIndicator from '../ActivityIndicator';

const style = StyleSheet.create({
  container: {
    marginTop: 6,
    padding: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomLeftRadius: 25,
    borderColor: 'gray',
  },
  pictureContainer: {
    marginTop: 0,
    marginHorizontal: 16,
    borderRadius: 100,
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picture: {
    borderRadius: 100,
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  pictureIndicator: {
    position: 'absolute',
    zIndex: 3000,
    borderRadius: 100,
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  fallbackPictureContainer: {
    backgroundColor: '#54565A',
    borderRadius: 100,
    padding: 12,
  },
  fallBackPicture: {
    height: 23,
    width: 23,
  },
  Name: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Theme.fonts.fontFamilyBold,
  },
  Position: {
    marginTop: 2,
    maxWidth: '65%',
    minWidth: '65%',
    color: 'white',
    fontFamily: Theme.fonts.fontFamilyRegular,
    fontSize: 12,
  },
  footerText: {
    marginTop: 8,
    color: 'white',
    textDecorationLine: 'underline',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
  },
  icon: { ...Style.icon, width: 23, height: 23 },
  iconContainer: {
    justifyContent: 'center',
    padding: 16,
  },
});
interface Props {
  teacher: any;
}

function TeacherItem({ teacher }: Props): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [isLoading, setIsLoading] = useState(true);
  const [uri, setUri] = useState(teacher.image);
  const uriError = () => {
    setUri(Theme.icons.white.user);
  };

  const renderTeacherImage = () => {
    if (uri && uri !== Theme.icons.white.user) {
      if (Platform.OS === 'android') {
        return (
          <CachedImage
            testID="android-image"
            onLoadEnd={() => setIsLoading(false)}
            style={style.picture}
            onError={() => {
              setIsLoading(false);
              uriError();
            }}
            source={{ uri }}
          />
        );
      }
      return (
        <Image
          testID="ios-image"
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
        <Image
          style={style.fallBackPicture}
          source={Theme.icons.white.user}
          testID="fallback-image"
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      testID="go-to-teacher"
      onPress={() => {
        navigation.navigate('TeacherProfile', {
          staff: { idFromTeaching: teacher.id },
        });
      }}
    >
      <View style={style.container}>
        <View style={style.pictureContainer}>
          {isLoading ? (
            <ActivityIndicator
              style={style.pictureIndicator}
              animating={isLoading}
            />
          ) : null}
          {renderTeacherImage()}
        </View>
        <View style={{ flexDirection: 'column' }}>
          {teacher.name ? (
            <Text style={style.Name} testID="teacher-name">
              {teacher.name}
            </Text>
          ) : null}

          <Text style={style.Position}>{teacher.Position ?? 'Friend'}</Text>
          <Text style={style.footerText}>View Teaching</Text>
        </View>
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            {teacher.Phone ? (
              <TouchableOpacity
                testID="tel-btn"
                onPress={() => Linking.openURL(`tel:${teacher.Phone}`)}
                style={style.iconContainer}
              >
                <Thumbnail
                  style={style.icon}
                  source={Theme.icons.white.phone}
                  square
                />
              </TouchableOpacity>
            ) : null}
            {teacher.Email ? (
              <TouchableOpacity
                testID="email-btn"
                onPress={() => Linking.openURL(`mailto:${teacher.Email}`)}
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
      </View>
    </TouchableOpacity>
  );
}
export default memo(TeacherItem);
