import React, { useEffect, useState, useLayoutEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Thumbnail, } from 'native-base';
import StaffItem from "../staff/StaffItem";
import StaffDirectoryService from "../../services/StaffDirectoryService";
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
export type Staff = {
    FirstName: string
    LastName: string
    Email: string
    Position: string
    Phone: string
    sites: Array<string | null>
    Location: string | null
    Coordinator: boolean | null
    Teacher: boolean | null
}
export default function StaffList({ navigation }: Params): JSX.Element {
    const [staff, setStaffByName] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setisLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Staff Team',
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
            const staffResults = await StaffDirectoryService.loadStaffList()
            setStaffByName(staffResults.sort((a: any, b: any) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0)))
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
                            placeholderLabel="Search by name or location..."></SearchBar>
                        {/*<ToggleButton sortByName={sortByName} setSortByName={setSortByName} btnText_one={"By Location"} btnText_two={"By Last Name"}></ToggleButton> */}

                    </View>
                }
                data={staff.filter((item: any) => item.FirstName.toLowerCase().includes(searchText.toLowerCase()) || item.LastName.toLowerCase().includes(searchText.toLowerCase()) || searchText === "" || item.Location.toLowerCase().includes(searchText.toLowerCase()))}
                renderItem={({ item }: any) =>
                    <StaffItem navigation={navigation} staff={item}></StaffItem>
                }
                initialNumToRender={10}
            />
        </>
    )


}