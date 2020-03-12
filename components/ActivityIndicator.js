import React from 'react';
import { View, ActivityIndicator as NativeActivityIndicator } from 'react-native';
import Theme from '../Theme.style';

const style = {
    container: {
        padding: 15
    }
}

export default function ActivityIndicator(){
    return (
        <View style={style.container}>
            <NativeActivityIndicator size="large" color={Theme.colors.white}></NativeActivityIndicator>
        </View>
    )
}