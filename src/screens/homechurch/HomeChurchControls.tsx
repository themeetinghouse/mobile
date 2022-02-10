import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { LocationData } from '../../contexts/LocationContext';
import { Theme, Style } from '../../Theme.style';

const style = StyleSheet.create({
  locationIcon: { ...Style.icon, marginRight: 20, alignSelf: 'center' },
  container: {
    backgroundColor: '#111111',
    margin: 16,
    width: Dimensions.get('window').width - 32,
    position: 'relative',
  },
  containerItem: {
    flexDirection: 'row',
    fontFamily: Theme.fonts.fontFamilyRegular,
    paddingHorizontal: 20,
    color: 'white',
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  locationSelectText: {
    alignSelf: 'center',
    flex: 1,
    fontFamily: Theme.fonts.fontFamilyRegular,
    color: '#fff',
    fontSize: 16,
  },
  daySelectText: {
    flex: 1,
    fontFamily: Theme.fonts.fontFamilyRegular,
    color: 'white',
    padding: 16,
  },
  dropdownItemText: {
    flex: 1,
    fontFamily: Theme.fonts.fontFamilyRegular,
    color: 'white',
    padding: 16,
  },
  dropdownContainer: {
    backgroundColor: '#111111',
    top: 56,
    width: '100%',
    position: 'absolute',
    zIndex: 1000,
  },
  clearText: {
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
    color: Theme.colors.gray5,
    textDecorationLine: 'underline',
    fontFamily: Theme.fonts.fontFamilyRegular,
  },
  caretIcon: {
    ...Style.icon,
    alignSelf: 'center',
  },
  upsideDown: {
    transform: [{ rotate: '180deg' }],
  },
});

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
  loc: LocationData;
  setDay: (day: string) => void;
  isLoading: boolean;
  setLoc: (location: LocationData) => void;
}
const HomeChurchControls = ({
  loc,
  navigation,
  setDay,
  isLoading,
  setLoc,
}: Params): JSX.Element => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(
    loc?.locationName === 'unknown' || !loc?.locationName
      ? { locationName: 'All Locations', locationId: '' }
      : { locationName: loc?.locationName, locationId: loc?.locationId }
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

  const handleDrop = (day: string) => {
    setWeekDay(day);
    setDay(day);
    setActive(false);
  };

  const handleClearButton = () => {
    handleDrop('All Days');
    setLoc({
      locationName: 'All Locations',
      locationId: 'all',
    });
  };

  useEffect(() => {
    setSelectedLocation(loc);
  }, [loc]);

  return (
    <>
      <View style={style.container}>
        <TouchableWithoutFeedback
          disabled={isLoading}
          onPress={() =>
            navigation.navigate('HomeChurchLocationSelect', {
              location: selectedLocation,
            })
          }
        >
          <View style={style.containerItem}>
            <Image
              style={style.locationIcon}
              source={Theme.icons.white.location}
            />
            <Text style={style.locationSelectText}>
              {selectedLocation?.locationName}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableHighlight
          onBlur={() => setActive(false)}
          disabled={isLoading}
          onPress={() => setActive(!active)}
        >
          <View style={style.containerItem}>
            <Text style={style.daySelectText}>{weekday}</Text>
            <Image
              source={Theme.icons.white.caretDown}
              style={style.caretIcon}
            />
          </View>
        </TouchableHighlight>

        {active ? (
          <View style={style.dropdownContainer}>
            {days.map((day, index) => (
              <TouchableHighlight
                key={day}
                onPress={() => handleDrop(day)}
                style={style.containerItem}
              >
                <>
                  <Text style={style.dropdownItemText}>{day}</Text>
                  {index === 0 ? (
                    <Image
                      source={Theme.icons.white.caretDown}
                      style={[style.caretIcon, style.upsideDown]}
                    />
                  ) : null}
                </>
              </TouchableHighlight>
            ))}
          </View>
        ) : null}
      </View>
      <TouchableOpacity
        disabled={active || isLoading}
        style={{ zIndex: -1, width: 100 }}
        onPress={handleClearButton}
      >
        <Text style={style.clearText}>Clear All</Text>
      </TouchableOpacity>
    </>
  );
};
export default HomeChurchControls;
