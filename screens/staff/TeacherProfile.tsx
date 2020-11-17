import { Thumbnail } from 'native-base';
import React, { useState, memo, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, Text, Image, Linking, Platform } from 'react-native';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import CachedImage from "react-native-expo-cached-image";
import SearchBar from "../../components/SearchBar"
import TeachingListItem from "../../components/teaching/TeachingListItem";
import { StackNavigationProp } from '@react-navigation/stack';
import { MoreStackParamList } from '../../navigation/MainTabNavigator';
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
        marginTop: 24,
        flex: 1
    },
})
interface Props {
    navigation: StackNavigationProp<MoreStackParamList> | any;
    route: any;
}

function TeacherProfile({ navigation, route }: Props): JSX.Element {
    const [searchText, setSearchText] = useState("");
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: '',
            headerTitleStyle: style.headerTitle,
            headerStyle: { backgroundColor: "black" },
            headerLeft: function render() {
                return <TouchableOpacity onPress={() => navigation.goBack()} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                    <Thumbnail square source={Theme.icons.white.back} style={{ width: 24, height: 24 }} />
                    <Text style={{ color: 'white', fontSize: 16, transform: [{ translateX: -4 }] }}></Text>
                </TouchableOpacity>
            },
            headerLeftContainerStyle: { left: 16 },
            headerRight: function render() {
                return (
                    <View style={{ flexDirection: "column", flex: 1, }}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                            {route.params.staff.Phone ?
                                <TouchableOpacity onPress={() => Linking.openURL(`tel:${route.params.staff.Phone}`)} style={style.iconContainer}>
                                    <Thumbnail style={style.icon} source={Theme.icons.white.phone} square></Thumbnail>
                                </TouchableOpacity> : null}
                            {route.params.staff.Email ?
                                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${route.params.staff.Email}`)} style={style.iconContainer}>
                                    <Thumbnail style={style.icon} source={Theme.icons.white.contact} square></Thumbnail>
                                </TouchableOpacity>
                                : null}
                        </View>
                    </View>
                )
            }
        })
    }, [navigation])
    return (
        <View style={style.container}>
            <View>
                <View style={style.pictureContainer}>
                    {Platform.OS === "android" ?
                        <CachedImage style={style.picture} source={{ uri: route.params.staff.uri }} />
                        :
                        <Image style={style.picture} source={{ uri: route.params.staff.uri }} />}
                </View>
                <Text style={style.Name}>{route.params.staff.FirstName} {route.params.staff.LastName}</Text>
                <Text style={style.Position}>{route.params.staff.Position}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
                <SearchBar
                    style={style.searchBar}
                    searchText={searchText}
                    handleTextChanged={(newStr) => setSearchText(newStr)}
                    placeholderLabel="Search sermons..."></SearchBar>
            </View>
            <View style={style.listContentContainer}>
                <ScrollView>
                    {route.params.staff.Teachings ? route.params.staff.Teachings
                        .sort((a: any, b: any) => (a.video.publishedDate > b.video.publishedDate) ? -1 : ((b.video.publishedDate > a.video.publishedDate) ? 1 : 0))
                        .filter((a: any) => searchText === "" || a.video.episodeTitle.toLowerCase().includes(searchText.toLowerCase()) || a.video.seriesTitle.toLowerCase().includes(searchText.toLowerCase()))
                        .map((item: any) => {
                            return <TeachingListItem
                                key={item.id}
                                teaching={item.video}
                                handlePress={() => navigation.navigate('SermonLandingScreen', { item: item.video })} />
                        }) : null}
                </ScrollView>
            </View>
        </View >
    )
}
export default memo(TeacherProfile);