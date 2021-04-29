import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { LocationData } from '../../contexts/LocationContext';
import { Theme, Style } from '../../Theme.style';
import { TouchableHighlight } from 'react-native-gesture-handler';

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
  loc: LocationData;
  setDay: (day: string) => void;
}
const HomeChurchControls = ({ loc, navigation, setDay }: Params): JSX.Element => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(
    loc?.locationName === 'unknown' || !!!loc?.locationName ? { locationName: 'All Locations', locationId: "" } : { locationName: loc?.locationName, locationId: loc?.locationId }
  );
  const [weekday, setWeekDay] = useState('All Days');
  const days = [
    'All Days',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const [active, setActive] = useState(false);
  const style = StyleSheet.create({
    locationIcon: { ...Style.icon, marginRight: 20, alignSelf: 'center' },
    container: {
      backgroundColor: '#111111',
      margin: 16,
      width: Dimensions.get('window').width - 32,
      position: 'relative'
    },
    containerItem: {
      flexDirection: 'row',
      fontFamily: Theme.fonts.fontFamilyRegular,
      paddingHorizontal: 20,
      color: 'white',
      minHeight: 56,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#1A1A1A',
    },
    locationSelect: {
      alignSelf: 'center',
      flex: 1,
      fontFamily: Theme.fonts.fontFamilyRegular,
      color: '#fff',
      fontSize: 16,
    },
  });
  const handleDrop = (day: string) => {
    setWeekDay(day);
    setDay(day);
    setActive(false)
  }
  useEffect(() => {
    setSelectedLocation(loc)
  }, [loc])
  return (
    <>
      <View style={style.container}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.push('HomeChurchLocationSelect', {})
          }
          style={style.containerItem}
        >
          <View
            style={{
              flexDirection: 'row',
              height: 56,
              marginLeft: 16,
            }}
          >
            <Thumbnail
              style={style.locationIcon}
              source={Theme.icons.white.location}
              square
            />
            <Text style={style.locationSelect}>{selectedLocation?.locationName}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableHighlight onBlur={() => setActive(false)} style={style.containerItem} onPress={() => setActive(!active)}>
          <Text style={{ color: 'white', padding: 16 }}>{weekday}</Text>
        </TouchableHighlight>

        {active ? (
          <View
            style={{
              backgroundColor: '#111111',
              top: 56,
              width: "100%",
              position: 'absolute',
              zIndex: 1000,
            }}
          >
            {days.map((day) => (
              <TouchableHighlight key={day} onPress={() => handleDrop(day)} style={style.containerItem}>
                <Text style={{ color: 'white', padding: 16 }}>{day}</Text>
              </TouchableHighlight>
            ))}
          </View>
        ) : null}

      </View>
      <View style={{ zIndex: -100 }}>

        <TouchableOpacity
          style={{ zIndex: -100, backgroundColor: "grey", width: 100 }}
          onPress={() => {
            handleDrop('All Days');
            setSelectedLocation({ locationName: 'All Locations', locationId: "all" });
          }}
        >
          <Text
            style={{
              alignSelf: 'flex-start',
              marginLeft: 16,
              marginBottom: 8,
              color: Theme.colors.gray5,
              textDecorationLine: 'underline',
              fontFamily: Theme.fonts.fontFamilyRegular,
            }}
          >
            Clear All
        </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
export default HomeChurchControls;
