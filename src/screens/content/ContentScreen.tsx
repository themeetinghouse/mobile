/* eslint-disable react/no-array-index-key */
import React, { useEffect, useLayoutEffect } from 'react';
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
import { RouteProp, useIsFocused } from '@react-navigation/native';
import RenderRouter from '../../../src/components/RenderRouter/RenderRouter';
import { ContentScreenActionType } from '../../../src/contexts/ContentScreenContext/ContentScreenTypes';
import { useContentContext } from '../../../src/contexts/ContentScreenContext/ContentScreenContext';
import Theme from '../../../src/Theme.style';
import useContent from './useContent';

const styles = StyleSheet.create({
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 1000,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackButton: {
    flexDirection: 'row',
    paddingRight: 12,
    paddingBottom: 12,
    paddingTop: 12,
  },
  divider: {
    height: 15,
    backgroundColor: Theme.colors.background,
    padding: 0,
  },
});

type ContentPageProps = {
  navigation: StackNavigationProp<FeaturedStackParamList>;
  route: RouteProp<FeaturedStackParamList, 'ContentScreen'>;
};

export default function ContentPage({ navigation, route }: ContentPageProps) {
  const { content, items, isLoading, screenTitle } = useContent(
    route?.params?.screen
  );
  const { state, dispatch } = useContentContext();
  const { hideBottomNav, hideHeader, hideBackButton } = state;
  const hideBottomNavigation = () => {
    navigation.getParent()?.setOptions({
      tabBarVisible: !hideBottomNav,
    });
  };
  useLayoutEffect(() => {
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
  }, [navigation, state]);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      dispatch({
        type: ContentScreenActionType.UPDATE_STATE,
        payload: {
          hideBottomNav: content?.screen?.config?.hideBottomNav ?? false,
          hideHeader: content?.screen?.config?.hideHeader ?? false,
          hideBackButton: content?.screen?.config?.hideBackButton ?? false,
          backgroundColor: content?.screen?.config?.backgroundColor ?? 'black',
          fontColor: content?.screen?.config?.fontColor ?? 'white',
        },
      });
    }
  }, [isFocused, dispatch, content]);
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: content?.screen.config.backgroundColor }}
    >
      {isLoading && isFocused ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      ) : null}

      {items?.map((item, index: number) => (
        <RenderRouter key={`${item.type} + ${index}`} item={item} />
      ))}
    </ScrollView>
  );
}
