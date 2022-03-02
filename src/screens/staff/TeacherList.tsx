import React, { useEffect, useState, useLayoutEffect } from 'react';
import { FlatList, StyleSheet, View, Text, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import TeacherItem from '../../components/staff/TeacherItem';
import SpeakersService, {
  loadSpeakersListData,
} from '../../services/SpeakersService';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import SearchBar from '../../components/SearchBar';
import ActivityIndicator from '../../components/ActivityIndicator';

const style = StyleSheet.create({
  content: {
    backgroundColor: Theme.colors.black,
    padding: 16,
  },
  header: Style.header,
  headerTitle: HeaderStyle.title,
  searchBar: {},
});

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
}

export default function TeacherList({ navigation }: Params): JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakers, setSpeakers] = useState<loadSpeakersListData['items']>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'All Teachers',
      headerTitleStyle: style.headerTitle,
      headerStyle: {
        backgroundColor: Theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.gray2,
        shadowOpacity: 0,
        elevation: 0,
      },
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
            <Image
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

  useEffect(() => {
    const loadTeachers = async () => {
      setIsLoading(true);
      const speakerData = await SpeakersService.loadSpeakersListOnly();
      setSpeakers(speakerData.items);
      setIsLoading(false);
    };
    loadTeachers();
    return () => {
      console.log('Cleanup'); // cancel async stuff here
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <View
          style={{
            zIndex: 100,
            position: 'absolute',
            left: 50,
            right: 50,
            bottom: '50%',
          }}
        >
          <ActivityIndicator animating={isLoading} />
        </View>
      ) : null}
      <FlatList
        ListHeaderComponentStyle={style.header}
        ListHeaderComponent={
          <View style={style.content}>
            <SearchBar
              style={style.searchBar}
              searchText={searchText}
              handleTextChanged={(newStr) => setSearchText(newStr)}
              placeholderLabel="Search by name..."
            />
          </View>
        }
        data={speakers?.filter(
          (item) =>
            item?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            searchText === ''
        )}
        renderItem={({ item }) => {
          if (!item?.hidden) return <TeacherItem teacher={item} />;
          return null;
        }}
        initialNumToRender={10}
      />
    </>
  );
}
