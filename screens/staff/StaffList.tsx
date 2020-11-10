import React, { useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, View, Text, SectionList } from "react-native";
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
import LocationService from "../../services/LocationsService";
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
    const [staff, setStaff] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([])
    const sectionedList: any = [
        { locationid: "alliston", code: "ALLI", title: "Alliston", data: [] },
        { locationid: "brampton", code: "BRAM", title: "Brampton", data: [] },
        { locationid: "brantford", code: "BRFD", title: "Brantford", data: [] },
        { locationid: "burlington", code: "BURL", title: "Burlington", data: [] },
        { locationid: "ancaster", code: "HMAN", title: "Ancaster", data: [] },
        { locationid: "hamilton-mountain", code: "HMMT", title: "Hamilton Mountain", data: [] },
        { locationid: "hamilton-downtown", code: "HMDT", title: "Hamilton - Downtown", data: [] },
        { locationid: "toronto-high-park", code: "TOHP", title: "Toronto - High Park", data: [] },
        { locationid: "kitchener", code: "KIT", title: "Kitchener", data: [] },
        { locationid: "london", code: "LOND", title: "London", data: [] },
        { locationid: "newmarket", code: "NMKT", title: "Newmarket", data: [] },
        { locationid: "oakville", code: "OAKV", title: "Oakville", data: [] },
        { locationid: "ottawa", code: "OTTA", title: "Ottawa", data: [] },
        { locationid: "owen-sound", code: "OWSN", title: "Owen Sound", data: [] },
        { locationid: "parry-sound", code: "PRSN", title: "Parry Sound", data: [] },
        { locationid: "richmond-hill", code: "RHLL", title: "Richmond Hill", data: [] },
        { locationid: "sandbanks", code: "SAND", title: "Sandbanks", data: [] },
        { locationid: "toronto-east", code: "TOBC", title: "East Toronto", data: [] },
        { locationid: "toronto-downtown", code: "TODT", title: "Downtown Toronto", data: [] },
        { locationid: "toronto-uptown", code: "TOUP", title: "Toronto - Uptown", data: [] },
        { locationid: "waterloo", code: "WAT", title: "Waterloo", data: [] },
    ]

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
            console.log("Fetching data from site")
            const staffResults = await StaffDirectoryService.loadStaffList()
            setStaff(staffResults)
            setFilteredStaff(staffResults)
        }
        if (staff.length === 0)
            loadStaff()
    }, [])

    const filterStaff = () => {
        setFilteredStaff(staff.filter((item: any) => item.FirstName.includes(searchText) || item.LastName.includes(searchText)))
    }

    const [searchText, setSearchText] = useState("");
    const [sortByName, setSortByName] = useState(false);
    const [sectionList, setSectionList] = useState([]);

    useEffect(() => {
        filterStaff()
    }, [searchText])
    useEffect(() => {
        filteredStaff.map((staffItem: any) => {
            for (let x = 0; x < staffItem.sites.length; x++) {
                for (let i = 0; i < sectionedList.length; i++) {
                    if (staffItem.sites[x] === sectionedList[i].code) sectionedList[i].data.push(staffItem)
                }
            }
        })
        setSectionList(sectionedList.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)))
    }, [filteredStaff])
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
                data={filteredStaff.sort((a, b) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0))}
                renderItem={({ item }) => <StaffItem staff={item}></StaffItem>}
                keyExtractor={(item: any) => item.FirstName + item.LastName}
            />
        )
    }
    else {
        return (
            <SectionList
                sections={sectionList}
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
                renderSectionHeader={({ section: { title, data } }) => {
                    if (data.length !== 0) return <Text style={{ marginTop: 10, marginLeft: 10, color: "white", fontWeight: "700", fontSize: 24, lineHeight: 32, fontFamily: Theme.fonts.fontFamilyRegular }}>{title}</Text>
                    else return null
                }}
                renderItem={({ item }) => <StaffItem staff={item}></StaffItem>}
                keyExtractor={(item: any) => item.FirstName + item.LastName}
            />
        )
    }
}