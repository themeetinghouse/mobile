import { Thumbnail } from 'native-base';
import React, { useState, memo } from 'react';
import { View, StyleSheet, Text, Image, Platform } from 'react-native';
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
    fallBackPicture: {
        height: 23,
        width: 20
    },
    Name: {
        color: "white",
        fontSize: 16,
        lineHeight: 24,
        fontFamily: Theme.fonts.fontFamilyBold
    },
    Position: {
        marginTop: 2,
        maxWidth: "70%",
        minWidth: "70%",
        color: "white",
        fontFamily: Theme.fonts.fontFamilyRegular,
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
    icon: { ...Style.icon, width: 23, height: 23, },
    iconContainer: {
        justifyContent: "center",
        padding: 16
    },
})
interface Props {
    navigation: any;
    staff: {
        FirstName: string
        LastName: string
        Email: string
        Position: string
        Phone: string
        sites: Array<string | null>
        Location: string | null
        Coordinator: boolean | null
        Teachings: Array<string | null>
    }
}

function StaffItem(props: Props): JSX.Element {
    const uriError = () => {
        setUri(Theme.icons.white.user)
    }
    const determineUri = (ev: any) => {
        let staffType;
        if (ev) {
            staffType = "Coordinator"
        }
        else {
            staffType = "Staff"
        }
        switch (staffType) {
            case "Coordinator":
                if (Platform.OS === "ios") return { uri: `https://themeetinghouse.com/cache/320/static/photos/coordinators/${props.staff.sites[0]}_${props.staff.FirstName}_${props.staff.LastName}_app.jpg`, cache: 'default' }
                else return { uri: `https://themeetinghouse.com/cache/320/static/photos/coordinators/${props.staff.sites[0]}_${props.staff.FirstName}_${props.staff.LastName}_app.jpg` }
            case "Staff":
                if (Platform.OS === "ios") return { uri: `https://themeetinghouse.com/cache/320/static/photos/staff/${props.staff.FirstName}_${props.staff.LastName}_app.jpg`, cache: 'default' }
                else return { uri: `https://themeetinghouse.com/cache/320/static/photos/staff/${props.staff.FirstName}_${props.staff.LastName}_app.jpg` }
            default:
                return Theme.icons.white.user
        }
    }
    const [uri, setUri] = useState(determineUri(props.staff.Coordinator))
    const parseTelephone = (tel: string) => {
        const telephone = tel.split(',')[0].replace(/\D/g, '')
        const extension = tel.split(',')[1] ? tel.split(',')[1].replace(/\D/g, '') : ""
        if (telephone && extension) return telephone + "," + extension
        else return telephone
    }
    return (
        <View style={style.container}>
            <View style={style.pictureContainer}>
                {Platform.OS === "android" ?
                    uri !== Theme.icons.white.user ?
                        props.staff.Coordinator ?
                            <CachedImage style={style.picture} onError={() => uriError()} source={uri} />
                            :
                            <CachedImage style={style.picture} onError={() => uriError()} source={uri} />
                        :
                        <Image style={style.fallBackPicture} source={Theme.icons.white.user}></Image>
                    : uri !== Theme.icons.white.user ?
                        props.staff.Coordinator ?
                            <Image style={style.picture} onError={() => uriError()} source={uri} />
                            :
                            <Image style={style.picture} onError={() => uriError()} source={uri} />
                        :
                        <Image style={style.fallBackPicture} source={Theme.icons.white.user}></Image>}
            </View>
            <View style={{ marginLeft: 15, flexDirection: "column" }}>
                {props.staff.FirstName && props.staff.LastName ?
                    <Text style={style.Name}>{props.staff.FirstName} {props.staff.LastName}</Text>
                    : null}
                {props.staff.Position ?
                    <Text style={style.Position}>{props.staff.Position}</Text>
                    : null}
                {props.staff.Teachings ?
                    <TouchableOpacity onPress={() => {
                        props.navigation.push('TeacherProfile', {
                            staff: { ...props.staff, ...uri, Phone: parseTelephone(props.staff.Phone) },
                            navigation: props.navigation
                        })
                    }
                    }>
                        <Text style={style.footerText}>
                            View Teaching
                        </Text>
                    </TouchableOpacity>
                    : null}
            </View>
            <View style={{ flexDirection: "column", flex: 1, }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    {props.staff.Phone ?
                        <TouchableOpacity onPress={() => Linking.openURL(`tel:${parseTelephone(props.staff.Phone)}`)} style={style.iconContainer}>
                            <Thumbnail style={style.icon} source={Theme.icons.white.phone} square></Thumbnail>
                        </TouchableOpacity> : null}
                    {props.staff.Email ?
                        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${props.staff.Email}`)} style={style.iconContainer}>
                            <Thumbnail style={style.icon} source={Theme.icons.white.contact} square></Thumbnail>
                        </TouchableOpacity>
                        : null}
                </View>
            </View>
        </View >

    )
}
export default memo(StaffItem);