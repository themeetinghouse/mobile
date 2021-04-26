import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native';
import { Thumbnail } from 'native-base';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import { LocationData } from 'src/contexts/LocationContext';
import { Theme, Style } from '../../Theme.style';

interface Params {
  navigation: StackNavigationProp<MainStackParamList>;
  loc: LocationData;
}
// TODO: Add missing type
// TODO: white bottom border missing on postal code
const HomeChurchLocationSelect = ({ loc, navigation }: Params): JSX.Element => {
  const [selectedLocation, setSelectedLocation] = useState(loc?.locationName);
  const [postalCode, setPostalCode] = useState('');
  const style = StyleSheet.create({
    locationIcon: { ...Style.icon, marginRight: 20, alignSelf: 'center' },
    container: {
      backgroundColor: '#111111',
      margin: 16,
    },
    containerItem: {
      flexDirection: 'row',
      fontFamily: Theme.fonts.fontFamilyRegular,
      paddingHorizontal: 20,
      color: 'white',
      height: 56,
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
  return (
    <>
      <View style={style.container}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.push('LocationSelectionScreen', { persist: true })
          }
          style={style.containerItem}
        >
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              height: 56,
              marginLeft: 16,
            }}
          >
            <Thumbnail
              style={style.locationIcon}
              source={Theme.icons.white.location}
              square
            />
            <Text style={style.locationSelect}>{selectedLocation}</Text>
          </View>
        </TouchableWithoutFeedback>

        <TextInput
          accessibilityLabel="Add Postal Code"
          keyboardAppearance="dark"
          placeholder="Add postal code"
          placeholderTextColor="#646469"
          textContentType="none"
          keyboardType="default"
          multiline
          value={postalCode}
          onChange={(text) => {
            if (!text.nativeEvent.text.includes(' '))
              setPostalCode(text.nativeEvent.text);
          }}
          textAlignVertical="center"
          maxLength={6}
          autoCapitalize="characters"
          style={style.containerItem}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          setPostalCode('');
          setSelectedLocation('All Locations');
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
    </>
  );
};
export default HomeChurchLocationSelect;
