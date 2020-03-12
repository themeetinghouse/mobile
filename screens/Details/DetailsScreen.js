import React from 'react';
import { Container, Text, Button, Icon, Content, Header } from 'native-base';

export default function DetailsScreen(props){
    console.log("Showing details screen");
    return (
        <Container style={{backgroundColor: "#FFFFFF"}}>
            <Header></Header>
            <Content>
                {/* <Text>Hello Details Screen</Text>
                <Button warning onPress={() => props.navigation.goBack()}><Text>Go back</Text></Button> */}
                <Button dark><Icon name="home"></Icon><Text>Welcome to the button</Text></Button>
            </Content>
        </Container>
        // <ScrollView style={{flex: 1, backgroundColor: "#FFFFFF"}}>
        //     <Text>Hello Details Screen</Text>
        //     <Button title="Go back" onPress={() => props.navigation.goBack()}></Button>
        // </ScrollView>
    );
}

DetailsScreen.navigationOptions = {
    title: 'Details'
}