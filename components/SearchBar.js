import React, { useState } from 'react';
import { View, Thumbnail, Item, Input } from 'native-base';
import Theme, { Style } from '../Theme.style';
import { TouchableOpacity } from 'react-native';

const localStyle = {
    searchIcon: [ Style.icon, {}],
    searchInput: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
    },
}

export default function SearchBar({style, searchText, placeholderLabel, handleTextChanged }){
    return (
    <View style={style}>
        <Item>
            <Thumbnail style={localStyle.searchIcon} source={Theme.icons.white.search} square></Thumbnail>
            <Input style={localStyle.searchInput} value={searchText} onChangeText={handleTextChanged} placeholder={placeholderLabel}/>
            { searchText ? (
                <TouchableOpacity onPress={() => handleTextChanged("")}>
                    <Thumbnail style={localStyle.searchIcon} source={Theme.icons.white.closeCancel} square></Thumbnail>
                </TouchableOpacity>
                ) : null
            }
        </Item>
    </View>    

    )
}