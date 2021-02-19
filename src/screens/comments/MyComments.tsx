import React, { useLayoutEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Thumbnail } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import ToggleButton from '../../components/buttons/ToggleButton';
import CommentContext from '../../contexts/CommentContext';

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
  headerTitle: HeaderStyle.title,
  searchBar: {
    marginBottom: 16,
  },
  commentItem: {
    borderBottomLeftRadius: 16,
    borderBottomWidth: 0.2,
    borderBottomColor: 'grey',
  },
  commentText: {
    paddingTop: 8,
    color: '#FFFFFF',
    fontFamily: 'Graphik-Regular-App',
    fontWeight: '400',
    lineHeight: 24,
    paddingRight: 16,
    fontSize: 16,
    paddingBottom: 14,
  },
  dateText: {
    fontFamily: 'Graphik-Regular-App',
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
  },
});

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
}

export default function MyComments({ navigation }: Params): JSX.Element {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'My Comments',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingRight: 12,
              paddingBottom: 12,
              paddingTop: 12,
            }}
          >
            <Thumbnail
              square
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
              More
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
  const commentContext = useContext(CommentContext);
  console.log(commentContext);
  const [filterToggle, setFilterToggle] = useState(false);
  return (
    <View style={{ marginTop: 20 }}>
      <ToggleButton
        toggle={(current: boolean) => setFilterToggle(current)}
        currentToggle={filterToggle}
        btnTextOne="Most Recent"
        btnTextTwo="By Series"
      />
      <FlatList
        style={{ marginTop: 26, marginLeft: 16 }}
        data={commentContext.comments}
        renderItem={({ item }) => {
          return (
            <View style={style.commentItem}>
              <Text style={style.dateText}>
                {item?.comment} • {item?.time}
              </Text>
              <Text style={style.commentText}>{item?.comment}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {item?.tags?.map((tag) => {
                  return (
                    <Text
                      style={{
                        marginRight: 4,
                        fontSize: 12,
                        lineHeight: 18,
                        paddingTop: 4,
                        paddingBottom: 4,
                        paddingHorizontal: 8,
                        height: 26,
                        color: 'white',
                        backgroundColor: '#1A1A1A',
                      }}
                    >
                      {tag}
                    </Text>
                  );
                })}
              </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
