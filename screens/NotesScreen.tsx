import React, { useState, useEffect } from 'react';
import NotesService from '../services/NotesService';
import { Text, Container, Header, Left, Body, Right, Button, Content, Icon } from 'native-base';
import Theme, { Style, HeaderStyle } from '../Theme.style';
import { StatusBar, TextStyle, ViewStyle, StyleSheet } from 'react-native';
import NoteReader from '../components/teaching/notes/NoteReader';
import { TeachingStackParamList } from '../navigation/MainTabNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import GestureRecognizer from 'react-native-swipe-gestures';
import { RouteProp } from '@react-navigation/native';

interface Style {
    content: any;
    header: any;
    headerLeft: any;
    headerBody: ViewStyle;
    headerRight: any;
    headerTitle: TextStyle;
    headerTitleSelected: any;
    noteItem: any;
    note: TextStyle;
    verseRelated: TextStyle;
    heading1: TextStyle;
    questionHeading: TextStyle;
    question: TextStyle;
    subQuestion: TextStyle
    verseContainer: any;
}

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: Theme.colors.gray1,
            paddingLeft: 0,
            paddingRight: 0,
        }
    },
    header: Style.header,
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerBody: {
        flexGrow: 3,
        justifyContent: "center",
        flexDirection: "row",
    },
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerTitle: {
        ...HeaderStyle.title, ...{
            //width: "100%",
            marginLeft: 16,
            marginRight: 16,
            color: Theme.colors.gray4,
        }
    },
    headerTitleSelected: {
        color: Theme.colors.white,
    },
    noteItem: {
        paddingLeft: 16,
        paddingRight: 16,
        marginBottom: 16,
    },
    note: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
        lineHeight: 24,
    },
    verseRelated: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
        // lineHeight: 24,
        // marginBottom: 16,
        textAlign: "right",
    },
    heading1: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.large,
        marginBottom: 24,
        lineHeight: 32,
        marginTop: 24,
    },
    questionHeading: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.large,
        marginBottom: 24,
        lineHeight: 32,
        marginTop: 24,
    },
    question: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
        lineHeight: 24,
    },
    subQuestion: {
        color: Theme.colors.white,
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: Theme.fonts.medium,
        lineHeight: 24,
        marginLeft: 16,
    },
    verseContainer: {
        marginTop: 16,
        marginBottom: 16
    }
})

interface Params {
    navigation: StackNavigationProp<TeachingStackParamList>;
    route: RouteProp<TeachingStackParamList, 'NotesScreen'>
}

function NotesScreen({ route, navigation }: Params): JSX.Element {

    const date = route.params?.date;
    console.log(route.params)

    const [notes, setNotes] = useState({ blocks: [], entityMap: {} });
    const [questions, setQuestions] = useState({ blocks: [], entityMap: {} });
    const [notesMode, setNotesMode] = useState("notes");

    useEffect(() => {
        const load = async () => {
            const notes = await NotesService.loadNotes(date)
            const questions = await NotesService.loadQuestions(date)

            if (notes) {
                try {
                    const notesData = JSON.parse(notes);
                    setNotes({ blocks: notesData.blocks, entityMap: notesData.entityMap })
                } catch (e) {
                    console.debug(e)
                }
            }

            if (questions) {
                try {
                    const questionsData = JSON.parse(questions);
                    setQuestions({ blocks: questionsData.blocks, entityMap: questionsData.entityMap })
                } catch (e) {
                    console.debug(e)
                }
            }
        }
        load();
    }, []);

    return (
        <Container>
            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body style={style.headerBody}>
                    <Text onPress={() => setNotesMode('notes')} style={[style.headerTitle, notesMode === 'notes' ? style.headerTitleSelected : {}]}>Notes</Text>
                    <Text onPress={() => setNotesMode('questions')} style={[style.headerTitle, notesMode === 'questions' ? style.headerTitleSelected : {}]}>Questions</Text>
                </Body>
                <Right style={style.headerRight}>
                    {/* <Button transparent>
                    <Thumbnail style={Style.icon} source={Theme.icons.white.textOptions} square></Thumbnail>
                </Button> */}
                </Right>
            </Header>

            <Content style={style.content}>
                <GestureRecognizer
                    onSwipeRight={() => setNotesMode('notes')}
                    onSwipeLeft={() => setNotesMode('questions')}
                    config={{
                        velocityThreshold: 0.5,
                        directionalOffsetThreshold: 80
                    }}
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                >
                    {notesMode === 'notes' ?
                        <NoteReader blocks={notes.blocks} entityMap={notes.entityMap} mode='dark' />
                        : <NoteReader blocks={questions.blocks} entityMap={questions.entityMap} mode='dark' />
                    }
                </GestureRecognizer>
            </Content>
        </Container>
    )
}

export default NotesScreen;