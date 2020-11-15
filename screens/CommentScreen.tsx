import React, { useState, useEffect, useContext } from 'react';
import { Container, Text, Button, View, Thumbnail } from 'native-base';
import Theme, { Style, HeaderStyle } from '../Theme.style';
import { TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { Auth } from '@aws-amplify/auth'
import { TextInput, FlatList } from 'react-native-gesture-handler';
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack';
import { MainStackParamList } from '../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreateCommentInput, NoteDataType, CommentDataType, GetCommentsByOwnerQuery, DeleteCommentInput, UpdateCommentInput, GetCommentsByOwnerQueryVariables, UpdateCommentMutation, CreateCommentMutation } from '../services/API';
import moment from 'moment';
import { GRAPHQL_AUTH_MODE, GraphQLResult } from '@aws-amplify/api';
import { API } from '@aws-amplify/api';
import { nanoid } from 'nanoid/async/index.native';
import CommentContext from '../contexts/CommentContext';
import UserContext from '../contexts/UserContext';
import MiniPlayerStyleContext from '../contexts/MiniPlayerStyleContext';
import NeedsSignUpModal from '../components/modals/NeedsSignUpModal';

const style = StyleSheet.create({
    content: {
        ...Style.cardContainer, ...{
            backgroundColor: 'black',
        }
    },
    header: {
        backgroundColor: Theme.colors.header
    },
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 70,
        left: 6
    },
    headerBody: {
        flexGrow: 3,
        justifyContent: "center",
    },
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 70,
        right: 6,
    },
    headerTitle: {
        ...HeaderStyle.title, ...{
            width: "100%",
        }
    },
    title: {
        ...Style.title, ...{
            marginTop: 130,
            marginBottom: 16,
        }
    },
    body: {
        ...Style.body, ...{
            marginBottom: 40,
        }
    },
    listItem: {
        marginLeft: 0,
        borderColor: Theme.colors.gray2,
        backgroundColor: Theme.colors.background
    },
    listText: {
        fontSize: Theme.fonts.medium,
        color: Theme.colors.grey5,
        fontFamily: Theme.fonts.fontFamilyRegular,
        marginLeft: 16,
        lineHeight: 24,
    },
    listSubtext: {
        fontSize: Theme.fonts.smallMedium,
        color: Theme.colors.grey4,
        fontFamily: Theme.fonts.fontFamilyRegular,
        marginLeft: 16,
        marginTop: 10
    },
    listIcon: {
        ...Style.icon, ...{
            marginRight: 16,
            marginLeft: 16,
        }
    },
    listArrowIcon: Style.icon,
    headerText: {
        fontSize: 16,
        fontFamily: Theme.fonts.fontFamilyRegular,
        color: 'white',
        lineHeight: 24,
    },
    input: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        color: 'white',
        fontSize: 16,
    }
})

interface Params {
    navigation: StackNavigationProp<MainStackParamList>;
    route: RouteProp<MainStackParamList, 'CommentScreen'>;
}

const getTagsByOwner = /* GraphQL */ `
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
        tags
      }
      nextToken
    }
  }
`;

const createComment = /* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
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
  }
`;
const updateComment = /* GraphQL */ `
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
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
  }
`;
const deleteComment = /* GraphQL */ `
  mutation DeleteComment($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
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
  }
`;

export default function CommentScreen({ navigation, route }: Params): JSX.Element {

    const headerHeight = useHeaderHeight();
    const safeArea = useSafeAreaInsets();
    const [comment, setComment] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [edit, setEdit] = useState(false);
    const [commentId, setCommentId] = useState('');
    const [prevTags, setPrevTags] = useState<string[]>([]);
    const [mode, setMode] = useState<'comment' | 'tags'>('comment');
    const [newTag, setNewTag] = useState('');
    const commentContext = useContext(CommentContext);
    const userContext = useContext(UserContext);
    const miniPlayerStyle = useContext(MiniPlayerStyleContext);
    const [signUpModal, setSignUpModal] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const routeParams = route.params;

    navigation.setOptions({
        headerShown: true,
        title: mode === 'comment' ? (edit ? 'Edit' : 'Add') + ' Comment' : 'Add Tags',
        headerTitleStyle: style.headerTitle,
        headerStyle: { backgroundColor: Theme.colors.background },
        headerLeft: function render() {
            return <TouchableOpacity onPress={mode === 'comment' ? () => navigation.goBack() : () => setMode('comment')}>
                <Text style={true ? HeaderStyle.linkText : HeaderStyle.linkTextInactive}>Cancel</Text>
            </TouchableOpacity>
        },
        headerLeftContainerStyle: { left: 16 },
        headerRight: function render() {
            return <TouchableOpacity onPress={mode === 'comment' ? postComment : () => setMode('comment')}>
                <Text style={true ? HeaderStyle.linkText : HeaderStyle.linkTextInactive}>{mode === 'comment' ? 'Save' : 'Done'}</Text>
            </TouchableOpacity>
        },
        headerRightContainerStyle: { right: 16 },
    })

    useEffect(() => {
        miniPlayerStyle.setDisplay('none');

        if (!userContext?.userData?.email_verified)
            setSignUpModal(true);
    }, [])

    useEffect(() => {
        const unsub = navigation.addListener('blur', () => {
            miniPlayerStyle.setDisplay('flex')
        });
        return unsub;
    }, [])

    useEffect(() => {
        const getTags = async () => {
            try {
                const cognitoUser = await Auth.currentAuthenticatedUser();
                const input: GetCommentsByOwnerQueryVariables = {
                    owner: cognitoUser.username,
                    limit: 8
                }
                const json = await API.graphql({
                    query: getTagsByOwner,
                    variables: input,
                    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
                }) as GraphQLResult<GetCommentsByOwnerQuery>;

                if (json.data?.getCommentsByOwner?.items) {
                    json.data.getCommentsByOwner.items.forEach(item => {
                        const temp: string[] = []
                        item?.tags?.forEach(tag => {
                            if (typeof tag === 'string' && !prevTags.includes(tag)) {
                                temp.push(tag)
                            }
                        })
                        setPrevTags(prevState => { return prevState.concat(temp) })
                    })
                }
            } catch (e) {
                console.debug(e);
            }
        }

        getTags();
    }, [])

    useEffect(() => {
        if ('comment' in routeParams) {
            setComment(routeParams.comment);
            setTags(routeParams.tags as string[]);
            setCommentId(routeParams.commentId)
            setEdit(true)
        }
    }, [])

    const removeTag = (toRemove: string) => {
        setTags(prevState => { return prevState.filter(item => item !== toRemove) })
    }

    const removeComment = async () => {
        try {
            const input: DeleteCommentInput = {
                id: commentId,
            }
            await API.graphql({
                query: deleteComment,
                variables: { input },
                authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
            });
            const index = commentContext.comments.findIndex(item => item?.id === commentId);
            if (index !== -1)
                commentContext.comments.splice(index, 1)

            navigation.goBack();
        } catch (e) {
            console.debug(e)
        }
    }

    const handleShortPress = () => {
        setShowHint(true);
        setTimeout(() => {
            setShowHint(false)
        }, 3000)
    }

    const postComment = async () => {
        if (edit && comment) {
            try {
                const input: UpdateCommentInput = {
                    id: commentId,
                    comment: comment,
                    tags: tags,
                    date: moment().format('MMMM D, YYYY'),
                    time: moment().format('h:mm A'),
                }

                const json = await API.graphql({
                    query: updateComment,
                    variables: { input },
                    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
                }) as GraphQLResult<UpdateCommentMutation>

                const index = commentContext.comments.findIndex(item => item?.id === commentId);
                if (index !== -1 && json.data?.updateComment)
                    commentContext.comments[index] = json.data.updateComment

                navigation.goBack();

            } catch (e) {
                console.debug(e)
            }
        } else if ('key' in routeParams && comment) {
            try {
                const nanoId = await nanoid();
                const cognitoUser = await Auth.currentAuthenticatedUser();
                const input: CreateCommentInput = {
                    id: nanoId,
                    comment: comment,
                    tags: tags,
                    noteType: routeParams.noteType === 'notes' ? NoteDataType.notes : NoteDataType.questions,
                    commentType: routeParams.commentType,
                    noteId: routeParams.noteId,
                    textSnippet: routeParams.textSnippet,
                    imageUri: routeParams.imageUri,
                    key: routeParams.key,
                    date: moment().format('MMMM D, YYYY'),
                    time: moment().format('h:mm A'),
                    owner: cognitoUser.username,
                }

                const json = await API.graphql({
                    query: createComment,
                    variables: { input },
                    authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
                }) as GraphQLResult<CreateCommentMutation>;

                if (json.data?.createComment)
                    commentContext.comments.push(json.data.createComment)

                setEdit(true);
                setCommentId(nanoId);
                navigation.goBack();

            } catch (e) {
                console.debug(e)
            }
        }
    }

    function addTag(tag: string) {
        setTags(prevState => { return prevState.concat(tag) })
    }

    function handlePress(e: NativeSyntheticEvent<TextInputKeyPressEventData>) {
        if (e.nativeEvent.key === ',') {
            addTag(newTag.replace(',', ''))
            setTimeout(() => {
                setNewTag('')
            }, 100)
        }
    }

    function renderTag(tag: string) {
        return <View style={{ backgroundColor: Theme.colors.grey3, borderRadius: 2, paddingTop: 4, paddingBottom: 4, paddingHorizontal: 8, marginRight: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', height: 26 }} >
            <Text style={{ color: 'white', fontFamily: Theme.fonts.fontFamilyRegular, fontSize: 12, lineHeight: 18 }}>{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(tag)} >
                <Thumbnail square style={{ width: 12, height: 12, marginLeft: 4 }} source={Theme.icons.white.closeCancel} />
            </TouchableOpacity>
        </View>
    }

    function renderPrevTag(tag: string) {
        return <TouchableOpacity onPress={() => addTag(tag)} style={{ backgroundColor: 'white', borderRadius: 2, paddingTop: 4, paddingBottom: 4, paddingHorizontal: 8, marginRight: 4, height: 26 }} >
            <Text style={{ color: 'black', fontFamily: Theme.fonts.fontFamilyRegular, fontSize: 12, lineHeight: 18 }}>{tag}</Text>
        </TouchableOpacity>
    }

    return <Container style={{ backgroundColor: mode === 'comment' ? Theme.colors.background : 'black', paddingBottom: safeArea.bottom, }}>
        <NeedsSignUpModal initState={signUpModal} />
        {mode === 'comment' ?
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={headerHeight} style={{ flex: 1, backgroundColor: 'black' }} >
                <View style={{ flexGrow: 1, padding: 16 }} >
                    {routeParams.commentType === CommentDataType.image ?
                        <Image source={{ uri: routeParams.imageUri }} style={{ width: 64, height: 64 }} resizeMode='contain' ></Image>
                        : <Text style={{ color: Theme.colors.grey4, fontFamily: Theme.fonts.fontFamilyRegular, fontSize: 14, marginBottom: 16 }} ellipsizeMode='tail' numberOfLines={1}>{routeParams.textSnippet}</Text>
                    }
                    <TextInput value={comment} onChange={e => setComment(e.nativeEvent.text)} keyboardAppearance='dark' placeholder='Write a comment' placeholderTextColor={Theme.colors.grey4} style={style.input}></TextInput>
                </View>
                <View style={{ flexGrow: 0 }} >
                    <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', marginBottom: 12, marginRight: 16, alignItems: 'center' }} >
                        {showHint ? <Text style={{ fontSize: 14, color: 'white', marginRight: 16 }} >Long press to delete</Text> : null}
                        <Button transparent style={{}} onLongPress={removeComment} onPress={handleShortPress}><Thumbnail source={Theme.icons.white.delete} square style={{ width: 24, height: 24 }}></Thumbnail></Button>
                    </View>
                    <View style={{ backgroundColor: Theme.colors.background, minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24 }} >
                        <Thumbnail source={Theme.icons.white.tags} square style={{ width: 16, height: 16, marginRight: 16 }} ></Thumbnail>
                        <FlatList showsHorizontalScrollIndicator={false} data={tags} renderItem={({ item }) => renderTag(item)} horizontal keyExtractor={(_item, index) => index.toString()} />
                        <TouchableOpacity onPress={() => setMode('tags')} >
                            <Text style={{ color: Theme.colors.grey4, fontFamily: Theme.fonts.fontFamilyRegular, fontSize: 14, marginLeft: tags.length > 0 ? 12 : 0 }}>Add tags...</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView> :
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={headerHeight} style={{ flex: 1, backgroundColor: 'black' }} >
                <View style={{ flexGrow: 1, padding: 16 }} >
                    {prevTags.filter(item => !tags.includes(item)).length > 0 ? <Text style={{ color: Theme.colors.grey4, fontFamily: Theme.fonts.fontFamilyRegular, fontSize: 14, marginBottom: 8 }}>Choose Previous Tags</Text> : null}
                    <FlatList style={{ flexGrow: 0, marginBottom: 24 }} showsHorizontalScrollIndicator={false} data={prevTags.filter(item => !tags.includes(item))} renderItem={({ item }) => renderPrevTag(item)} horizontal keyExtractor={(_item, index) => index.toString()} />
                    <TextInput onKeyPress={e => handlePress(e)} value={newTag} onChangeText={e => setNewTag(e)} keyboardAppearance='dark' placeholder='Separate tags with commas' placeholderTextColor={Theme.colors.grey4} style={style.input} ></TextInput>
                </View>
                <View style={{ flexGrow: 0 }} >
                    <View style={{ backgroundColor: 'black', minHeight: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24 }} >
                        <Thumbnail source={Theme.icons.white.tags} square style={{ width: 16, height: 16, marginRight: 16 }} ></Thumbnail>
                        <FlatList showsHorizontalScrollIndicator={false} data={tags} renderItem={({ item }) => renderTag(item)} horizontal keyExtractor={(_item, index) => index.toString()} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        }
    </Container>
}
