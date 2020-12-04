import React, { useEffect, useState, useLayoutEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Thumbnail, } from 'native-base';
import TeacherItem from "./TeacherItem";
import SpeakersService from "../../services/SpeakersService";
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import SearchBar from "../../components/SearchBar"
import { StackNavigationProp } from '@react-navigation/stack';
import { MoreStackParamList } from '../../navigation/MainTabNavigator';
import { RouteProp } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ActivityIndicator from '../../components/ActivityIndicator';

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.black,
            padding: 16,
        }
    },
    header: Style.header,
    headerTitle: HeaderStyle.title,
    searchBar: {

    },
})

interface Params {
    navigation: StackNavigationProp<MoreStackParamList>;
    route: RouteProp<MoreStackParamList, 'MoreScreen'>;
}
export default function TeacherList({ navigation }: Params): JSX.Element {
    const [searchText, setSearchText] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [speakers, setSpeakers]: any = useState([]);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'All Teachers',
            headerTitleStyle: style.headerTitle,
            headerStyle: { backgroundColor: Theme.colors.background },
            headerLeft: function render() {
                return <TouchableOpacity onPress={() => navigation.goBack()} style={{ display: 'flex', flexDirection: 'row', paddingRight: 12, paddingBottom: 12, paddingTop: 12 }} >
                    <Thumbnail square source={Theme.icons.white.back} style={{ width: 24, height: 24 }} />
                    <Text style={{ color: 'white', fontSize: 16, transform: [{ translateX: -4 }] }}>More</Text>
                </TouchableOpacity>
            },
            headerLeftContainerStyle: { left: 16 },
            headerRight: function render() { return <View style={{ flex: 1 }} /> }
        })
    }, [navigation])
    useEffect(() => {
        const loadStaff = async () => {
            setisLoading(true)
            const speakers = await SpeakersService.loadSpeakersList()
            setSpeakers(speakers.items)
            setisLoading(false)
        }
        loadStaff()
        return () => {
            console.log("Cleanup") // cancel async stuff here
        }
    }, [])
    return (
        <>
            {isLoading ? <View style={{ zIndex: 100, position: "absolute", left: 50, right: 50, bottom: "50%" }}><ActivityIndicator animating={isLoading}></ActivityIndicator></View> : null}
            <FlatList
                ListHeaderComponentStyle={style.header}
                ListHeaderComponent={
                    <View style={style.content}>
                        <SearchBar
                            style={style.searchBar}
                            searchText={searchText}
                            handleTextChanged={(newStr) => setSearchText(newStr)}
                            placeholderLabel="Search by name..."></SearchBar>
                    </View>
                }
                data={speakers.filter((item: any) => item.name.toLowerCase().includes(searchText.toLowerCase()) || searchText === "")}
                renderItem={({ item }: any) =>
                    <TeacherItem navigation={navigation} teacher={item}></TeacherItem>
                }
                initialNumToRender={10}
            />
        </>
    )

}