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
  },
  clearIcon: {
    ...Style.icon,
  },
  searchInput: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    marginLeft: 16,
    height: 48,
    flex: 1,
  },
  container: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#54565A',
  },
});

interface Params {
  style: ViewStyle;
  searchText: string;
  placeholderLabel: string;
  handleTextChanged: (data: string) => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function SearchBar({
  style,
  searchText,
  placeholderLabel,
  handleTextChanged,
  accessibilityLabel,
  accessibilityHint,
}: Params): JSX.Element {
  return (
    <View style={[localStyle.container, style]}>
      <Image style={localStyle.searchIcon} source={Theme.icons.white.search} />
      <TextInput
        accessibilityRole="search"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        style={localStyle.searchInput}
        value={searchText}
        onChangeText={handleTextChanged}
        placeholderTextColor="#54565A"
        placeholder={placeholderLabel}
      />

      {searchText ? (
        <TouchableOpacity
          onPress={() => handleTextChanged('')}
          accessibilityLabel="Clear search text"
          accessibilityRole="button"
          testID="close-search"
          style={{ position: 'absolute', right: 0 }}
        >
          <Image
            style={localStyle.clearIcon}
            source={Theme.icons.white.closeCancel}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
