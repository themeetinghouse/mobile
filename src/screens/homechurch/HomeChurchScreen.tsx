import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import API, { GraphQLResult } from '@aws-amplify/api';
import { ListF1ListGroup2sQuery } from 'src/services/API';
import { listF1ListGroup2s } from '../../services/queries';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import LocationContext from '../../contexts/LocationContext';
import HomeChurchItem from './HomeChurchItem';
import HomeChurchLocationSelect from './HomeChurchLocationSelect';
import IconButton from '../../components/buttons/IconButton';

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
}

const style = StyleSheet.create({
  header: Style.header,
  headerTitle: HeaderStyle.title,
  resultsCount: {
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: 16,
    lineHeight: 18,
    color: Theme.colors.grey5,
    marginHorizontal: 16,
    marginVertical: 8,
  },
});

export type HomeChurchData = NonNullable<
  NonNullable<NonNullable<ListF1ListGroup2sQuery>['listF1ListGroup2s']>['items']
>;
export type HomeChurch = HomeChurchData[0];

export default function HomeChurchScreen({ navigation }: Params): JSX.Element {
  const location = useContext(LocationContext);
  const [isLoading, setIsLoading] = useState(true);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Home Church Finder',
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
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return <View style={{ flex: 1 }} />;
      },
    });
  }, [navigation]);

  const [homeChurches, setHomeChurches] = useState<HomeChurchData>([]);
  useEffect(() => {
    /*
      TODO: Not all locations are showing. City names not matching?
    */
    const loadHomeChurches = async () => {
      try {
        const json = (await API.graphql({
          query: listF1ListGroup2s,
          variables: {
            limit: 500,
          },
        })) as GraphQLResult<ListF1ListGroup2sQuery>;
        setHomeChurches(
          json?.data?.listF1ListGroup2s?.items?.filter(
            (a) =>
              a?.location?.address?.city ===
                location?.locationData?.locationName ?? 'Oakville'
          ) ?? []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeChurches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <View>
      {isLoading ? (
        <View
          style={{
            // TODO: fix this centering
            flex: 1,
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 200,
            top: '100%',
            left: '45%',
            paddingVertical: 32,
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            size="large"
            color="white"
            animating
            style={{ height: 50, width: 50 }}
          />
        </View>
      ) : null}
      <FlatList
        data={homeChurches}
        renderItem={({ item }) => <HomeChurchItem item={item} />}
        keyExtractor={(item, index) => {
          return item?.id ?? index.toString();
        }}
        ListHeaderComponent={
          <View>
            <HomeChurchLocationSelect
              navigation={navigation}
              loc={location?.locationData}
            />
            <Text
              style={style.resultsCount}
            >{`${homeChurches.length} Results`}</Text>
            <IconButton
              labelStyle={{
                color: 'black',
                fontFamily: Theme.fonts.fontFamilyBold,
              }}
              icon={Theme.icons.black.map}
              label="Map"
              style={{
                marginLeft: 12,
                height: 50,
                width: 100,
                backgroundColor: '#fff',
              }}
              onPress={() =>
                navigation.navigate('HomeChurchMapScreen', {
                  items: homeChurches,
                })
              }
            />
          </View>
        }
      />
    </View>
  );
}
