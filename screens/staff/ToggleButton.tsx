import React, { useState } from 'react';
import { Theme } from '../../Theme.style';
import { Text, View, } from 'native-base';
import { StyleSheet, } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


const style = StyleSheet.create({
    button: {
        flex: 1,
        padding: 16,
        margin: 2,
        borderRadius: 50,
        color: "#C8C8C8",
        backgroundColor: "#1A1A1A",
    },
    selectedButton: {
        padding: 16,
        flex: 1,
        margin: 2,
        borderRadius: 50,
        color: "#FFF",
        backgroundColor: "#646469",
    },
    buttonText: {
        color: "white",
        width: 140,
        textAlign: "center",
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.small
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
                <View style={{ justifyContent: "center", flex: 1 }}><Text style={style.buttonText}>{btnText_one}</Text></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortByName(true)} style={sortByName ? style.selectedButton : style.button}>
                <View style={{ justifyContent: "center", flex: 1 }}><Text style={style.buttonText}>{btnText_two}</Text></View>
            </TouchableOpacity>
        </View>
    )
}