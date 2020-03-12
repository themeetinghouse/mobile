import React from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View, Body, Title } from 'native-base';
import IconButton from '../components/buttons/IconButton';
import moment from 'moment';
import WhiteButton from '../components/buttons/WhiteButton';
import { StatusBar } from 'react-native';

const style = {
    content: [ Style.cardContainer, {
        backgroundColor: Theme.colors.black,
        padding: 16
    }],
    header: [ Style.header, {
    }],
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerBody: {
        flexGrow: 3,
        justifyContent: "center",
    },
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },  
    headerTitle: [Style.header.title, {
        width: "100%",
    }],
    title: [Style.title, {
        marginTop: 130,
        marginBottom: 16,
    }],
    body: [Style.body, {
        marginBottom: 40,
    }],
}

export default function AnnouncementDetailScreen(props){

    const announcementItem = props.navigation.getParam("item");

    return (
    <Container>
        <Header style={style.header}>
            <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
            <Left style={style.headerLeft}>
                <Button transparent onPress={ () => props.navigation.goBack() }>
                    <Icon name='close' />
                </Button>
            </Left>
            <Body style={style.headerBody}>
                <Text style={style.headerTitle}>Announcement</Text>
            </Body>  
            <Right style={style.headerRight}>
            </Right>                      
        </Header>
        <Content style={style.content}>
            <Text style={style.title}>{announcementItem.title}</Text>
            <Text style={style.body}>{announcementItem.description}</Text>
            <WhiteButton label="Call to action"></WhiteButton>

        </Content>
    </Container>
    )
}
