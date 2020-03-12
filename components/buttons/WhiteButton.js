import React from 'react';
import { View, Button, Text } from 'native-base';
import Theme, { Style } from '../../Theme.style';

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

export default function WhiteButton(props){
    return (
        <View style={props.style}>
            <Button style={style.button} block>
                <Text style={style.label} uppercase={false}>{props.label}</Text>
            </Button>
        </View>
    )
}