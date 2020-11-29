import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, SectionList } from "react-native";
import { Thumbnail, Left, Right } from 'native-base';
import StaffItem from "./StaffItem";
import StaffDirectoryService from "../../services/StaffDirectoryService";
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import SearchBar from "../../components/SearchBar"
import { MoreStackParamList } from '../../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LocationContext from '../../contexts/LocationContext'
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
        marginBottom: 16
    },
})

interface Params {
    navigation: StackNavigationProp<MoreStackParamList>;
    route: RouteProp<MoreStackParamList, 'MoreScreen'>;
}

export default function StaffList({ navigation }: Params): JSX.Element {
    const location = useContext(LocationContext);
    const [staffByLocation, setStaffByLocation] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setisLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'My Parish Team',
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
            const staffByLocationResults = await StaffDirectoryService.loadStaffListByLocation(location as any);
            //const sorted = staffResults.sort((a, b) => (a.LastName > b.LastName) ? 1 : ((b.LastName > a.LastName) ? -1 : 0))
            setStaffByLocation(staffByLocationResults)
            setisLoading(false)
        }
        loadStaff()

        return () => {
            console.log("Cleanup")
        }
    }, [location])
    return (
        <>
            {isLoading ? <View style={{ zIndex: 100, position: "absolute", left: 50, right: 50, bottom: "50%" }}><ActivityIndicator animating={isLoading}></ActivityIndicator></View> : null}
            <SectionList
                stickySectionHeadersEnabled={false}
                sections={staffByLocation}
                ListHeaderComponent={
                    <View style={style.content}>
                        <SearchBar
                            style={style.searchBar}
                            searchText={searchText}
                            handleTextChanged={(newStr) => setSearchText(newStr)}
                            placeholderLabel="Search by name"></SearchBar>
                    </ View>
                }
                renderSectionHeader={({ section: { title, data } }) => {
                    if (data.filter((a) => a.LastName.toLowerCase().includes(searchText.toLowerCase()) || a.FirstName.toLowerCase().includes(searchText.toLowerCase())).length > 0) {
                        return <>
                            <Text style={{ left: 16, marginBottom: 4, color: "#646469", fontSize: 14, lineHeight: 18, fontFamily: Theme.fonts.fontFamilyBold }}>Your Home Parish</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Left>
                                    <Text style={{ left: 16, color: "white", fontSize: 24, lineHeight: 32, fontFamily: Theme.fonts.fontFamilyBold }}>{title}</Text>
                                </Left>
                            </View>
                        </>
                    } else return null; // no results message here
                }}
                renderSectionFooter={({ section: { data } }) => {
                    if (data.length === 0) return null;
                    else return <View style={{ marginBottom: 15 }}></View>
                }}
                renderItem={({ item }) => {
                    if (item.FirstName.toLowerCase().includes(searchText.toLowerCase()) || item.LastName.toLowerCase().includes(searchText.toLowerCase()))
                        return (
                            <StaffItem navigation={navigation} staff={item}></StaffItem>
                        )
                    else {
                        return <></>
                    }
                }}
                keyExtractor={(item: any) => item.FirstName + item.LastName}
                progressViewOffset={300}
            />
        </>)
}