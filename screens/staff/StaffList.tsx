import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text } from "react-native";
import { Thumbnail, } from 'native-base';
import StaffItem from "../staff/StaffItem";
import StaffDirectoryService from "../../services/StaffDirectoryService";
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import SearchBar from "../../components/SearchBar"
import ToggleButton from "../staff/ToggleButton";
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
        marginBottom: 16,
    },
})

interface Params {
    navigation: StackNavigationProp<HomeStackParamList>;
    route: RouteProp<HomeStackParamList, 'EventDetailsScreen'>;
}

export default function StaffList({ navigation }: Params): JSX.Element {
    const [staff, setStaff] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([])
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Staff Directory',
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
    }, [])
    useEffect(() => {
        const loadStaff = async () => {
            console.log("Fetching data from site")
            const staffResults = await StaffDirectoryService.loadStaffList()
            setStaff(staffResults)
            setFilteredStaff(staffResults)
        }
        if (staff.length === 0)
            loadStaff()
    }, [])


    const [searchText, setSearchText] = useState("");
    const [sortByName, setSortByName] = useState(false);

    useEffect(() => {
        setFilteredStaff(staff.filter((item: any) => item.FirstName.includes(searchText) || item.LastName.includes(searchText)))
    }, [searchText])
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
                    <ToggleButton sortByName={sortByName} setSortByName={setSortByName} btnText_one={"By Location"} btnText_two={"By Last Name"}></ToggleButton>
                </View>
            }
            data={filteredStaff || staff}
            renderItem={({ item }) => <StaffItem staff={item}></StaffItem>}
            keyExtractor={(item: any) => item.FirstName + item.LastName}
        />
    )
}