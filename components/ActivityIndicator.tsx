import React from 'react';
import { View, ActivityIndicator as NativeActivityIndicator } from 'react-native';
import Theme from '../Theme.style';

const style = {
    container: {
        padding: 15
    }
}

interface Props {
    animating?: boolean
}

export default function ActivityIndicator(props: Props): JSX.Element {
    return (
        <View style={style.container}>
            <NativeActivityIndicator size="large" color={Theme.colors.white} animating={props.animating} ></NativeActivityIndicator>
        </View>
    )
}