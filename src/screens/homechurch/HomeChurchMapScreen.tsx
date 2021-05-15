import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import * as Location from 'expo-location';
import {
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
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
    backgroundColor: '#000',
    width,
  },
});
interface Params {
  route: RouteProp<MainStackParamList, 'HomeChurchMapScreen'>;
}
export default function HomeChurchMapScreen({ route }: Params): JSX.Element {
  const cardLength = width - 80 + 16;
  const homeChurches: HomeChurchData = route?.params?.items;
  const [userLocation, setUserLocation] = useState<
    Location.LocationObject['coords']
  >();
  const listRef = useRef<FlatList | null>(null);
  const mapRef = useRef<MapView>(null);
  const [selected, setSelected] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const handleListScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    setSelected(Math.round(xOffset / cardLength));
    mapRef?.current?.animateCamera(
      {
        center: {
          latitude: parseFloat(
            homeChurches[Math.round(xOffset / cardLength)]?.location?.address
              ?.latitude ?? '43.4675'
          ),
          longitude: parseFloat(
            homeChurches[Math.round(xOffset / cardLength)]?.location?.address
              ?.longitude ?? '-79.6877'
          ),
        },
        pitch: 1,
        heading: 1,
        zoom: 12,
        altitude: 30000,
      },
      { duration: 400 }
    );
  };
  const handleMarkerPress = (index: number) => {
    setShowModal(false);
    setSelected(index);
    if (listRef && listRef?.current) {
      listRef.current.scrollToIndex({
        animated: true,
        index,
      });
    }
  };
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
          latitude: location?.coords?.latitude ?? '43.4675',
          longitude: location?.coords?.longitude ?? '-79.6877',
        },
        pitch: 1,
        heading: 1,
        zoom: 12,
        altitude: 30000,
      },
      { duration: 3 }
    );
  };

  const Modal = (): JSX.Element => {
    const translateY = new Animated.Value(height * 0.4);
    const handleGesture = Animated.event(
      [{ nativeEvent: { translationY: translateY } }],
      { useNativeDriver: true }
    );

    function handleGestureEnd(e: PanGestureHandlerStateChangeEvent) {
      if (e.nativeEvent.translationY > 60) {
        Animated.timing(translateY, {
          duration: 150,
          useNativeDriver: true,
          toValue: height * 0.4,
        }).start();
        setTimeout(() => setShowModal(false), 500);
      } else {
        Animated.timing(translateY, {
          duration: 150,
          useNativeDriver: true,
          toValue: 0,
        }).start();
      }
    }
    useEffect(() => {
      Animated.timing(translateY, {
        duration: 150,
        useNativeDriver: true,
        toValue: 0,
      }).start();
    });
    return (
      <PanGestureHandler
        onGestureEvent={handleGesture}
        onHandlerStateChange={(e) => handleGestureEnd(e)}
      >
        <Animated.View
          style={{
            bottom: 0,
            position: 'absolute',
            zIndex: 200,
            transform: [
              {
                translateY: translateY.interpolate({
                  inputRange: [0, height * 0.4],
                  outputRange: [0, height * 0.4],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}
        >
          <HomeChurchItem modal item={homeChurches[selected]} />
        </Animated.View>
      </PanGestureHandler>
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
          ? homeChurches.map((church, index) => {
              return (
                <Marker
                  zIndex={selected === index ? 10 : -10}
                  identifier={church?.id ?? ''}
                  onPress={() => handleMarkerPress(index)}
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

      {showModal ? <Modal /> : null}
      <FlatList
        onMomentumScrollEnd={handleListScroll}
        ref={listRef}
        showsHorizontalScrollIndicator
        snapToOffsets={[...Array(homeChurches.length)].map((x, index) => {
          const cardWidth = width - 64;
          const a = cardWidth * index;
          return a - 24;
        })}
        decelerationRate={0.88}
        disableIntervalMomentum
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        contentContainerStyle={{ padding: 16 }}
        getItemLayout={(data, index) => {
          return { length: cardLength, offset: cardLength * index - 24, index };
        }}
        style={styles.list}
        /* 
          The data fed to the flatlist needs to match data fed to markers. Indexes must match 
          Online Home Churches will not show up on map screen (?) 
        */
        data={homeChurches}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setShowModal(!showModal)}>
            <HomeChurchItem active={index === selected} card item={item} />
          </TouchableOpacity>
        )}
        horizontal
      />
    </View>
  );
}
