import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Theme from '../../../src/Theme.style';
import { useSearchContext } from './SearchContext';
import { SearchScreenActionType } from './SearchScreenTypes';
const Styles = StyleSheet.create({
  Container: {
    marginTop: 30,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    justifyContent: 'space-between',
    paddingLeft: 16,
    width: Dimensions.get('window').width,
    paddingRight: 16,
  },
  ButtonContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  ButtonContainerActive: {
    borderBottomColor: '#FFF',
  },
  ButtonText: {
    color: '#C8C8C8',
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: 13,
    lineHeight: 30,
    textAlign: 'center',
    borderRadius: 2,
    backgroundColor: '#000',
  },
  ButtonTextActive: {
    color: '#FFF',
  },
});

export default function SearchFilterButtons() {
  const items = ['Everything', 'Series & Sermons', 'Notes', 'My Comments'];
  const { state, dispatch } = useSearchContext();

  const handleCategorySelection = (category: string) => {
    return dispatch({
      type: SearchScreenActionType.SET_SEARCH_CATEGORY,
      payload: category,
    });
  };

  return (
    <View style={Styles.Container}>
      {items.map((item) => {
        const isActive = item === state.searchCategory;
        const textStyle = isActive ? Styles.ButtonTextActive : {};
        const containerStyle = isActive ? Styles.ButtonContainerActive : {};
        return (
          <TouchableOpacity
            style={[Styles.ButtonContainer, containerStyle]}
            onPress={() => handleCategorySelection(item)}
            key={item}
          >
            <Text style={[Styles.ButtonText, textStyle]}>{item}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
