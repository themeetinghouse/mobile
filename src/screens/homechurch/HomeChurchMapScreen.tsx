import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, FlatList, Text } from 'react-native';
import { Thumbnail } from 'native-base';
import { Theme } from '../../Theme.style';
import HomeChurchItem from './HomeChurchItem';

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

export default function HomeChurchMapScreen({ route }): JSX.Element {
  const homeChurches = route?.params.items;
  const [selected, setSelected] = useState();
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
                  church.location.address.latitude &&
                  church.location.address.longitude
              )
              .map((church) => {
                return (
                  <Marker
                    onPress={() => setSelected(church.id)}
                    key={church.id}
                    style={{ zIndex: 10000 }}
                    coordinate={{
                      latitude: parseFloat(church.location.address.latitude),
                      longitude: parseFloat(church.location.address.longitude),
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
        style={{ backgroundColor: '#000' }}
        ItemSeparatorComponent={() => <View style={{ borderColor: 'white' }} />}
        data={homeChurches}
        renderItem={({ item }) => <HomeChurchItem item={item} />}
        horizontal
      />
    </View>
  );
}
