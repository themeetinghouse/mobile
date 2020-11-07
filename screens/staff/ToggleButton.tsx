import React, { useState } from 'react';
import { Theme } from '../../Theme.style';
import { Text, View, } from 'native-base';
import { StyleSheet, } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


const style = StyleSheet.create({
    button: {
        minWidth: "50%",
        flexGrow: 1,
        padding: 16,
        margin: 2,
        borderRadius: 50,
        color: "#C8C8C8",
        backgroundColor: "#1A1A1A",
    },
    selectedButton: {
        minWidth: "50%",
        padding: 16,
        flexGrow: 1,
        margin: 2,
        borderRadius: 50,
        color: "#FFF",
        backgroundColor: "#646469",
    },
    buttonText: {
        color: "#C8C8C8",
        textAlign: "center",
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.small
    },
    selectedButtonText: {
        color: "white",
    },
    buttonContainer: {
        height: 38,
        borderRadius: 50,
        marginHorizontal: 10,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: "#1A1A1A",
    }

})
interface Props {
    btnText_one: string
    btnText_two: string
    setSortByName: any
    sortByName: any
}

export default function ToggleButton(props: Props): JSX.Element {
    const { btnText_one, btnText_two, setSortByName, sortByName } = props;
    return (

        <View style={style.buttonContainer}>
            <TouchableOpacity onPress={() => setSortByName(false)} style={!sortByName ? style.selectedButton : style.button}>
                <View style={{ justifyContent: "center", flex: 1 }}><Text style={!sortByName ? [style.buttonText, style.selectedButtonText] : style.buttonText}>{btnText_one}</Text></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortByName(true)} style={sortByName ? style.selectedButton : style.button}>
                <View style={{ justifyContent: "center", flex: 1 }}><Text style={sortByName ? [style.buttonText, style.selectedButtonText] : style.buttonText}>{btnText_two}</Text></View>
            </TouchableOpacity>
        </View>
    )
}