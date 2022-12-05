import React, { useState, memo } from 'react';
import { View, StyleSheet, Text, Image, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import CachedImage from 'react-native-expo-cached-image';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import { Theme, Style } from '../../Theme.style';
import ActivityIndicator from '../ActivityIndicator';
import { TMHPerson } from '../../../src/services/API';

const style = StyleSheet.create({
  container: {
    marginTop: 6,
    padding: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomLeftRadius: 25,
    borderBottomColor: '#1a1a1a',
    borderColor: 'gray',
  },
  pictureContainer: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 16,
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
    lineHeight: 16,
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
  staff: TMHPerson;
}

function StaffItem({ staff }: Props): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [isLoading, setIsLoading] = useState(true);
  const [uri, setUri] = useState(staff.image);
  const uriError = () => {
    setUri(Theme.icons.white.user);
  };

  const renderStaffImage = () => {
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
    <View style={style.container}>
      <View style={style.pictureContainer}>
        {isLoading ? (
          <ActivityIndicator
            style={style.pictureIndicator}
            animating={isLoading}
          />
        ) : null}
        {renderStaffImage()}
      </View>
      <View style={{ flexDirection: 'column' }}>
        {staff.firstName && staff.lastName ? (
          <Text testID="staff-name" style={style.Name}>
            {staff.firstName} {staff.lastName}
          </Text>
        ) : null}
        {staff.position ? (
          <Text testID="staff-position" style={style.Position}>
            {staff.position}
          </Text>
        ) : null}
        {staff.isTeacher === 'true' ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TeacherProfile', {
                staff,
              });
            }}
          >
            <Text style={style.footerText}>View Teaching</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          {staff.phone ? (
            <TouchableOpacity
              testID="tel-btn"
              accessibilityRole="button"
              accessibilityLabel={`Call ${staff.firstName} ${staff.lastName}, open phone dialer`}
              onPress={() =>
                Linking.openURL(
                  `tel:${staff.phone}${
                    staff?.extension ? `,${staff.extension}` : ''
                  }`
                )
              }
              style={style.iconContainer}
            >
              <Image style={style.icon} source={Theme.icons.white.phone} />
            </TouchableOpacity>
          ) : null}
          {staff.email ? (
            <TouchableOpacity
              testID="email-btn"
              accessibilityLabel={`Email ${staff.firstName} ${staff.lastName}, open email client`}
              onPress={() => Linking.openURL(`mailto:${staff.email}`)}
              style={style.iconContainer}
            >
              <Image style={style.icon} source={Theme.icons.white.contact} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default memo(StaffItem);
