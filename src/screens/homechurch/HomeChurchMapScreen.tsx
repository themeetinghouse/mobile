import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, FlatList, Text } from 'react-native';
import { Thumbnail } from 'native-base';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import mapstyle from '../../../assets/mapstyle'; // TODO: FIX, and add for IOS
import { Theme } from '../../Theme.style';
import HomeChurchItem from './HomeChurchItem';
import { HomeChurchData } from './HomeChurchScreen';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  map: {
    width,
    height: height * 0.6, // TODO: Increase map size
  },
  list: {
    height: height * 0.4,
    backgroundColor: '#000',
    width,
  },
});
interface Params {
  route: RouteProp<MainStackParamList, 'HomeChurchMapScreen'>;
}
export default function HomeChurchMapScreen({ route }: Params): JSX.Element {
  const homeChurches: HomeChurchData = route?.params?.items;
  const listRef = useRef<any>(null); // TODO: fix type
  const mapRef = useRef<any>(null);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (listRef && listRef?.current) {
      listRef.current.scrollToIndex({
        animated: true,
        index: selected,
      });
    }
  }, [selected]);
  const handleScroll = (event) => {
    // TODO: FIX offset calculation
    const xOffset = event.nativeEvent.contentOffset.x;
    setSelected(Math.round(xOffset / width));
  };
  return (
    <View style={styles.container}>
      <MapView
        customMapStyle={mapstyle}
        initialRegion={{
          latitude: 43.4675,
          longitude: -79.6877,
          latitudeDelta: 0.122,
          longitudeDelta: 0.1521,
        }}
        ref={mapRef}
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
                    identifier={church?.id ?? ''}
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
        ref={listRef}
        onMomentumScrollEnd={(e) => handleScroll(e)}
        showsHorizontalScrollIndicator
        pagingEnabled
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        contentContainerStyle={{ padding: 16 }}
        style={styles.list}
        getItemLayout={(data, index) => {
          const cardWidth = width;
          return {
            // TODO: FIX OFFSET
            length: cardWidth,
            offset: cardWidth * index,
            index,
          };
        }} /* The data fed to the flatlist needs to match data fed to markers. Indexes must match */
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
