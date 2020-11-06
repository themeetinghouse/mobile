import { Thumbnail } from 'native-base';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Theme, Style } from '../../Theme.style';
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler"
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
        backgroundColor: "#54565A",
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
        padding: 16
    },
})
interface Staff {
    staff: {
        name: string
        title: string
        teaching: string
        phone: string
        email: string
    }
}
export default function StaffItem({ staff }: Staff): JSX.Element {
    return (
        <View style={style.container}>
            <Thumbnail style={[style.picture]} source={Theme.icons.white.user}></Thumbnail>
            <View style={{ marginLeft: 15, flexDirection: "column" }}>
                {staff.name ?
                    <Text style={style.name}>{staff.name}</Text>
                    : null}
                {staff.title ?
                    <Text style={style.title}>{staff.title}</Text>
                    : null}
                {staff.teaching ?
                    <TouchableOpacity>
                        <Text style={style.footerText}>
                            View Teaching
                    </Text>
                    </TouchableOpacity>
                    : null}

            </View>
            <View style={{ flexDirection: "column", flex: 1, }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <TouchableOpacity onPress={() => console.log("press")} style={style.iconContainer}>
                        <Thumbnail style={style.icon} source={Theme.icons.white.phone} square></Thumbnail>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("press")} style={style.iconContainer}>
                        <Thumbnail style={style.icon} source={Theme.icons.white.contact} square></Thumbnail>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    )
}