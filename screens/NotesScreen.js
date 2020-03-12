import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import NotesService from '../services/NotesService';
import { Text, View, Container, Header, Left, Body, Right, Button, Thumbnail, Content, Icon } from 'native-base';
import Theme, { Style } from '../Theme.style';
import { StatusBar } from 'react-native';
import NoteItem from '../components/teaching/notes/NoteItem';
import Verse from '../components/teaching/notes/Verse';
import VerseLink from '../components/teaching/notes/VerseLink';

const xml2js = require('react-native-xml2js');
const parser = new xml2js.Parser({explicitChildren: true, preserveChildrenOrder: true, charsAsChildren: true})

const style = {
    content: [ Style.cardContainer, {
        backgroundColor: Theme.colors.gray1,
        paddingLeft: 0,
        paddingRight: 0,
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
        flexDirection: "row",

    },
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },  
    headerTitle: [Style.header.title, {
        //width: "100%",
        marginLeft: 16,
        marginRight: 16,
        color: Theme.colors.gray4,
    }],
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

}

const NotesScreen = function({sermonId, navigation}){

    const [notes, setNotes] = useState([]);
    const [verses, setVerses] = useState([]);
    const [notesMode, setNotesMode] = useState("notes");
    const [visibleVerses, setVisibleVerses] = useState([]);

    useEffect(() => {
        const loadContentAsync = async () => {
            const { notes, verses } = await (notesMode === 'notes' ? NotesService.loadNotes(sermonId) : NotesService.loadQuestions(sermonId));
            for (let note of notes){
                console.log("NotesScreen.loadContentAsync(): processing : ", note);
                note.content = "<root>" + note.content + "</root>";
                parser.parseString(note.content, (err, result) => {
                    if (!err) {
                        note.content = result;
                        console.log("NotesScreen.loadContentAsync(): xml = ", JSON.stringify(result, null, 2));
                    }
                })
            }
            setNotes(notes);
            setVerses(verses);
        }
        loadContentAsync();
    }, [notesMode])

    const handleVersePress = ({note, verseId, chapterVerse}) => {
        console.log("NotesScreen.handleVersePress(): verseId, chapterVerse = ", verseId, chapterVerse);
        const existingIndex = visibleVerses.findIndex(vvRef => vvRef.noteId === note.id && vvRef.verseId === verseId);
        if (existingIndex > -1){
            visibleVerses.splice(existingIndex, 1);
            setVisibleVerses([].concat(visibleVerses));
        } else {
            setVisibleVerses(visibleVerses.concat({noteId: note.id, verseId: verseId}));
        }
    }

    const isVerseVisible = (verseId) => {
        return visibleVerses.find(vvRef => vvRef.verseId === verseId);
    }

    const renderChildren = (note) => {
        return note.content.root.$$.map((child, index) => {

            if (child['#name'] === '__text__'){
                return <Text key={index} style={style[note.noteType]}>{child['_']}</Text>;

            } else if (child['$'] && child['$'].class === 'verse'){
                return <VerseLink
                            key={index}
                            onPress={handleVersePress} 
                            verseId={child['$'].verseid} 
                            chapterVerse={child['$'].chapterverse}
                            note={note}
                            selected={isVerseVisible(child['$'].verseid)}
                        >
                            {child['_']}
                        </VerseLink>

            } else if (child['$'] && child['$'].style){
                const s = child['$'].style.replace(/ /g, "").split(";");
                const noteStyle = {
                    fontStyle: s.includes('font-style:italic') ? "italic": undefined,
                    textDecorationLine: s.includes('text-decoration:underline') ? "underline": undefined,
                    fontWeight: s.includes('fontWeight:bold') ? "bold": undefined
                }
                return <Text  key={index} style={[style.note, noteStyle]}>{child['_']}</Text>
            } else {
                return null;
            }
        })
    }

    const renderSelectedVerses = (note) => {
        const visibleVerseRefsForNote = visibleVerses.filter(vv => vv.noteId === note.id);
        return visibleVerseRefsForNote.map(vvRef => {
            const verse = verses.find(v => v.id === vvRef.verseId);
            return (
                <Verse 
                    key={verse.id}
                    onClosePressed={handleVersePress}
                    containerStyle={style.verseContainer} 
                    note={note} verse={verse}
                >
                    {verse.content}
                </Verse>
            )
        })
    }

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
            { notes.map( note => (
                <NoteItem key={note.id} containerStyle={style.noteItem} note={note}>
                    {renderChildren(note)}
                    {renderSelectedVerses(note)}
                </NoteItem>
            ))}
        </Content>
    </Container>        
    )
}


function mapStateToProps(state){
    return {
    }
}

export default connect(mapStateToProps)(NotesScreen);