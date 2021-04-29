import React, { useState, useRef, useEffect, SyntheticEvent } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions, FlatList, Animated, ScrollResponderEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Thumbnail } from 'native-base';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import * as Location from 'expo-location';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { Theme } from '../../Theme.style';
import HomeChurchItem from './HomeChurchItem';
import { HomeChurch, HomeChurchData } from './HomeChurchScreen';


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
    height: height * 0.7,
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
  const [userLocation, setUserLocation] = useState<
    Location.LocationObject['coords']
  >();
  const listRef = useRef<FlatList | null>(null);
  const mapRef = useRef<MapView>(null);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (listRef && listRef?.current) {
      const cardWidth = width - 64;
      const a = cardWidth * selected;
      listRef.current.scrollToOffset({
        animated: true,
        offset: a - 24
      });
    }
    console.log("=========================================")
    console.log(homeChurches[selected]?.location?.address?.latitude)
    console.log(homeChurches[selected]?.location?.address?.longitude)
    mapRef?.current?.animateCamera(
      {
        center: {
          latitude: parseFloat(homeChurches[selected]?.location?.address?.latitude ?? "43.4675" ) ,
          longitude: parseFloat(homeChurches[selected]?.location?.address?.longitude ?? "-79.6877") ,
        },
        pitch: 1,
        heading: 1,
        zoom: 12,
        altitude: 3,
      },
      { duration: 400 }
    );
  }, [selected]);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // console.log(event.nativeEvent)
    let xOffset = event.nativeEvent.contentOffset.x
    let contentWidth = event.nativeEvent.contentSize.width
    // This number needs be relative to display
    setSelected(Math.round(xOffset/296))
  }
  const getUserLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setUserLocation(location?.coords);
    mapRef?.current?.animateCamera(
      {
        center: {
          latitude: location?.coords?.latitude ?? "43.4675",
          longitude: location?.coords?.longitude ?? "-79.6877",
        },
        pitch: 1,
        heading: 1,
        zoom: 12,
        altitude: 3,
      },
      { duration: 3 }
    );
  };
  return (
    <View style={styles.container}>
      <MapView
        rotateEnabled={false}
        pitchEnabled={false}
        zoomControlEnabled
        mapPadding={{ top: 16, left: 16, right: 16, bottom: 16 }}
        onMapReady={async () => getUserLocation()}
        showsUserLocation
        loadingEnabled
        ref={mapRef}
        style={styles.map}
      >
        {homeChurches?.length
          ? homeChurches
              .map((church, index) => {
                return (
                  <Marker
                    zIndex={selected === index ? 10 : -10}
                    identifier={church?.id ?? ''}
                    onPress={() => {
                      setSelected(index);
                    }}
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
        onMomentumScrollEnd={handleScroll}
        ref={listRef}
        showsHorizontalScrollIndicator
        snapToOffsets={[...Array(homeChurches.length)].map((x, index) => {

          const cardWidth = width - 64 ;
          const a = cardWidth * index;
          return a - 24;
        })}
        decelerationRate={0.88}
        disableIntervalMomentum
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        contentContainerStyle={{ padding: 16 }}
        style={styles.list}
 /* 
          The data fed to the flatlist needs to match data fed to markers. Indexes must match 
          Online Home Churches will not show up on map screen (?) 
        */
        data={homeChurches}
        renderItem={({ item, index }) => (
            <HomeChurchItem active={index === selected} card item={item} />
        )}
        horizontal
      />
    </View>
  );
}
