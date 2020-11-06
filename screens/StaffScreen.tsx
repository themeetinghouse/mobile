import React, { useEffect, useState } from 'react';
import { Theme, Style, HeaderStyle } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Header, View, Thumbnail, } from 'native-base';
import { SafeAreaView, StatusBar, StyleSheet, VirtualizedList, } from 'react-native';
import { HomeStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import SearchBar from "../components/SearchBar"


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

    button: {
        flex: 1,
        padding: 16,
        margin: 2,
        borderRadius: 50,
        color: "#C8C8C8",
        backgroundColor: "#1A1A1A",
    },
    selectedButton: {
        padding: 16,
        flex: 1,
        margin: 2,
        borderRadius: 50,
        color: "#FFF",
        backgroundColor: "#646469",
    },
    buttonText: {
        color: "white",
        width: 140,
        textAlign: "center",
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.small

    },
    buttonContainer: {
        height: 38,
        borderRadius: 50,
        marginHorizontal: 10,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: "#1A1A1A",
    }

})

interface Params {
    navigation: StackNavigationProp<HomeStackParamList>;
    route: RouteProp<HomeStackParamList, 'EventDetailsScreen'>;
}


export default function StaffScreen({ navigation, route }: Params): JSX.Element {
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

    const [staff, setStaff] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [sortByName, setSortByName] = useState(false)
    return (
        <Container>
            <Content style={style.content}>
                <SearchBar
                    style={style.searchBar}
                    searchText={searchText}
                    handleTextChanged={(newStr) => setSearchText(newStr)}
                    placeholderLabel="Search by name or location..."></SearchBar>
                <View style={style.buttonContainer}>
                    <TouchableOpacity onPress={() => setSortByName(true)} style={sortByName ? style.selectedButton : style.button}><View style={{ justifyContent: "center", flex: 1 }}><Text style={style.buttonText}>By Location</Text></View></TouchableOpacity>
                    <TouchableOpacity onPress={() => setSortByName(false)} style={!sortByName ? style.selectedButton : style.button}><View style={{ justifyContent: "center", flex: 1 }}><Text style={style.buttonText}>By Last Name</Text></View></TouchableOpacity>
                </View>
                <View>

                </View>
            </Content>
        </Container >
    )
}
