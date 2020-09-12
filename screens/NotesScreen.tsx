import React, { useState, useEffect, useContext } from 'react';
import NotesService from '../services/NotesService';
import { Text, Header, Left, Body, Right, Button, Content, Thumbnail } from 'native-base';
import Theme, { Style, HeaderStyle } from '../Theme.style';
import { StatusBar, TextStyle, ViewStyle, StyleSheet, View, Linking } from 'react-native';
import NoteReader from '../components/teaching/notes/NoteReader';
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import TextOptions from '../components/modals/TextOptions'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import * as SecureStore from 'expo-secure-store';
import { MainStackParamList } from 'navigation/AppNavigator';
import WhiteButton from '../components/buttons/WhiteButton';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ActivityIndicator from '../components/ActivityIndicator';
import MiniPlayerStyleContext from '../contexts/MiniPlayerStyleContext';
import Auth from '@aws-amplify/auth';
import API, { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { GetCommentsByOwnerQuery, GetCommentsByOwnerQueryVariables } from '../services/API';
import CommentContext from '../contexts/CommentContext';

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

interface OpenVerseModalParams {
    closeCallback: () => void;
    openPassageCallback: (openIn: 'app' | 'web', remember: boolean) => Promise<void>;
}

function OpenVerseModal({ closeCallback, openPassageCallback }: OpenVerseModalParams): JSX.Element {

    const [rememberChoice, setRememberChoice] = useState(false);
    const [openIn, setOpenIn] = useState<'' | 'app' | 'web'>('');

    const handleOpenPassage = () => {
        if (openIn !== '')
            openPassageCallback(openIn, rememberChoice)
    }

    return <View style={{ bottom: 0, height: 386, backgroundColor: 'white', padding: 16 }} >
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
            <Text style={{ fontFamily: Theme.fonts.fontFamilyBold, fontSize: 24, lineHeight: 32, color: 'black', width: '67%' }}>How would you like to open this verse?</Text>
            <Button transparent onPress={closeCallback} ><Thumbnail source={Theme.icons.black.closeCancel} square style={{ width: 24, height: 24 }}></Thumbnail></Button>
        </View>
        <TouchableOpacity onPress={() => setOpenIn('app')} style={{ height: 56, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: Theme.colors.grey6, borderBottomWidth: 1 }} >
            <Text style={{ fontFamily: Theme.fonts.fontFamilyBold, fontSize: 16, lineHeight: 24, color: 'black' }}>Open in Bible App</Text>
            {openIn === 'app' ? <Thumbnail source={Theme.icons.black.checkMark} style={{ width: 24, height: 24 }} square /> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOpenIn('web')} style={{ height: 56, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: Theme.colors.grey6, borderBottomWidth: 1 }} >
            <Text style={{ fontFamily: Theme.fonts.fontFamilyBold, fontSize: 16, lineHeight: 24, color: 'black' }}>Open in Web Browser</Text>
            {openIn === 'web' ? <Thumbnail source={Theme.icons.black.checkMark} style={{ width: 24, height: 24 }} square /> : null}
        </TouchableOpacity>
        <View style={{ height: 80, display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <TouchableWithoutFeedback onPress={() => setRememberChoice(!rememberChoice)} style={{ width: 32, height: 32, borderWidth: 2, borderColor: Theme.colors.grey5, alignItems: 'center', justifyContent: 'center' }} >
                {rememberChoice ? <Thumbnail source={Theme.icons.black.checkMark} style={{ width: 24, height: 24 }} square /> : null}
            </TouchableWithoutFeedback>
            <Text style={{ fontFamily: Theme.fonts.fontFamilyRegular, fontSize: 16, lineHeight: 24, color: 'black', marginLeft: 20 }}>Remember my choice</Text>
        </View>
        <View style={{ height: 56 }} >
            <WhiteButton solidBlack label="Open Passage" onPress={handleOpenPassage} ></WhiteButton>
        </View>
    </View>
}

type VerseType = {
    id: string;
    key: string;
    offset: string;
    length: string;
    dataType: string;
    content: string;
    youVersionUri: string;
    noteId: string;
    createdAt: string;
    updatedAt: string;
}

interface Params {
    navigation: StackNavigationProp<MainStackParamList, 'NotesScreen'>
    route: RouteProp<MainStackParamList, 'NotesScreen'>
}

export default function NotesScreen({ route, navigation }: Params): JSX.Element {
    const date = route.params?.date;

    const [notes, setNotes] = useState({ blocks: [], entityMap: {} });
    const [questions, setQuestions] = useState({ blocks: [], entityMap: {} });
    const [notesMode, setNotesMode] = useState("notes");
    const [verses, setVerses] = useState<VerseType[]>([]);
    const [mode, setMode] = useState<'dark' | 'light'>('dark');
    const [fontScale, setFontScale] = useState(1);
    const [textOptions, setTextOptions] = useState(false);
    const [openVerse, setOpenVerse] = useState(false);
    const [verseURLs, setVerseURLs] = useState<{ youVersion: string | undefined, bibleGateway: string }>({ youVersion: '', bibleGateway: '' })
    const [userPreference, setUserPreference] = useState<'app' | 'web' | null>(null);
    const [noteId, setNoteId] = useState('');
    const commentContext = useContext(CommentContext);

    const headerHeight = useHeaderHeight();
    const safeArea = useSafeAreaInsets();
    const ref = React.createRef<Swiper>();
    const miniPlayerStyle = useContext(MiniPlayerStyleContext);

    navigation.setOptions({
        headerShown: true,
        title: '',
        headerStyle: { backgroundColor: Theme.colors.background },
        safeAreaInsets: { top: safeArea.top },
        header: function render() {
            return <Header style={style.header} >
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
            const queryNotes = await NotesService.loadNotes(date);

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


            if (queryNotes) {
                setVerses(queryNotes.verses?.items);
                setNoteId(queryNotes.id);
                try {
                    const notesData = JSON.parse(queryNotes.jsonContent);
                    setNotes({ blocks: notesData.blocks, entityMap: notesData.entityMap })
                } catch (e) {
                    console.debug(e)
                }

                try {
                    const questionsData = JSON.parse(queryNotes.jsonQuestions);
                    setQuestions({ blocks: questionsData.blocks, entityMap: questionsData.entityMap })
                } catch (e) {
                    console.debug(e)
                }
            }
        }
        load();
    }, []);

    useEffect(() => {
        const getComments = async () => {
            if (noteId)
                try {
                    const cognitoUser = await Auth.currentAuthenticatedUser();
                    const input: GetCommentsByOwnerQueryVariables = {
                        owner: cognitoUser.username,
                        noteId: { eq: noteId },
                    }
                    const json = await API.graphql({
                        query: getCommentsByOwner,
                        variables: input,
                        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
                    }) as GraphQLResult<GetCommentsByOwnerQuery>;

                    if (json.data?.getCommentsByOwner?.items)
                        commentContext.setComments(json.data?.getCommentsByOwner?.items)
                } catch (e) {
                    console.error(e)
                }
        }
        getComments();
    }, [noteId])

    const handleOpenVerse = (youVersion: string | undefined, bibleGateway: string) => {
        setVerseURLs({ youVersion, bibleGateway })

        if (!youVersion) {
            handleOpenPassage('web', false, bibleGateway)
            return
        }

        if (userPreference) {
            handleOpenPassage(userPreference, false)
        } else {
            miniPlayerStyle.setDisplay('none');
            setOpenVerse(true);
        }
    }

    const handleOpenPassage = async (openIn: 'app' | 'web', rememberChoice: boolean, url?: string): Promise<void> => {

        if (rememberChoice) {
            setUserPreference(openIn);

            // await set cognito attribute
        }

        switch (openIn) {
            case 'app':
                try {
                    if (verseURLs.youVersion) {
                        await Linking.openURL(verseURLs.youVersion);
                        setOpenVerse(false);
                        miniPlayerStyle.setDisplay('flex');
                    }
                } catch (e) {
                    console.debug(e)
                }
                break;
            case 'web':
                try {
                    await Linking.openURL(url ?? verseURLs.bibleGateway);
                    setOpenVerse(false);
                    miniPlayerStyle.setDisplay('flex');
                } catch (e) {
                    console.debug(e)
                }
                break;
        }
    }

    return <View style={{ flex: 1 }}>
        {notes.blocks.length > 0 ?
            <Swiper ref={ref} loop={false} showsPagination={false} showsButtons={false} onIndexChanged={(index) => setNotesMode(index === 0 ? 'notes' : 'questions')} >
                <Content style={[style.content, { backgroundColor: mode === 'dark' ? 'black' : Theme.colors.grey6 }]} onScroll={() => setTextOptions(false)} key='notes'>
                    <NoteReader noteId={noteId} blocks={notes.blocks} date={date} verses={verses} entityMap={notes.entityMap} mode={mode} fontScale={fontScale} type='notes' openVerseCallback={handleOpenVerse} />
                </Content>
                <Content style={[style.content, { backgroundColor: mode === 'dark' ? 'black' : Theme.colors.grey6 }]} onScroll={() => setTextOptions(false)} key='questions' >
                    <NoteReader noteId={noteId} blocks={questions.blocks} date={date} verses={verses} entityMap={questions.entityMap} mode={mode} fontScale={fontScale} type='questions' openVerseCallback={handleOpenVerse} />
                </Content>
            </Swiper> : <ActivityIndicator />
        }
        {openVerse ? <OpenVerseModal closeCallback={() => { setOpenVerse(false); miniPlayerStyle.setDisplay('flex') }} openPassageCallback={handleOpenPassage} /> : null}
    </View>

}

const getCommentsByOwner = /* GraphQL */ `
  query GetCommentsByOwner(
    $owner: String
    $noteId: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getCommentsByOwner(
      owner: $owner
      noteId: $noteId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        comment
        tags
        noteType
        commentType
        noteId
        textSnippet
        imageUri
        key
        date
        time
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;