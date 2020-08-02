import React from 'react';
import { View, Button, Text } from 'native-base';
import Theme from '../../Theme.style';
import { ViewStyle } from 'react-native';

const style = {
    button: {
        backgroundColor: Theme.colors.white,
        borderRadius: 0
    },
    label: {
        color: Theme.colors.black,
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.medium,
    }
}

interface Props {
    style?: ViewStyle;
    label: string;
}

export default function WhiteButton(props: Props): JSX.Element {
    return (
        <View style={props.style}>
            <Button style={style.button} block>
                <Text style={style.label} uppercase={false}>{props.label}</Text>
            </Button>
        </View>
    )
}