import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Thumbnail, } from 'native-base';
import StaffItem from "../staff/StaffItem";
import StaffDirectoryService from "../../services/StaffDirectoryService";
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import SearchBar from "../../components/SearchBar"
import { HomeStackParamList } from '../../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
    navigation: StackNavigationProp<HomeStackParamList>;
    route: RouteProp<HomeStackParamList, 'EventDetailsScreen'>;
}

export default function StaffList({ navigation }: Params): JSX.Element {
    const [staff, setStaffByName] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setisLoading] = useState(true);


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Staff Team',
            headerTitleStyle: style.headerTitle,
            headerStyle: { backgroundColor: Theme.colors.background },
            headerLeft: function render() {
                return <TouchableOpacity onPress={() => navigation.goBack()} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                    <Thumbnail square source={Theme.icons.white.back} style={{ width: 24, height: 24 }} />
                    <Text style={{ color: 'white', fontSize: 16, transform: [{ translateX: -4 }] }}>More</Text>
                </TouchableOpacity>
            },
            headerLeftContainerStyle: { left: 16 },
            headerRight: function render() { return <View style={{ flex: 1 }} /> }
        })
        const loadStaff = async () => {
            const staffResults = await StaffDirectoryService.loadStaffList()
            setStaffByName(staffResults.sort((a: any, b: any) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0)))
        }
        loadStaff()
        return () => {
            console.log("Cleanup") // cancel async stuff here
        }
    }, [])
    return (
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
            progressViewOffset={300}
            data={staff}
            renderItem={({ item }: any) => {
                if (item.FirstName.toLowerCase().includes(searchText.toLowerCase()) || item.LastName.toLowerCase().includes(searchText.toLowerCase()) || searchText === "" || item.Location.toLowerCase().includes(searchText.toLowerCase()))
                    return (
                        <View><StaffItem staff={item}></StaffItem></View>
                    )
                else {
                    return <></>
                }
            }}
            initialNumToRender={10}
            onRefresh={() => <></>}
            refreshing={isLoading}
            onEndReachedThreshold={100}
            onEndReached={() => setisLoading(false)}
        />)


}