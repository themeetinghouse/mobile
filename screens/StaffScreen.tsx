import React, { useEffect, useState } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, Text, Content, View, Thumbnail, } from 'native-base';
import { StyleSheet, } from 'react-native';
import { HomeStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SearchBar from "../components/SearchBar"
import StaffList from './staff/StaffList';
import ToggleButton from "./staff/ToggleButton";

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


export default function StaffScreen({ navigation }: Params): JSX.Element {
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

    const [searchText, setSearchText] = useState("");
    const [sortByName, setSortByName] = useState(false);
    useEffect(() => {
        console.log("Changing sorting method")
    }, [sortByName])

    return (
        <Container>
            <Content style={style.content}>
                <SearchBar
                    style={style.searchBar}
                    searchText={searchText}
                    handleTextChanged={(newStr) => setSearchText(newStr)}
                    placeholderLabel="Search by name or location..."></SearchBar>
                <ToggleButton sortByName={sortByName} setSortByName={setSortByName} btnText_one={"By Location"} btnText_two={"By Last Name"}></ToggleButton>
                <View style={{ backgroundColor: "black" }}>
                    <StaffList sortByName={sortByName}></StaffList>
                </View>
            </Content>

        </Container >
    )
}