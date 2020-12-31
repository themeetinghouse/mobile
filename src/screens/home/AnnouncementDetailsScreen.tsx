import React from 'react';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import { Container, Text, Button, Icon, Content, View } from 'native-base';
import WhiteButton from '../../components/buttons/WhiteButton';
import { StyleSheet } from 'react-native';
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

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

export default function AnnouncementDetailScreen(props: Props): JSX.Element {
  const announcementItem = props.route.params?.item;

  props.navigation.setOptions({
    headerShown: true,
    title: 'Announcement',
    headerTitleStyle: style.headerTitle,
    headerStyle: { backgroundColor: Theme.colors.background },
    headerLeft: function render() {
      return (
        <Button transparent onPress={() => props.navigation.goBack()}>
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
        <WhiteButton label="Call to action"></WhiteButton>
      </Content>
    </Container>
  );
}
