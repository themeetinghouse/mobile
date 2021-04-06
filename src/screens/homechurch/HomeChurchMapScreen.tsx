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
    height: Dimensions.get('window').height / 1.5,
  },
});
interface Params {
  route: RouteProp<MainStackParamList, 'HomeChurchMapScreen'>;
}

export default function HomeChurchMapScreen({ route }: Params): JSX.Element {
  const homeChurches: HomeChurchData = route?.params?.items;
  const listRef = useRef(null);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (listRef && listRef?.current) {
      listRef?.current?.scrollToIndex({ animated: true, index: selected });
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
                    style={{ zIndex: 10000 }}
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
                        marginLeft: 16,
                        marginTop: 30,
                        padding: 12,
                        backgroundColor: 'black',
                        borderRadius: 50,
                      }}
                    >
                      <Thumbnail
                        square
                        style={{ width: 18, height: 18 }}
                        source={Theme.icons.white.homeChurch}
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
        style={{ backgroundColor: '#000' }}
        getItemLayout={(data, index) => ({
          length: Dimensions.get('window').width,
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
