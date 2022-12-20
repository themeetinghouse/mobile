import React, { useState, useRef, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import * as Location from 'expo-location';

import { StackNavigationProp } from '@react-navigation/stack';
import { Theme } from '../../Theme.style';
import HomeChurchItem from './HomeChurchItem';
import HomeChurchExtendedModal from './HomeChurchExtendedModal';
import HomeChurchMapMarker from './HomeChurchMapMarker';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  map: {
    flex: 1.7,
    width: '100%',
  },
  list: {
    backgroundColor: '#000',
    marginBottom: 8,
    flex: 1,
    paddingBottom: 4,
  },
  closeButton: {
    zIndex: 20000,
    position: 'absolute',
    borderRadius: 50,
    top: 52,
    right: 24,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,.7)',
  },
});
interface Params {
  route: RouteProp<MainStackParamList, 'HomeChurchMapScreen'>;
  navigation: StackNavigationProp<MainStackParamList>;
}
export default function HomeChurchMapScreen({
  route,
  navigation,
}: Params): JSX.Element {
  const cardLength = width - 80 + 16;
  const homeChurches = route?.params?.items;
  const selectedChurch = homeChurches.findIndex(
    (hm) => hm?.id === route?.params?.selection?.id
  );
  const [, setUserLocation] = useState<Location.LocationObject['coords']>();
  const listRef = useRef<FlatList | null>(null);
  const mapRef = useRef<MapView>(null);
  const [selected, setSelected] = useState(
    selectedChurch >= 0 ? selectedChurch : 0
  );
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
        zoom: 11,
        altitude: 30000,
      },
      { duration: 100 }
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
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setUserLocation(location?.coords);
  };
  useEffect(() => {
    if (selectedChurch >= 0) {
      if (listRef && listRef?.current) {
        listRef.current.scrollToIndex({
          animated: true,
          index: selectedChurch,
        });
      }
    }
    Platform.OS === 'ios' ? StatusBar.setBarStyle('dark-content', true) : null;
    return () => {
      Platform.OS === 'ios'
        ? StatusBar.setBarStyle('light-content', true)
        : null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
      >
        <Image
          style={{
            width: 26,
            height: 26,
          }}
          source={Theme.icons.white.closeCancel}
        />
      </TouchableOpacity>
      <MapView
        provider={PROVIDER_GOOGLE}
        rotateEnabled={false}
        pitchEnabled={false}
        zoomControlEnabled
        zoomEnabled
        initialCamera={{
          center: {
            latitude: parseFloat(
              homeChurches[0]?.location?.address?.latitude ?? '43.4675'
            ),
            longitude: parseFloat(
              homeChurches[0]?.location?.address?.longitude ?? '-79.6877'
            ),
          },
          pitch: 1,
          heading: 1,
          zoom: 11,
          altitude: 30000,
        }}
        onMapReady={async () => getUserLocation()}
        showsCompass={false}
        ref={mapRef}
        style={styles.map}
      >
        {homeChurches?.length
          ? homeChurches.map((church, index) => {
              return (
                <HomeChurchMapMarker
                  key={church?.id}
                  church={church}
                  index={index}
                  active={selected === index}
                  handleMarkerPress={handleMarkerPress}
                />
              );
            })
          : null}
      </MapView>

      {showModal ? (
        <HomeChurchExtendedModal
          setShowModal={() => {
            setShowModal(!showModal);
          }}
          selected={homeChurches[selected]}
        />
      ) : null}
      {homeChurches.length === 1 ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            width,
            paddingBottom: 4,
            flex: 1,
          }}
        >
          <HomeChurchItem
            openModal={() => {
              setSelected(0);
              setShowModal(true);
            }}
            active
            card
            single
            item={homeChurches[0]}
          />
        </View>
      ) : (
        <FlatList
          onMomentumScrollEnd={handleListScroll}
          onLayout={() =>
            listRef.current?.scrollToIndex({ index: selectedChurch })
          }
          ref={listRef}
          showsHorizontalScrollIndicator={false}
          snapToOffsets={[...Array(homeChurches.length)].map((x, index) => {
            const cardWidth = width - 64;
            const a = cardWidth * index;
            return a - 24;
          })}
          decelerationRate={0.88}
          disableIntervalMomentum
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          contentContainerStyle={{ padding: 16 }}
          getItemLayout={(data, index) => {
            return {
              length: cardLength,
              offset: cardLength * index - 24,
              index,
            };
          }}
          style={styles.list}
          /* 
          The data fed to the flatlist needs to match data fed to markers. Indexes must match 
          Online Home Churches will not show up on map screen (?) 
        */
          data={homeChurches}
          renderItem={({ item, index }) => (
            <HomeChurchItem
              openModal={() => {
                setSelected(index);
                setShowModal(true);
              }}
              active={index === selected}
              card
              item={item}
            />
          )}
          horizontal
        />
      )}
    </View>
  );
}
