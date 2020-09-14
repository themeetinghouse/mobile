import React from 'react';
import { View, Button, Text } from 'native-base';
import Theme from '../../Theme.style';
import { ViewStyle, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
    buttonBlack: {
        backgroundColor: 'black',
        borderRadius: 0,
        height: '100%'
    },
    labelBlack: {
        color: 'white',
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
})

interface Params {
    style?: ViewStyle;
    label: string;
    onPress?: () => any;
    outlined?: boolean;
    solidBlack?: boolean;
}

export default function WhiteButton({ style, label, onPress, outlined, solidBlack }: Params): JSX.Element {

    return (
        <View style={style}>
            <Button style={outlined ? styles.buttonOutlined : solidBlack ? styles.buttonBlack : styles.button} block onPress={onPress}>
                <Text style={outlined ? styles.labelOutlined : solidBlack ? styles.labelBlack : styles.label} uppercase={false}>{label}</Text>
            </Button>
        </View>
    )
}