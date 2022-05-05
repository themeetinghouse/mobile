import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  Linking,
} from 'react-native';
import { FeaturedStackParamList } from 'src/navigation/MainTabNavigator';
import Theme, { Style } from '../../../Theme.style';
import { LinkItemType } from '../ContentTypes';

const ListItemStyle = StyleSheet.create({
  listItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
    height: 72,
  },
  listIcon: {
    ...Style.icon,
    ...{
      marginRight: 16,
      marginLeft: 16,
    },
  },
  listArrowIcon: { ...Style.icon, right: 18, alignSelf: 'flex-start', top: 16 },
  listSubtext: {
    fontSize: Theme.fonts.smallMedium,
    lineHeight: 24,
    color: Theme.colors.gray5,
    fontFamily: Theme.fonts.fontFamilyRegular,
  },
  listText: {
    fontSize: Theme.fonts.medium,
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
  },
});

type ListItemProps = {
  item: LinkItemType;
  hideBorder?: boolean;
};

export default function TMHLinkItem(props: ListItemProps) {
  const { item, hideBorder } = props;
  const navigation =
    useNavigation<StackNavigationProp<FeaturedStackParamList>>();
  const handlePress = () => {
    const isUrl =
      item.navigateTo?.includes('https://') ||
      item.navigateTo?.includes('http://') ||
      item.navigateTo?.includes('www.');
    if (!item.navigateTo) {
      navigation.goBack();
    } else if (isUrl) {
      Linking.openURL(item.navigateTo);
    } else navigation.push('ContentScreen', { screen: item.navigateTo });
  };
  return (
    <TouchableHighlight
      delayPressIn={50}
      style={ListItemStyle.listItem}
      onPress={handlePress}
      underlayColor={Theme.colors.gray3}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            top: 14,
          }}
        >
          <Image style={ListItemStyle.listIcon} source={{ uri: item.icon }} />
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 4,
            flexDirection: 'column',
          }}
        >
          <View
            style={[
              {
                flexDirection: 'row',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: Theme.colors.gray2,
                borderBottomWidth: 1,
              },
              hideBorder && { borderBottomWidth: 0 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={ListItemStyle.listText}>{item.text}</Text>
              <Text style={ListItemStyle.listSubtext}>{item.subtext}</Text>
            </View>

            <Image
              style={ListItemStyle.listArrowIcon}
              source={Theme.icons.white.arrow}
            />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}
