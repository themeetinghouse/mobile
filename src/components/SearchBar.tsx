import React from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  View,
  Image,
  TextInput,
} from 'react-native';
import Theme, { Style } from '../Theme.style';

const localStyle = StyleSheet.create({
  searchIcon: {
    ...Style.icon,
    position: 'absolute',
  },
  clearIcon: {
    ...Style.icon,
  },
  searchInput: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    paddingLeft: 39,
    borderBottomColor: '#54565A',
    borderBottomWidth: 1,
    paddingBottom: 12,
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
  },
});

interface Params {
  style: ViewStyle;
  searchText: string;
  placeholderLabel: string;
  handleTextChanged: (data: string) => void;
}

export default function SearchBar({
  style,
  searchText,
  placeholderLabel,
  handleTextChanged,
}: Params): JSX.Element {
  return (
    <View style={[localStyle.container, style]}>
      <Image style={localStyle.searchIcon} source={Theme.icons.white.search} />
      <TextInput
        style={localStyle.searchInput}
        value={searchText}
        onChangeText={handleTextChanged}
        placeholderTextColor="#54565A"
        placeholder={placeholderLabel}
      />

      {searchText ? (
        <TouchableOpacity
          onPress={() => handleTextChanged('')}
          testID="close-search"
          style={{ position: 'absolute', right: 0 }}
        >
          <Image
            accessibilityLabel="Close Search"
            style={localStyle.clearIcon}
            source={Theme.icons.white.closeCancel}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
