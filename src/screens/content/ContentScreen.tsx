/* eslint-disable react/no-array-index-key */
import React, { useContext, useLayoutEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FeaturedStackParamList } from 'src/navigation/MainTabNavigator';
import { RouteProp } from '@react-navigation/native';
import Theme from '../../../src/Theme.style';
import ContentListItem from './ContentListItem';
import { ContentItemType, ScreenConfig } from './ContentTypes';
import TextHeader from './RenderRouter/Text/TextHeader';
import TextBody from './RenderRouter/Text/TextBody';
import useContent from './useContent';
import Button from './RenderRouter/Button/Button';
import Video from './RenderRouter/Video/Video';
import TMHLogo from './RenderRouter/TMHLogo';
import { getUserType } from '../more/MoreScreen';

const styles = StyleSheet.create({
  image: {
    height: 200,
  },
  goBackButton: {
    flexDirection: 'row',
    paddingRight: 12,
    paddingBottom: 12,
    paddingTop: 12,
  },
});

type ContentThemeContextType = {
  fontColor: ScreenConfig['fontColor'];
  backgroundColor: ScreenConfig['backgroundColor'];
  groups: string[];
};
export const ContentThemeContext = React.createContext<ContentThemeContextType>(
  {
    fontColor: 'white',
    backgroundColor: 'black',
    groups: [],
  }
);

const RenderRouter = ({ item }: { item: ContentItemType }) => {
  const { groups } = useContext(ContentThemeContext);
  switch (item.type) {
    case 'header':
      return <TextHeader item={item} />;
    case 'body':
      return <TextBody item={item} />;
    case 'button':
      return <Button item={item} />;
    case 'logo':
      return <TMHLogo item={item} />;
    case 'image': {
      const imageStyle =
        item.style === 'full' ? { marginLeft: 0 } : { marginLeft: 16 };
      return (
        <Image
          style={[styles.image, imageStyle]}
          resizeMode="cover"
          source={{ uri: item.imageUrl }}
        />
      );
    }

    case 'video':
      return <Video item={item} />;
    case 'list':
      switch (item.style) {
        case 'link-list':
          return (
            <>
              {item.items.map((listItem: any, index: number) => {
                switch (listItem.type) {
                  case 'link-item':
                    return (
                      <ContentListItem
                        hideBorder={listItem.hideBorder}
                        // eslint-disable-next-line react/no-array-index-key
                        key={`link-item-${index}`}
                        item={listItem}
                      />
                    );
                  case 'divider':
                    return (
                      <View
                        key={`divider-${index}`}
                        style={{
                          height: 15,
                          backgroundColor: Theme.colors.background,
                          padding: 0,
                        }}
                      />
                    );
                  default:
                    console.error('Unknown list item type', item.type, item);
                    return null;
                }
              })}
            </>
          );
        default:
          console.error('Unknown list type', item.type, item);
          return null;
      }

    case 'spacing':
      return <View style={{ height: item.size }} />;
    default:
      return null;
  }
};
type ContentPageProps = {
  navigation: StackNavigationProp<FeaturedStackParamList>;
  route: RouteProp<FeaturedStackParamList, 'ContentScreen'>;
};

export default function ContentPage({ navigation, route }: ContentPageProps) {
  const { content, items, isLoading, screenConfig, screenTitle } = useContent(
    route?.params?.screen
  );
  const [userGroups, setUserGroups] = useState([]);
  const {
    hideBottomNav,
    hideHeader,
    hideBackButton,
    backgroundColor,
    fontColor,
  } = screenConfig;
  const hideBottomNavigation = () => {
    navigation.getParent()?.setOptions({
      tabBarVisible: !hideBottomNav,
    });
  };
  useLayoutEffect(() => {
    const getUser = async () => {
      const userGroupData = await getUserType();
      setUserGroups(userGroupData);
    };
    getUser();
    hideBottomNavigation();
    navigation.setOptions({
      headerShown: !hideHeader,
      title: screenTitle,
      headerTitleStyle: {
        textAlign: 'center',
        color: 'white',
        fontFamily: Theme.fonts.fontFamilyBold,
      },
      headerStyle: {
        backgroundColor: Theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.gray2,
        shadowOpacity: 0,
      },
      headerLeft: function render() {
        if (hideBackButton) return null;
        return (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.goBackButton}
          >
            <Image
              accessibilityLabel="back icon"
              source={Theme.icons.white.back}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        if (hideBackButton) return null;
        return <View style={{ flex: 1 }} />;
      },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarVisible: true,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, content]);
  return (
    <ScrollView style={{ backgroundColor }}>
      {isLoading ? <ActivityIndicator size="large" /> : null}
      <ContentThemeContext.Provider
        value={{
          backgroundColor,
          fontColor,
          groups: userGroups,
        }}
      >
        {items?.map((item, index: number) => (
          <RenderRouter key={`${item.type} + ${index}`} item={item} />
        ))}
      </ContentThemeContext.Provider>
    </ScrollView>
  );
}
