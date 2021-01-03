import React from 'react';
import { Container, Text, Button, Icon, Content, View } from 'native-base';
import { StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import WhiteButton from '../../components/buttons/WhiteButton';
import { Theme, Style, HeaderStyle } from '../../Theme.style';

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
  title: {
    ...Style.title,
    ...{
      marginTop: 130,
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
  const announcementItem = route.params?.item;

  navigation.setOptions({
    headerShown: true,
    title: 'Announcement',
    headerTitleStyle: style.headerTitle,
    headerStyle: { backgroundColor: Theme.colors.background },
    headerLeft: function render() {
      return (
        <Button transparent onPress={() => navigation.goBack()}>
          <Icon name="close" />
        </Button>
      );
    },
    headerLeftContainerStyle: { left: 16 },
    headerRight: function render() {
      return <View style={{ flex: 1 }} />;
    },
  });

  return (
    <Container>
      <Content style={style.content}>
        <Text style={style.title}>{announcementItem.title}</Text>
        <Text style={style.body}>{announcementItem.description}</Text>
        <WhiteButton label="Call to action" />
      </Content>
    </Container>
  );
}
