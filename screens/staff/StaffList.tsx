import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { FlatList, StyleSheet, View, Text, SectionList, ActivityIndicator } from "react-native";
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
import LocationContext from '../../contexts/LocationContext'

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
    const location = useContext(LocationContext);
    const [staffByName, setStaffByName] = useState([]);
    const [staffByLocation, setStaffByLocation] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([])
    const [searchText, setSearchText] = useState("");
    const [sortByName, setSortByName] = useState(true);
    const [sectionList, setSectionList] = useState([]);
    const [isLoading, setisLoading] = useState(true);


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
        const loadStaff = async () => {
            const staffResults = await StaffDirectoryService.loadStaffList()
            const staffByLocationResults = await StaffDirectoryService.loadStaffListByLocation(location);
            //const sorted = staffResults.sort((a, b) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0))
            setStaffByName(staffResults.sort((a, b) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0)))
            setStaffByLocation(staffByLocationResults)
        }
        loadStaff()
    }, [])


    if (sortByName) {
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
                progressViewOffset={300}
                data={staffByName}
                renderItem={({ item }) => {
                    if (item.FirstName.toLowerCase().includes(searchText.toLowerCase()) || item.LastName.toLowerCase().includes(searchText.toLowerCase()) || searchText === "" || item.Location.toLowerCase().includes(searchText.toLowerCase()))
                        return (
                            <View><StaffItem staff={item}></StaffItem></View>
                        )
                    else {
                        return <></>
                    }
                }}
                keyExtractor={(item: any) => item.FirstName + item.LastName}
                initialNumToRender={10}
                onRefresh={() => <ActivityIndicator></ActivityIndicator>}
                refreshing={isLoading}
                onEndReachedThreshold={100}
                onEndReached={() => setisLoading(false)}
            />)
    }

    else {
        // missing being able to search by staff name in section list.
        return <SectionList
            sections={staffByLocation.filter((item: any) => searchText === "" || item.title.toLowerCase().includes(searchText.toLowerCase()))}
            ListHeaderComponent={
                <View style={style.content}>
                    <SearchBar
                        style={style.searchBar}
                        searchText={searchText}
                        handleTextChanged={(newStr) => setSearchText(newStr)}
                        placeholderLabel="Search by name or location..."></SearchBar>
                    <ToggleButton sortByName={sortByName} setSortByName={setSortByName} btnText_one={"By Location"} btnText_two={"By Last Name"}></ToggleButton>
                </ View>
            }
            renderSectionHeader={({ section: { locationid, title, data } }) => {
                if (data.length > 0) {
                    if (locationid === location?.locationData?.locationId) {
                        return <>
                            <Text style={{ marginLeft: 16, marginBottom: 4, color: "#646469", fontSize: 14, lineHeight: 18, fontFamily: Theme.fonts.fontFamilyBold }}>Your Home Parish</Text>
                            <Text style={{ marginLeft: 16, color: "white", fontWeight: "700", fontSize: 24, lineHeight: 32, fontFamily: Theme.fonts.fontFamilyRegular }}>{title}</Text>
                        </>
                    } else
                        return <Text style={{ marginLeft: 16, color: "white", fontWeight: "700", fontSize: 24, lineHeight: 32, fontFamily: Theme.fonts.fontFamilyRegular }}>{title}</Text>
                } else return null;
            }}
            renderSectionFooter={({ section: { data } }) => {
                if (data.length === 0) return null;
                else return <View style={{ marginBottom: 15 }}></View>
            }}
            renderItem={({ section: { title }, item }) => {
                if (item.FirstName.toLowerCase().includes(searchText.toLowerCase()) || item.LastName.toLowerCase().includes(searchText.toLowerCase()) || searchText === "" || item.Location.toLowerCase().includes(searchText.toLowerCase()))
                    return (
                        <View><StaffItem staff={item}></StaffItem></View>
                    )
                else {
                    return <></>
                }
            }}
            keyExtractor={(item: any) => item.FirstName + item.LastName}
            progressViewOffset={300}
            onRefresh={() => <ActivityIndicator></ActivityIndicator>}
            refreshing={isLoading}
            onEndReachedThreshold={100}
            onEndReached={() => setisLoading(false)}
        />
    }
}