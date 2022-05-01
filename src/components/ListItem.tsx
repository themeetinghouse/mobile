import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import Theme, { Style } from '../Theme.style';

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
  item: any;
  hideBorder?: boolean;
};

export default function ListItem(props: ListItemProps) {
  const { item, hideBorder } = props;
  return (
    <TouchableHighlight
      delayPressIn={50}
      style={ListItemStyle.listItem}
      onPress={item.action}
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
          {item.customIcon ? (
            <Image
              style={ListItemStyle.listIcon}
              source={{ uri: item.icon as string } as ImageSourcePropType}
            />
          ) : (
            <Image
              style={ListItemStyle.listIcon}
              source={item.icon as ImageSourcePropType}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
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
