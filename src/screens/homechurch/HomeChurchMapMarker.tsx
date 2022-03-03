import React from 'react';
import { Image, View } from 'react-native';
import { Marker } from 'react-native-maps';
import Theme from '../../../src/Theme.style';
import { HomeChurchData } from './HomeChurchScreen';

type Props = {
  index: number;
  handleMarkerPress: (i: number) => void;
  church: HomeChurchData[0];
  active: boolean;
};
const HomeChurchMapMarker = (props: Props) => {
  const { active, church, handleMarkerPress, index } = props;
  return (
    <Marker
      zIndex={active ? 10 : -10}
      identifier={church?.id ?? ''}
      onPress={() => handleMarkerPress(index)}
      key={church?.id}
      coordinate={{
        latitude: parseFloat(church?.location?.address?.latitude ?? '43.6532'),
        longitude: parseFloat(
          church?.location?.address?.longitude ?? '-79.3832'
        ),
      }}
    >
      <View
        style={{
          padding: 12,
          borderRadius: 50,
          borderWidth: 2,
          backgroundColor: active ? 'black' : 'white',
        }}
      >
        <Image
          style={{ width: 18, height: 18 }}
          source={
            active ? Theme.icons.white.homeChurch : Theme.icons.black.homeChurch
          }
        />
      </View>
    </Marker>
  );
};

export default HomeChurchMapMarker;
