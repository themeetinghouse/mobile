import { Thumbnail } from 'native-base';
import React, { useState, memo, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Platform, Linking, Dimensions } from 'react-native';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import CachedImage from "react-native-expo-cached-image";
import SearchBar from "../../components/SearchBar"
import TeachingListItem from "../../components/teaching/TeachingListItem";
const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    pictureContainer: {
        marginTop: 30,
        flexDirection: "row",
        borderRadius: 100,
        backgroundColor: "#54565A",
        alignSelf: "center",
        width: 120,
        height: 120,
    },
    picture: {
        borderRadius: 100,
        width: 120,
        height: 120
    },
    Name: {
        marginTop: 24,
        color: "white",
        fontSize: 24,
        lineHeight: 32,
        fontFamily: Theme.fonts.fontFamilyBold,
        textAlign: "center"
    },
    Position: {
        textAlign: "center",
        marginTop: 2,
        color: "#C8C8C8",
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: 16,
        lineHeight: 24,
    },
    icon: { ...Style.icon, width: 23, height: 23, },
    iconContainer: {
        justifyContent: "center",
        padding: 16
    },
    header: Style.header,
    headerTitle: HeaderStyle.title,
    searchBar: {
        flex: 1,
        marginHorizontal: 16
    },
    listContentContainer: {
        paddingLeft: 16,
        paddingRight: 16,
    },
})
interface Props {
    navigation: any;
    staff: any;
    route: any
}

function TeacherProfile(props: Props): JSX.Element {
    const [searchText, setSearchText] = useState("");
    const parseTelephone = (tel: string) => {
        const telephone = tel.split(',')[0].replace(/\D/g, '')
        const extension = tel.split(',')[1] ? tel.split(',')[1].replace(/\D/g, '') : ""
        if (telephone && extension) return telephone + "," + extension
        else return telephone
    }
    useEffect(() => {
        //console.log(props.route.params.staff)
        props.navigation.setOptions({
            headerShown: true,
            title: '',
            headerTitleStyle: style.headerTitle,
            headerStyle: { backgroundColor: "black" },
            headerLeft: function render() {
                return <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                    <Thumbnail square source={Theme.icons.white.back} style={{ width: 24, height: 24 }} />
                    <Text style={{ color: 'white', fontSize: 16, transform: [{ translateX: -4 }] }}>Staff Team</Text>
                </TouchableOpacity>
            },
            headerLeftContainerStyle: { left: 16 },
            headerRight: function render() {
                return (
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            {props.route.params.staff.Phone ?
                                <TouchableOpacity onPress={() => Linking.openURL(`tel:${parseTelephone(props.route.params.staff.Phone)}`)} style={style.iconContainer}>
                                    <Thumbnail style={style.icon} source={Theme.icons.white.phone} square></Thumbnail>
                                </TouchableOpacity> : null}
                            {props.route.params.staff.Email ?
                                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${props.route.params.staff.Email}`)} style={style.iconContainer}>
                                    <Thumbnail style={style.icon} source={Theme.icons.white.contact} square></Thumbnail>
                                </TouchableOpacity>
                                : null}
                        </View>
                    </View>
                )
            }
        })
    }, [])
    return (
        <>
            <View style={style.container}>
                <View>
                    <View style={style.pictureContainer}>
                        <CachedImage style={style.picture} source={{ uri: `https://themeetinghouse.com/cache/360/static/photos/staff/${props.route.params.staff.FirstName}_${props.route.params.staff.LastName}_app.jpg` }} />
                    </View>
                    <Text style={style.Name}>{props.route.params.staff.FirstName} {props.route.params.staff.LastName}</Text>
                    <Text style={style.Position}>{props.route.params.staff.Position}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <SearchBar
                        style={style.searchBar}
                        searchText={searchText}
                        handleTextChanged={(newStr) => setSearchText(newStr)}
                        placeholderLabel="Search by name or location..."></SearchBar>
                </View>
                <View style={style.listContentContainer}>
                    <ScrollView>
                        {props.route.params.staff.Teachings ? props.route.params.staff.Teachings.map((item: any, index: number) => {
                            return <TeachingListItem
                                key={item.id}
                                teaching={item.video}
                                handlePress={() => props.navigation.push('SermonLandingScreen', { item: item })} />
                        }) : null}
                    </ScrollView>
                </View>
            </View >

        </>

    )
}
export default memo(TeacherProfile);