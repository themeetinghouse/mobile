import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, FlatList } from 'react-native';
import { Thumbnail } from 'native-base';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import { Theme } from '../../Theme.style';
import HomeChurchItem from './HomeChurchItem';
import { HomeChurchData } from './HomeChurchScreen';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.7, // TODO: Increase map size
  },
  list: {
    height: Dimensions.get('window').height * 0.3,
    backgroundColor: '#000',
    padding: 16,
  },
});
interface Params {
  route: RouteProp<MainStackParamList, 'HomeChurchMapScreen'>;
}

export default function HomeChurchMapScreen({ route }: Params): JSX.Element {
  const homeChurches: HomeChurchData = route?.params?.items;
  const listRef = useRef<any>(null); // TODO: fix type
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (listRef && listRef?.current) {
      listRef.current.scrollToIndex({
        animated: true,
        index: selected,
        viewOffset: Dimensions.get('window').width * 0.8, // TODO: fix offset
      });
    }
  }, [selected]);
  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: 43.4675,
          longitude: -79.6877,
          latitudeDelta: 0.122,
          longitudeDelta: 0.1521,
        }}
        style={styles.map}
      >
        {homeChurches?.length
          ? homeChurches
              .filter(
                (church) =>
                  church?.location?.address?.latitude &&
                  church?.location?.address?.longitude
              )
              .map((church, index) => {
                return (
                  <Marker
                    onPress={() => setSelected(index)}
                    key={church?.id}
                    coordinate={{
                      latitude: parseFloat(
                        church?.location?.address?.latitude ?? '43.6532'
                      ),
                      longitude: parseFloat(
                        church?.location?.address?.longitude ?? '-79.3832'
                      ),
                    }}
                  >
                    <View
                      style={{
                        padding: 12,
                        backgroundColor: selected === index ? 'black' : 'white',
                        borderRadius: 50,
                        borderWidth: 2,
                      }}
                    >
                      <Thumbnail
                        square
                        style={{ width: 18, height: 18 }}
                        source={
                          selected === index
                            ? Theme.icons.white.homeChurch
                            : Theme.icons.black.homeChurch
                        }
                      />
                    </View>
                  </Marker>
                );
              })
          : null}
      </MapView>
      <FlatList
        pagingEnabled
        ref={listRef}
        style={styles.list}
        getItemLayout={(data, index) => ({
          // TODO: FIX OFFSET
          length: Dimensions.get('window').width * 0.8,
          offset: Dimensions.get('window').width * index,
          index,
        })} /* The data fed to the flatlist needs to match data fed to markers. Indexes must match */
        ItemSeparatorComponent={() => <View style={{ borderColor: 'white' }} />}
        data={homeChurches.filter(
          (church) =>
            church?.location?.address?.latitude &&
            church?.location?.address?.longitude
        )}
        renderItem={({ item }) => <HomeChurchItem card item={item} />}
        horizontal
      />
    </View>
  );
}
