import React from 'react';
import { View, Thumbnail, Item, Input } from 'native-base';
import { TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import Theme, { Style } from '../Theme.style';

const localStyle = StyleSheet.create({
  searchIcon: Style.icon,
  searchInput: {
    color: Theme.colors.white,
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.medium,
    paddingLeft: 16,
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
    <View style={style}>
      <Item>
        <Thumbnail
          style={localStyle.searchIcon}
          source={Theme.icons.white.search}
          square
        />
        <Input
          style={localStyle.searchInput}
          value={searchText}
          onChangeText={handleTextChanged}
          placeholder={placeholderLabel}
        />

        {searchText ? (
          <TouchableOpacity
            onPress={() => handleTextChanged('')}
            testID="close-search"
          >
            <Thumbnail
              accessibilityLabel="Close Search"
              style={localStyle.searchIcon}
              source={Theme.icons.white.closeCancel}
              square
            />
          </TouchableOpacity>
        ) : null}
      </Item>
    </View>
  );
}
