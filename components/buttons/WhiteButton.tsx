import React from 'react';
import { View, Button, Text } from 'native-base';
import Theme from '../../Theme.style';
import { ViewStyle } from 'react-native';

const style = {
    button: {
        backgroundColor: Theme.colors.white,
        borderRadius: 0,
        height: '100%'
    },
    label: {
        color: Theme.colors.black,
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.medium,
    },
    buttonOutlined: {
        backgroundColor: 'transparent',
        borderRadius: 0,
        height: '100%',
        borderWidth: 3,
        borderColor: 'white'
    },
    labelOutlined: {
        color: 'white',
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.medium,
    }
}

interface Props {
    style?: ViewStyle;
    label: string;
    onPress: () => any;
    outlined?: boolean;
}

export default function WhiteButton(props: Props): JSX.Element {
    return (
        <View style={props.style}>
            <Button style={props.outlined ? style.buttonOutlined : style.button} block onPress={props.onPress}>
                <Text style={props.outlined ? style.labelOutlined : style.label} uppercase={false}>{props.label}</Text>
            </Button>
        </View>
    )
}