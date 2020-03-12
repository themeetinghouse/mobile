import React, { useCallback, useEffect, useState } from 'react';
import { Header, Body, Subtitle, Title, Icon, View, Button, Text, Right, Left, Thumbnail } from "native-base";

import { Style, Theme } from '../../Theme.style';
import { StatusBar } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import LocationsService from '../../services/LocationsService';

const style = {
    left: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    body: {
        flexGrow: 3,
        justifyContent: "center",
    },
    right: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerButton: {
        backgroundColor: Style.header.backgroundColor, 
        paddingLeft: 20, 
        paddingRight: 20
    },
    icon: [Style.icon, {
       // Inherited
    }],
    title: [Style.header.title, {
        // Inherited
    }],
    subtitle: [Style.header.subtitle, {
        // Inherited
    }],
    locationContainer: {
        display: "flex", 
        flexDirection: "row", 
        alignItems: "baseline",
    },
    buttonContentsContainer: {
        display: "flex", 
        flexDirection: "column",
    },
    locationName: {
        marginRight: 5,
    },
}

function LocationSelectHeader({navigation, children, location}){

    return (
        <Header style={Style.header}>
            <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />

            <Left style={style.left}></Left>

            <Body style={style.body}>
                <Button style={style.headerButton} onPress={ () => navigation.push('LocationSelectionScreen') }>
                    <View style={style.buttonContentsContainer}>
                        <Text style={style.title}>{children}</Text>
                        <View style={style.locationContainer}>
                            <Text style={[style.subtitle, style.locationName]}>{location.name}</Text>
                            <Icon style={style.subtitle} name='arrow-dropdown'></Icon> 
                        </View>

                    </View>
                </Button>
            </Body>

            <Right style={style.right}>
                <Button icon transparent style={{}} onPress={() => console.log('profile clicked')}>
                    <Thumbnail source={Theme.icons.white.user} style={style.icon}></Thumbnail>
                </Button>
            </Right>

        </Header>
    )
}

function mapStateToProps(state){
    return {
        location: state.location.location
    }
}

export default connect(mapStateToProps)(withNavigation(LocationSelectHeader));