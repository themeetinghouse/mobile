import React, { useState, useEffect, useContext } from 'react';
import NotesService from '../services/NotesService';
import { Text, Header, Left, Body, Right, Button, Content, Thumbnail } from 'native-base';
import Theme, { Style, HeaderStyle } from '../Theme.style';
import { StatusBar, TextStyle, ViewStyle, StyleSheet, View, Linking } from 'react-native';
import NoteReader from '../components/teaching/notes/NoteReader';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import TextOptions from '../components/modals/TextOptions'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import * as SecureStore from 'expo-secure-store';
import { MainStackParamList } from 'navigation/AppNavigator';
import ActivityIndicator from '../components/ActivityIndicator';
import MiniPlayerStyleContext from '../contexts/MiniPlayerStyleContext';
import Auth from '@aws-amplify/auth';
import API, { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { GetCommentsByOwnerQuery, GetCommentsByOwnerQueryVariables, GetNotesQuery } from '../services/API';
import CommentContext from '../contexts/CommentContext';
import OpenVerseModal from '../components/modals/OpenVerseModal';
import UserContext from '../contexts/UserContext';
import { HomeStackParamList } from 'navigation/MainTabNavigator';

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

type VerseType = NonNullable<NonNullable<GetNotesQuery['getNotes']>['verses']>['items'];

interface Params {
    navigation: StackNavigationProp<MainStackParamList | HomeStackParamList, 'NotesScreen'>
    route: RouteProp<MainStackParamList | HomeStackParamList, 'NotesScreen' | 'LiveStreamScreen'>
    today: string;
}

export default function NotesScreen({ route, navigation, today }: Params): JSX.Element {
    const date = route?.params?.date || today;
    const [notes, setNotes] = useState({ blocks: [], entityMap: {} });
    const [questions, setQuestions] = useState({ blocks: [], entityMap: {} });
    const [notesMode, setNotesMode] = useState("notes");
    const [verses, setVerses] = useState<VerseType>([]);
    const [mode, setMode] = useState<'dark' | 'light'>('dark');
    const [fontScale, setFontScale] = useState(1);
    const [textOptions, setTextOptions] = useState(false);
    const [openVerse, setOpenVerse] = useState(false);
    const [verseURLs, setVerseURLs] = useState<{ youVersion: string | undefined, bibleGateway: string }>({ youVersion: '', bibleGateway: '' })
    const [userPreference, setUserPreference] = useState<'app' | 'web'>();
    const [noteId, setNoteId] = useState('');
    const commentContext = useContext(CommentContext);

    const safeArea = useSafeAreaInsets();
    const ref = React.createRef<Swiper>();
    const miniPlayerStyle = useContext(MiniPlayerStyleContext);
    const userContext = useContext(UserContext);

    useEffect(() => {
        setUserPreference(userContext?.userData?.["custom:preference_openBible"])
    }, [])

    navigation.setOptions({
        headerShown: true,
        title: '',
        headerStyle: { backgroundColor: Theme.colors.background },
        safeAreaInsets: { top: safeArea.top },
        header: function render() {
            return <Header style={style.header} >
                <StatusBar backgroundColor={Theme.colors.black} barStyle="light-content" />
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
                    <Button transparent onPress={handleOpenTextOptions}>
                        <Thumbnail style={Style.icon} source={Theme.icons.white.textOptions} square></Thumbnail>
                    </Button>
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
                if (queryNotes.verses?.items && queryNotes.jsonContent && queryNotes.jsonQuestions) {
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
                    console.debug(e)
                }
        }
        getComments();
    }, [noteId])

    const handleOpenTextOptions = () => {
        if (!textOptions) {
            miniPlayerStyle.setDisplay('none');
            setOpenVerse(false);
            setTextOptions(true);
        } else {
            miniPlayerStyle.setDisplay('flex');
            setTextOptions(false);
        }

    }

    const handleOpenVerse = (youVersion: string | undefined, bibleGateway: string) => {
        if (!youVersion) {
            handleOpenPassage('web', false, youVersion, bibleGateway)
            return
        }

        if (userPreference) {
            handleOpenPassage(userPreference, false, youVersion, bibleGateway)
        } else {
            miniPlayerStyle.setDisplay('none');
            setOpenVerse(true);
            setTextOptions(false);
            setVerseURLs({ youVersion, bibleGateway })
        }
    }

    const handleOpenPassage = async (openIn: 'app' | 'web', rememberChoice: boolean, youVersion?: string, bibleGateway?: string): Promise<void> => {
        if (rememberChoice) {
            setUserPreference(openIn);
            try {
                const user = await Auth.currentAuthenticatedUser();
                userContext?.setUserData({ ...user.attributes, 'custom:preference_openBible': openIn });
                const update = await Auth.updateUserAttributes(user, { ...user.attributes, 'custom:preference_openBible': openIn });
                console.log(update);
            } catch (e) {
                console.debug(e)
            }
        }

        switch (openIn) {
            case 'app':
                try {
                    if (youVersion) {
                        await Linking.openURL(youVersion);
                        setOpenVerse(false);
                        miniPlayerStyle.setDisplay('flex');
                    }
                } catch (e) {
                    console.debug(e)
                }
                break;
            case 'web':
                try {
                    if (bibleGateway) {
                        await Linking.openURL(bibleGateway);
                        setOpenVerse(false);
                        miniPlayerStyle.setDisplay('flex');
                    }
                } catch (e) {
                    console.debug(e)
                }
                break;
        }
    }

    return <View style={{ height: 2500, marginTop: -58 }}>
        {notes.blocks.length > 0 ?
            <Swiper ref={ref} loop={false} showsPagination={false} showsButtons={false} onIndexChanged={(index) => setNotesMode(index === 0 ? 'notes' : 'questions')} >
                <Content style={[style.content, { backgroundColor: mode === 'dark' ? 'black' : Theme.colors.grey6 }]} key='notes'>
                    <NoteReader route={route} noteId={noteId} blocks={notes.blocks} date={date} verses={verses} entityMap={notes.entityMap} mode={mode} fontScale={fontScale} type='notes' openVerseCallback={handleOpenVerse} />
                </Content>
                <Content style={[style.content, { backgroundColor: mode === 'dark' ? 'black' : Theme.colors.grey6 }]} key='questions' >
                    <NoteReader route={route} noteId={noteId} blocks={questions.blocks} date={date} verses={verses} entityMap={questions.entityMap} mode={mode} fontScale={fontScale} type='questions' openVerseCallback={handleOpenVerse} />
                </Content>
            </Swiper> : <ActivityIndicator />
        }
        {openVerse ? <OpenVerseModal closeCallback={() => { setOpenVerse(false); miniPlayerStyle.setDisplay('flex') }} openPassageCallback={(openIn, remember) => handleOpenPassage(openIn, remember, verseURLs.youVersion, verseURLs.bibleGateway)} /> : null}
        {textOptions ? <TextOptions
            defaultMode={mode}
            defaultFontScale={fontScale}
            fontScaleCallback={(data) => handleFontScale(data)}
            modeCallback={(data) => handleTheme(data)}
            closeCallback={() => { setTextOptions(false); miniPlayerStyle.setDisplay('flex') }}
        /> : null}
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