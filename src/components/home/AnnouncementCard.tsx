import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { StyleSheet, ImageBackground, View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Theme, { Style } from '../../Theme.style';
import { Announcement } from '../../services/AnnouncementService';

const style = StyleSheet.create({
  cardContainer: {
    height: 375,
    flexWrap: 'nowrap',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 40,
    paddingTop: 40,
    backgroundColor: Theme.colors.gray1,
    borderBottomWidth: 1,
    borderBottomColor: '#313131',
  },
  imageCardContainer: {
    flexWrap: 'nowrap',
    height: 375,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 40,
    paddingTop: 40,
  },
  title: {
    ...Style.title,
    marginBottom: 8,
    fontSize: 24,
    lineHeight: 32,
    marginTop: 60,
  },
  body: { ...Style.body, fontSize: 16, flex: 1 },
  icon: {
    ...Style.icon,
    ...{
      width: 30,
      height: 30,
    },
  },
});

type AnnouncementCardInput = {
  announcement: Announcement;
  handlePress(): void;
};

export default function AnnouncementCard({
  announcement,
  handlePress,
}: AnnouncementCardInput): JSX.Element {
  return announcement?.image ? (
    <View style={{ paddingBottom: 16, backgroundColor: Theme.colors.black }}>
      <ImageBackground
        progressiveRenderingEnabled
        style={{
          flex: 1,
          backgroundColor: Theme.colors.gray1,
          borderBottomWidth: 1,
          borderBottomColor: '#313131',
        }}
        source={{ uri: announcement.image ?? '' }}
      >
        <LinearGradient
          colors={['rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.9)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '100%',
          }}
        />
        <TouchableWithoutFeedback
          accessibilityRole="button"
          accessibilityLabel={`${announcement.title}`}
          accessibilityHint={`Navigate to the ${announcement.title} details screen`}
          style={style.imageCardContainer}
          onPress={handlePress}
        >
          <Image style={style.icon} source={Theme.icons.white.announcement} />
          <Text style={style.title}>{announcement.title}</Text>
          <Text numberOfLines={4} ellipsizeMode="tail" style={style.body}>
            {`${announcement.description}`}
          </Text>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  ) : (
    <TouchableWithoutFeedback
      accessibilityRole="button"
      accessibilityLabel={announcement?.title}
      accessibilityHint={`Navigate to the ${announcement?.title} details screen`}
      style={style.cardContainer}
      onPress={handlePress}
    >
      <Image style={style.icon} source={Theme.icons.white.announcement} />
      <Text style={style.title}>{announcement?.title}</Text>
      <Text numberOfLines={4} ellipsizeMode="tail" style={style.body}>
        {`${announcement?.description}`}
      </Text>
    </TouchableWithoutFeedback>
  );
}
