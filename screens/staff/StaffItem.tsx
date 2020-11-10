import { Thumbnail } from 'native-base';
import React, { useState, useEffect, memo } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Theme, Style } from '../../Theme.style';
import { TouchableOpacity } from "react-native-gesture-handler"
import * as Linking from 'expo-linking';
import CachedImage from "react-native-expo-cached-image";
const style = StyleSheet.create({
    container: {
        marginTop: 6,
        padding: 15,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomLeftRadius: 25,
        borderColor: "gray",
    },
    pictureContainer: {
        marginTop: 0,
        borderRadius: 100,
        backgroundColor: "#54565A",
        width: 48,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    picture: {
        borderRadius: 100,
        justifyContent: 'center',
        width: 48,
        height: 48
    },
    Name: {
        color: "white",
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "700",
        fontFamily: Theme.fonts.fontFamilyRegular
    },
    Position: {
        marginTop: 2,
        maxWidth: "70%",
        minWidth: "70%",
        color: "white",
        fontWeight: "400",
        fontSize: 12,
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
interface Props {
    staff: {
        FirstName: string
        LastName: string
        Email: string
        Position: string
        Phone: string
        sites: Array<string | null>
        Location: string | null
    }
}
function StaffItem(props: Props): JSX.Element {
    const parseTelephone = (tel: string) => {
        const telephone = tel.split(',')[0].replace(/\D/g, '')
        const extension = tel.split(',')[1] ? tel.split(',')[1].replace(/\D/g, '') : ""
        if (telephone && extension) return telephone + "," + extension
        else return telephone
    }
    console.log(props.staff)
    return (
        <View style={style.container}>
            <View style={style.pictureContainer}><CachedImage style={style.picture} source={{ uri: `https://themeetinghouse.com/cache/160/static/photos/staff/${props.staff.FirstName}_${props.staff.LastName}_app.jpg` }} /*source={Theme.icons.white.user}*/></CachedImage></View>
            <View style={{ marginLeft: 15, flexDirection: "column" }}>
                {props.staff.FirstName && props.staff.LastName ?
                    <Text style={style.Name}>{props.staff.FirstName} {props.staff.LastName}</Text>
                    : null}
                {props.staff.Position ?
                    <Text style={style.Position}>{props.staff.Position}</Text>
                    : null}
                {false ?
                    <TouchableOpacity>
                        <Text style={style.footerText}>
                            View Teaching
                        </Text>
                    </TouchableOpacity>
                    : null}
            </View>
            <View style={{ flexDirection: "column", flex: 1, }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${parseTelephone(props.staff.Phone)}`)} style={style.iconContainer}>
                        <Thumbnail style={style.icon} source={Theme.icons.white.phone} square></Thumbnail>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(`mailto:${props.staff.Email}`)} style={style.iconContainer}>
                        <Thumbnail style={style.icon} source={Theme.icons.white.contact} square></Thumbnail>
                    </TouchableOpacity>
                </View>
            </View>
        </View >

    )
}
export default memo(StaffItem);