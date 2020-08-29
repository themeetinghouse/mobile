import React, { useState, useEffect } from 'react';
import NotesService from '../services/NotesService';
import { Text, Header, Left, Body, Right, Button, Content, Thumbnail } from 'native-base';
import Theme, { Style, HeaderStyle } from '../Theme.style';
import { StatusBar, TextStyle, ViewStyle, StyleSheet, View } from 'react-native';
import NoteReader from '../components/teaching/notes/NoteReader';
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import TextOptions from '../components/modals/TextOptions'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import * as SecureStore from 'expo-secure-store';
import { MainStackParamList } from 'navigation/AppNavigator';
import MiniPlayer from '../components/MiniPlayer';

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
    navigation: StackNavigationProp<MainStackParamList, 'NotesScreen'>
    route: RouteProp<MainStackParamList, 'NotesScreen'>
}

function NotesScreen({ route, navigation }: Params): JSX.Element {

    const date = route.params?.date;

    const [notes, setNotes] = useState({ blocks: [], entityMap: {} });
    const [questions, setQuestions] = useState({ blocks: [], entityMap: {} });
    const [notesMode, setNotesMode] = useState("notes");
    const [mode, setMode] = useState<'dark' | 'light'>('dark');
    const [fontScale, setFontScale] = useState(1);
    const [textOptions, setTextOptions] = useState(false);

    const headerHeight = useHeaderHeight();
    const safeArea = useSafeAreaInsets();
    const ref = React.createRef<Swiper>();


    navigation.setOptions({
        headerShown: true,
        title: '',
        headerStyle: { backgroundColor: Theme.colors.background },
        safeAreaInsets: { top: safeArea.top },
        header: function render() {
            return <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Thumbnail style={Style.icon} source={Theme.icons.white.arrowLeft} square></Thumbnail>
                    </Button>
                </Left>
                <Body style={style.headerBody}>
                    <Text onPress={() => { setNotesMode('notes'); ref.current?.scrollTo(0) }} style={[style.headerTitle, notesMode === 'notes' ? style.headerTitleSelected : {}]}>Notes</Text>
                    <Text onPress={() => { setNotesMode('questions'); ref.current?.scrollTo(1) }} style={[style.headerTitle, notesMode === 'questions' ? style.headerTitleSelected : {}]}>Questions</Text>
                </Body>
                <Right style={style.headerRight}>
                    <Button transparent onPress={() => setTextOptions(!textOptions)}>
                        <Thumbnail style={Style.icon} source={Theme.icons.white.textOptions} square></Thumbnail>
                    </Button>
                    <TextOptions
                        show={textOptions} top={headerHeight - safeArea.top}
                        defaultMode={mode}
                        defaultFontScale={fontScale}
                        fontScaleCallback={(data) => handleFontScale(data)}
                        modeCallback={(data) => handleTheme(data)}
                    />
                </Right>
            </Header>
        }
    })

    async function handleFontScale(data: number) {
        try {
            await SecureStore.setItemAsync('fontScale', data.toString());
            setFontScale(data);
        } catch (e) {
            console.debug(e)
        }
    }

    async function handleTheme(data: 'dark' | 'light') {
        try {
            await SecureStore.setItemAsync('theme', data);
            setMode(data);
        } catch (e) {
            console.debug(e)
        }
    }

    useEffect(() => {
        const load = async () => {
            const notes = await NotesService.loadNotes(date);
            const questions = await NotesService.loadQuestions(date);

            try {
                const fontScale = await SecureStore.getItemAsync('fontScale');
                const mode = await SecureStore.getItemAsync('theme');

                if (fontScale)
                    setFontScale(parseFloat(fontScale))

                if (mode === 'dark' || mode === 'light')
                    setMode(mode)

            } catch (e) {
                console.debug(e)
            }


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
        <View style={{ flex: 1 }}>
            <Swiper ref={ref} loop={false} showsPagination={false} showsButtons={false} onIndexChanged={(index) => setNotesMode(index === 0 ? 'notes' : 'questions')} >
                <Content style={[style.content, { backgroundColor: mode === 'dark' ? 'black' : Theme.colors.grey6 }]} onScroll={() => setTextOptions(false)} key='notes'>
                    <NoteReader blocks={notes.blocks} entityMap={notes.entityMap} mode={mode} fontScale={fontScale} type='notes' />
                </Content>
                <Content style={[style.content, { backgroundColor: mode === 'dark' ? 'black' : Theme.colors.grey6 }]} onScroll={() => setTextOptions(false)} key='questions'>
                    <NoteReader blocks={questions.blocks} entityMap={questions.entityMap} mode={mode} fontScale={fontScale} type='questions' />
                </Content>
            </Swiper>
            <MiniPlayer marginBottom={safeArea.bottom} />
        </View>
    )
}

export default NotesScreen;