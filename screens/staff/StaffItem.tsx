import { Thumbnail } from 'native-base';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Theme, Style } from '../../Theme.style';
import { Image } from "react-native";
const style = StyleSheet.create({
    container: {
        marginTop: 6,
        padding: 15,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomLeftRadius: 25,
        borderColor: "gray"
    },
    picture: {
        marginTop: 0,
        backgroundColor: "white",
        borderRadius: 100,
        width: 48,
        height: 48
    },
    name: {
        color: "white",
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "700",
        fontFamily: Theme.fonts.fontFamilyRegular
    },
    title: {
        marginTop: 2,
        color: "white",
        fontWeight: "400",
        fontSize: 12
    },
    footerText: {
        marginTop: 6,
        color: "white",
        textDecorationLine: "underline",
        fontWeight: "400",
        fontSize: 12,
        lineHeight: 18
    },
    icon: { ...Style.icon, width: 21, height: 21, },
    iconContainer: {
        justifyContent: "center",
        margin: 2,
        padding: 0
    },
})
interface Staff {
    staff: {
        name: string
        title: string
    }
}
export default function StaffItem({ staff }: Staff): JSX.Element {
    return (
        <View style={style.container}>
            <View style={style.picture}></View>
            <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Text style={style.name}>{staff.name}</Text>
                <Text style={style.title}>{staff.title}</Text>
                <Text style={style.footerText}>View Teaching</Text>
            </View>
            <View style={{ flexDirection: "column", flex: 1, margin: 10 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                    <View style={style.iconContainer}>
                        <Thumbnail style={style.icon} source={Theme.icons.white.phone} square></Thumbnail>
                    </View>
                    <View style={style.iconContainer}>
                        <Thumbnail style={style.icon} source={Theme.icons.white.contact} square></Thumbnail>
                    </View>
                </View>
            </View>
        </View>

    )
}