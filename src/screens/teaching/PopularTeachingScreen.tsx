import React, { useLayoutEffect } from 'react';
import { Container, Text, View, Image } from 'native-base';
import { TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import TeachingListItem from '../../components/teaching/TeachingListItem';
import ActivityIndicator from '../../components/ActivityIndicator';
import { TeachingStackParamList } from '../../navigation/MainTabNavigator';
import { MainStackParamList } from '../../navigation/AppNavigator';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: Theme.colors.black,
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
  title: Style.title,
  body: Style.body,
});

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
  route: RouteProp<TeachingStackParamList, 'PopularTeachingScreen'>;
}

export default function AllSermonsScreen({
  navigation,
  route,
}: Params): JSX.Element {
  const teaching = route.params.popularTeaching;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Popular',
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
            <Image
              alt="back icon"
              source={Theme.icons.white.back}
              style={{ width: 24, height: 24 }}
            />
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                transform: [{ translateX: -4 }],
              }}
            >
              Teaching
            </Text>
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return <View style={{ flex: 1 }} />;
      },
    });
  }, [navigation]);

  return (
    <Container>
      <ScrollView style={style.content}>
        <View style={{ marginBottom: 48 }}>
          {teaching && teaching.length > 0 ? (
            teaching.map((sermon) => (
              <TeachingListItem
                key={sermon?.id}
                teaching={sermon}
                handlePress={() =>
                  navigation.push('SermonLandingScreen', { item: sermon })
                }
              />
            ))
          ) : (
            <ActivityIndicator />
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
