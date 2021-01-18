import React, { useLayoutEffect } from 'react';
import { Text, Thumbnail, Content, View } from 'native-base';
import { Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import WhiteButton from '../../components/buttons/WhiteButton';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import { Announcement } from '../../services/AnnouncementService';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      padding: 16,
    },
  },
  header: Style.header,
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerBody: {
    flexGrow: 3,
    justifyContent: 'center',
  },
  headerRight: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerTitle: {
    ...HeaderStyle.title,
    ...{
      width: '100%',
    },
  },
  title: {
    ...Style.title,
    ...{
      marginTop: 140,
      marginBottom: 16,
    },
  },
  body: {
    ...Style.body,
    ...{
      marginBottom: 40,
    },
  },
});

interface Props {
  navigation: StackNavigationProp<HomeStackParamList>;
  route: RouteProp<HomeStackParamList, 'AnnouncementDetailsScreen'>;
}

export default function AnnouncementDetailScreen({
  navigation,
  route,
}: Props): JSX.Element {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Announcement',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Thumbnail
              square
              source={Theme.icons.white.closeCancel}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return <View style={{ flex: 1 }} />;
      },
    });
  }, [navigation]);

  const announcementItem: Announcement = route.params?.item;
  const parseUrl = () => {
    if (announcementItem?.callToAction) {
      if (announcementItem?.callToAction.includes('https://')) {
        return announcementItem?.callToAction;
      }
      return `https://${announcementItem.callToAction}`;
    }
    return '';
  };
  return (
    <>
      {announcementItem?.image ? (
        <>
          <Image
            style={{
              top: 0,
              position: 'absolute',
              height: 200,
              width: Dimensions.get('window').width,
            }}
            source={{ uri: announcementItem?.image }}
          />
          <LinearGradient
            colors={['rgba(0,0,0, 0.05)', 'rgba(0,0,0, 0.9)']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 200,
            }}
          />
        </>
      ) : null}
      <Content style={style.content}>
        <Text style={style.title}>{announcementItem?.title}</Text>
        <Text style={style.body}>{announcementItem?.description}</Text>
        {announcementItem?.callToAction ? (
          <WhiteButton
            style={{ height: 56, marginBottom: 40, marginTop: 40 }}
            label={
              announcementItem?.callToActionTitle
                ? announcementItem?.callToActionTitle
                : 'Attend'
            }
            onPress={() => {
              Linking.openURL(parseUrl());
            }}
          />
        ) : null}
      </Content>
    </>
  );
}
