import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import {
  TextStyle,
  Text,
  Image,
  ViewStyle,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import * as SecureStore from 'expo-secure-store';
import Auth from '@aws-amplify/auth';
import API, { GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import TextOptions from '../../components/modals/TextOptions';
import { MainStackParamList } from '../../navigation/AppNavigator';
import ActivityIndicator from '../../components/ActivityIndicator';
import MiniPlayerStyleContext from '../../contexts/MiniPlayerStyleContext';
import NoteReader from '../../components/teaching/notes/NoteReader';
import Theme, { Style, HeaderStyle } from '../../Theme.style';
import NotesService from '../../services/NotesService';
import {
  GetCommentsByOwnerQuery,
  GetCommentsByOwnerQueryVariables,
  GetNotesQuery,
} from '../../services/API';
import CommentContext from '../../contexts/CommentContext';
import OpenVerseModal from '../../components/modals/OpenVerseModal';
import UserContext, {
  TMHCognitoUser,
  UserData,
} from '../../contexts/UserContext';
import Header from '../../components/Header';
import { getCommentsByOwner } from '../../graphql/queries';

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
  subQuestion: TextStyle;
  verseContainer: any;
}

const style = StyleSheet.create({
  content: {
    paddingLeft: 0,
    paddingRight: 0,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.gray2,
  },

  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
    left: 16,
  },
  headerBody: {
    flexGrow: 3,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerRight: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
    right: 16,
  },
  headerTitle: {
    ...HeaderStyle.title,
    ...{
      marginLeft: 16,
      marginRight: 16,
      color: Theme.colors.gray4,
    },
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
    textAlign: 'right',
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
    marginBottom: 16,
  },
});

type VerseType = NonNullable<
  NonNullable<GetNotesQuery['getNotes']>['verses']
>['items'];

interface Params {
  navigation: StackNavigationProp<MainStackParamList, 'NotesScreen'>;
  route: RouteProp<MainStackParamList, 'NotesScreen'>;
  today: string;
  fromLiveStream: boolean | undefined;
}

export default function NotesScreen({
  route,
  navigation,
  today,
  fromLiveStream,
}: Params): JSX.Element {
  const date = route?.params?.date || today;
  const [notes, setNotes] = useState({ blocks: [], entityMap: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState({ blocks: [], entityMap: {} });
  const [notesMode, setNotesMode] = useState('notes');
  const [verses, setVerses] = useState<VerseType>([]);
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [fontScale, setFontScale] = useState(1);
  const [textOptions, setTextOptions] = useState(false);
  const [openVerse, setOpenVerse] = useState(false);
  const [verseURLs, setVerseURLs] = useState<{
    youVersion: string | undefined;
    bibleGateway: string;
  }>({ youVersion: '', bibleGateway: '' });
  const [userPreference, setUserPreference] = useState<'app' | 'web'>();
  const [noteId, setNoteId] = useState('');
  const commentContext = useContext(CommentContext);

  const ref = React.createRef<Swiper>();
  const miniPlayerStyle = useContext(MiniPlayerStyleContext);
  const userContext = useContext(UserContext);

  const { setComments } = commentContext;
  const { setDisplay } = miniPlayerStyle;

  useEffect(() => {
    setUserPreference(userContext?.userData?.['custom:preference_openBible']);
  }, [userContext?.userData]);

  useLayoutEffect(() => {
    const handleOpenTextOptions = () => {
      if (!textOptions) {
        setDisplay('none');
        setOpenVerse(false);
        setTextOptions(true);
      } else {
        setDisplay('flex');
        setTextOptions(false);
      }
    };

    navigation.setOptions({
      headerShown: true,
      header: function render() {
        return (
          <Header>
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
              onPress={() => navigation.goBack()}
            >
              <Image
                style={Style.icon}
                source={Theme.icons.white.arrowLeft}
                accessibilityLabel="left icon"
              />
            </TouchableOpacity>

            <Text
              onPress={() => {
                setNotesMode('notes');
                ref.current?.scrollTo(0);
              }}
              style={[
                style.headerTitle,
                notesMode === 'notes' ? style.headerTitleSelected : {},
              ]}
            >
              Notes
            </Text>
            <Text
              onPress={() => {
                setNotesMode('questions');
                ref.current?.scrollTo(1);
              }}
              style={[
                style.headerTitle,
                notesMode === 'questions' ? style.headerTitleSelected : {},
              ]}
            >
              Questions
            </Text>

            <TouchableOpacity
              style={{ paddingHorizontal: 16, paddingVertical: 10 }}
              onPress={handleOpenTextOptions}
            >
              <Image
                style={Style.icon}
                source={Theme.icons.white.textOptions}
                accessibilityLabel="text options icon"
              />
            </TouchableOpacity>
          </Header>
        );
      },
    });
  }, [setDisplay, navigation, notesMode, ref, textOptions]);

  async function handleFontScale(data: number) {
    try {
      await SecureStore.setItemAsync('fontScale', data.toString());
      setFontScale(data);
    } catch (e) {
      console.debug(e);
    }
  }

  async function handleTheme(data: 'dark' | 'light') {
    try {
      await SecureStore.setItemAsync('theme', data);
      setMode(data);
    } catch (e) {
      console.debug(e);
    }
  }

  useEffect(() => {
    const load = async () => {
      const queryNotes = await NotesService.loadNotes(date);
      console.log({ date: queryNotes });
      try {
        const font = await SecureStore.getItemAsync('fontScale');
        const displayMode = await SecureStore.getItemAsync('theme');

        if (font) setFontScale(parseFloat(font));

        if (displayMode === 'dark' || displayMode === 'light')
          setMode(displayMode);
      } catch (e) {
        console.debug(e);
      }

      if (queryNotes) {
        if (
          queryNotes.verses?.items &&
          queryNotes.jsonContent &&
          queryNotes.jsonQuestions
        ) {
          setVerses(queryNotes.verses?.items);
          setNoteId(queryNotes.id);
          try {
            const notesData = JSON.parse(queryNotes.jsonContent);
            setNotes({
              blocks: notesData.blocks,
              entityMap: notesData.entityMap,
            });
          } catch (e) {
            console.debug(e);
          }

          try {
            const questionsData = JSON.parse(queryNotes.jsonQuestions);
            setQuestions({
              blocks: questionsData.blocks,
              entityMap: questionsData.entityMap,
            });
          } catch (e) {
            console.debug(e);
          }
        }
      }
    };
    const loadAsync = async () => {
      await load();
      setIsLoading(false);
    };
    loadAsync();
  }, [date]);

  useEffect(() => {
    const getComments = async () => {
      if (noteId)
        try {
          const cognitoUser: TMHCognitoUser =
            await Auth.currentAuthenticatedUser();
          const input: GetCommentsByOwnerQueryVariables = {
            owner: cognitoUser.username,
            noteId: { eq: noteId },
          };
          const json = (await API.graphql({
            query: getCommentsByOwner,
            variables: input,
            authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
          })) as GraphQLResult<GetCommentsByOwnerQuery>;

          if (json.data?.getCommentsByOwner?.items)
            setComments(json.data?.getCommentsByOwner?.items);
        } catch (e) {
          console.debug(e);
        }
    };
    getComments();
  }, [noteId, setComments]);

  const handleOpenPassage = async (
    openIn: 'app' | 'web',
    rememberChoice: boolean,
    youVersion?: string,
    bibleGateway?: string
  ): Promise<void> => {
    if (rememberChoice) {
      setUserPreference(openIn);
      try {
        const user: TMHCognitoUser = await Auth.currentAuthenticatedUser();
        userContext?.setUserData({
          ...user.attributes,
          'custom:preference_openBible': openIn,
        } as UserData);
        const update = await Auth.updateUserAttributes(user, {
          ...user.attributes,
          'custom:preference_openBible': openIn,
        });
        console.log(update);
      } catch (e) {
        console.debug(e);
      }
    }

    if (openIn === 'app') {
      try {
        if (youVersion) {
          await Linking.openURL(youVersion);
          setOpenVerse(false);
          miniPlayerStyle.setDisplay('flex');
        }
      } catch (e) {
        console.debug(e);
      }
    } else {
      try {
        if (bibleGateway) {
          await Linking.openURL(bibleGateway);
          setOpenVerse(false);
          miniPlayerStyle.setDisplay('flex');
        }
      } catch (e) {
        console.debug(e);
      }
    }
  };

  const handleOpenVerse = (
    youVersion: string | undefined,
    bibleGateway: string
  ) => {
    if (!youVersion) {
      handleOpenPassage('web', false, youVersion, bibleGateway);
      return;
    }

    if (userPreference) {
      handleOpenPassage(userPreference, false, youVersion, bibleGateway);
    } else {
      miniPlayerStyle.setDisplay('none');
      setOpenVerse(true);
      setTextOptions(false);
      setVerseURLs({ youVersion, bibleGateway });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {notes.blocks.length > 0 ? (
        <Swiper
          ref={ref}
          loop={false}
          showsPagination={false}
          showsButtons={false}
          onIndexChanged={(index) =>
            setNotesMode(index === 0 ? 'notes' : 'questions')
          }
        >
          <ScrollView
            style={[
              style.content,
              {
                backgroundColor: mode === 'dark' ? 'black' : Theme.colors.grey6,
              },
            ]}
            key="notes"
          >
            <NoteReader
              fromLiveStream={fromLiveStream}
              noteId={noteId}
              blocks={notes.blocks}
              date={date}
              verses={verses}
              entityMap={notes.entityMap}
              mode={mode}
              fontScale={fontScale}
              type="notes"
              openVerseCallback={handleOpenVerse}
            />
          </ScrollView>
          <ScrollView
            style={[
              style.content,
              {
                backgroundColor: mode === 'dark' ? 'black' : Theme.colors.grey6,
              },
            ]}
            key="questions"
          >
            <NoteReader
              fromLiveStream={fromLiveStream}
              noteId={noteId}
              blocks={questions.blocks}
              date={date}
              verses={verses}
              entityMap={questions.entityMap}
              mode={mode}
              fontScale={fontScale}
              type="questions"
              openVerseCallback={handleOpenVerse}
            />
          </ScrollView>
        </Swiper>
      ) : isLoading ? (
        <ActivityIndicator />
      ) : null}
      {openVerse ? (
        <OpenVerseModal
          closeCallback={() => {
            setOpenVerse(false);
            miniPlayerStyle.setDisplay('flex');
          }}
          openPassageCallback={(openIn, remember) =>
            handleOpenPassage(
              openIn,
              remember,
              verseURLs.youVersion,
              verseURLs.bibleGateway
            )
          }
        />
      ) : null}
      {textOptions ? (
        <TextOptions
          defaultMode={mode}
          defaultFontScale={fontScale}
          fontScaleCallback={(data) => handleFontScale(data)}
          modeCallback={(data) => handleTheme(data)}
          closeCallback={() => {
            setTextOptions(false);
            miniPlayerStyle.setDisplay('flex');
          }}
        />
      ) : null}
    </View>
  );
}
