import React, { useState, Fragment, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TextStyle, Dimensions } from 'react-native';
import { Theme } from '../../../Theme.style';
import * as Linking from 'expo-linking';
import { Thumbnail, Button } from 'native-base';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../../navigation/AppNavigator';
import { CommentDataType } from '../../../services/API';
import CommentContext, { CommentContextType } from '../../../contexts/CommentContext';
import moment from 'moment';

type ContentType =
    "unstyled" |
    "paragraph" |
    "header-one" |
    "header-two" |
    "header-three" |
    "header-four" |
    "header-five" |
    "header-six" |
    "unordered-list-item" |
    "ordered-list-item" |
    "blockquote" |
    "code-block" |
    "atomic"

type DraftStyle = {
    length: number;
    offset: number;
    style: string;
}

type InlineStyle = {
    length: number;
    offset: number;
    style: TextStyle;
}

type Blocks = {
    data: any;
    depth: number;
    entityRanges: any[];
    inlineStyleRanges: DraftStyle[];
    key: string;
    text: string;
    type: ContentType;
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

const underline = StyleSheet.create({
    selected: {
        textDecorationColor: Theme.colors.red,
        textDecorationLine: 'underline',
        textDecorationStyle: 'dotted'
    }
})

interface CommentParams {
    comment: CommentContextType['comments'][0];
    styles: { text: TextStyle, header: TextStyle, textSmall: TextStyle };
}

export function Comment({ comment, styles }: CommentParams): JSX.Element {

    const date = moment(comment?.date, 'MMMM D, YYYY').format('MMM D, YYYY');
    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

    const openComment = () => {
        if (comment?.id && comment?.comment)
            navigation.push('CommentScreen', {
                commentId: comment.id,
                comment: comment?.comment,
                tags: comment.tags ?? [],
                commentType: comment.commentType,
                imageUri: comment.imageUri ?? undefined,
                textSnippet: comment.textSnippet ?? undefined,
                noteId: comment.noteId
            })
    }

    return <TouchableWithoutFeedback onPress={openComment} style={{ backgroundColor: Theme.colors.grey3, marginHorizontal: 16, borderColor: Theme.colors.grey3, borderRadius: 4, borderWidth: 1, marginBottom: 8 }} >
        <Text style={[styles.textSmall, { color: Theme.colors.grey5, paddingVertical: 8, paddingLeft: 16 }]}>{date} &bull; {comment?.time}</Text>
        <Text style={[styles.text, { paddingBottom: 12, color: 'white' }]}>{comment?.comment}</Text>
        {comment?.tags && comment?.tags.length > 0 ? <View style={{ display: 'flex', flexDirection: 'row', paddingLeft: 16, paddingBottom: 8, flexWrap: 'wrap' }} >
            {comment?.tags?.map((tag, index) => {
                return <View key={index + (tag as string)} style={{ backgroundColor: '#FFFFFF10', borderRadius: 2, paddingTop: 4, paddingBottom: 2, paddingHorizontal: 8, marginRight: 4, marginBottom: 4 }} >
                    <Text style={[styles.textSmall, { color: 'white', fontFamily: Theme.fonts.fontFamilyRegular, lineHeight: 18 }]} >{tag}</Text>
                </View>
            })}
        </View> : null}
    </TouchableWithoutFeedback>
}

interface CustomTextParams {
    processedStyles: InlineStyle[];
    block: Blocks;
    styles: { text: TextStyle, header: TextStyle, textSmall: TextStyle };
    mode: 'light' | 'dark';
    type: 'questions' | 'notes';
    noteId: string;
}

export function CustomText({ processedStyles, block, styles, mode, type, noteId }: CustomTextParams): JSX.Element {
    const [selected, setSelected] = useState(false);
    const [pos, setPos] = useState(0);
    const allComments = useContext(CommentContext);
    const [comments, setComments] = useState<CommentContextType['comments']>([]);


    useEffect(() => {
        setComments(allComments.comments.filter(comment => (comment?.key === block.key && comment?.noteType === type)))
    }, [allComments])

    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
    const openComment = () => {
        setSelected(false)
        navigation.push('CommentScreen', { key: block.key, noteId: noteId, commentType: CommentDataType.text, noteType: type, textSnippet: block.text })
    }

    if (processedStyles.length === 0) {
        return <Fragment>
            <Text onPress={() => setSelected(!selected)} onLayout={(e) => setPos(e.nativeEvent.layout.y)} style={{ ...styles.text, fontFamily: Theme.fonts.fontFamilyRegular, ...selected ? underline.selected : {} }}>{block.text}</Text>
            {selected ?
                <Button onPress={openComment} transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} >
                    <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
                </Button> : null}
            {comments.map(comment => <Comment key={comment?.id} comment={comment} styles={styles} />)}
        </Fragment>
    } else {
        return <Fragment>
            <Text selectable onLayout={(e) => setPos(e.nativeEvent.layout.y)} onPress={() => setSelected(!selected)} style={{ ...styles.text, marginVertical: 12 }} >
                <Text style={{ ...styles.text, ...selected ? underline.selected : {} }}>{block.text.slice(0, processedStyles[0].offset)}</Text>
                {processedStyles.map((style, index) => {
                    return <Text key={index}>
                        <Text style={{ ...styles.text, ...style.style, ...selected ? underline.selected : {} }}>{block.text.slice(style.offset, style.offset + style.length)}</Text>
                        {index + 1 < processedStyles.length ? <Text style={{ ...styles.text, ...selected ? underline.selected : {} }}>{block.text.slice(style.offset + style.length, processedStyles[index + 1].offset)}</Text> : null}
                    </Text>
                })}
                <Text style={{ ...styles.text, ...selected ? underline.selected : {} }}>{block.text.slice(processedStyles[processedStyles.length - 1].offset + processedStyles[processedStyles.length - 1].length)}</Text>
            </Text>
            {selected ?
                <Button onPress={openComment} transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} >
                    <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
                </Button> : null}
            {comments.map(comment => <Comment key={comment?.id} comment={comment} styles={styles} />)}
        </Fragment>
    }
}

export function CustomListItem({ processedStyles, block, styles, mode, noteId, type }: CustomTextParams): JSX.Element {

    const [selected, setSelected] = useState(false);
    const [pos, setPos] = useState(0);
    const allComments = useContext(CommentContext);
    const [comments, setComments] = useState<CommentContextType['comments']>([]);


    useEffect(() => {
        setComments(allComments.comments.filter(comment => (comment?.key === block.key && comment?.noteType === type)))
    }, [allComments])

    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
    const openComment = () => {
        setSelected(false)
        navigation.push('CommentScreen', { key: block.key, noteId: noteId, commentType: CommentDataType.text, noteType: type, textSnippet: block.text })
    }

    if (processedStyles.length === 0) {
        return <Fragment>
            <Text onPress={() => setSelected(!selected)} onLayout={(e) => setPos(e.nativeEvent.layout.y)} style={{ ...styles.text, ...{ marginLeft: 16 }, ...selected ? underline.selected : {} }}>&bull; {block.text}</Text>
            {selected ?
                <Button transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} onPress={openComment} >
                    <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
                </Button> : null}
            {comments.map(comment => <Comment key={comment?.id} comment={comment} styles={styles} />)}

        </Fragment>
    } else {
        return <Fragment>
            <Text onPress={() => setSelected(!selected)} onLayout={(e) => setPos(e.nativeEvent.layout.y)} style={{ ...styles.text, ...{ marginLeft: 16 }, ...selected ? underline.selected : {} }}>&bull;{' '}
                <Text style={{ ...styles.text, ...selected ? underline.selected : {} }}>{block.text.slice(0, processedStyles[0].offset)}</Text>
                {processedStyles.map((style, index) => {
                    return <Text key={index}>
                        <Text style={{ ...styles.text, ...style.style, ...selected ? underline.selected : {} }}>{block.text.slice(style.offset, style.offset + style.length)}</Text>
                        {index + 1 < processedStyles.length ? <Text style={{ ...styles.text, ...selected ? underline.selected : {} }}>{block.text.slice(style.offset + style.length, processedStyles[index + 1].offset)}</Text> : null}
                    </Text>
                })}
                <Text style={{ ...styles.text, ...selected ? underline.selected : {} }}>{block.text.slice(processedStyles[processedStyles.length - 1].offset + processedStyles[processedStyles.length - 1].length)}</Text>
            </Text>
            {selected ?
                <Button transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} onPress={openComment} >
                    <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
                </Button> : null}
            {comments.map(comment => <Comment key={comment?.id} comment={comment} styles={styles} />)}
        </Fragment>
    }
}

export function CustomHeading({ processedStyles, block, styles }: CustomTextParams): JSX.Element {

    if (processedStyles.length === 0) {
        return <Text style={{ ...styles.header, fontFamily: Theme.fonts.fontFamilyRegular }}>{block.text}</Text>
    } else {
        return <Text style={{ ...styles.header, marginVertical: 12 }} >
            <Text style={{ ...styles.header }}>{block.text.slice(0, processedStyles[0].offset)}</Text>
            {processedStyles.map((style, index) => {
                return <Text key={index}>
                    <Text style={{ ...styles.header, ...style.style }}>{block.text.slice(style.offset, style.offset + style.length)}</Text>
                    {index + 1 < processedStyles.length ? <Text style={styles.header}>{block.text.slice(style.offset + style.length, processedStyles[index + 1].offset)}</Text> : null}
                </Text>
            })}
            <Text style={styles.header}>{block.text.slice(processedStyles[processedStyles.length - 1].offset + processedStyles[processedStyles.length - 1].length)}</Text>
        </Text>

    }
}

interface ImageParams {
    data: {
        src: string;
        alt: string;
        width: string | number;
        height: string | number;
    },
    mode: 'light' | 'dark';
    type: 'questions' | 'notes';
    block: Blocks;
    noteId: string;
    styles: { text: TextStyle, header: TextStyle, textSmall: TextStyle };
}

export function CustomImage({ data, mode, type, block, noteId, styles }: ImageParams): JSX.Element {
    const [selected, setSelected] = useState(false);
    const [pos, setPos] = useState(0);
    const allComments = useContext(CommentContext);
    const [comments, setComments] = useState<CommentContextType['comments']>([]);

    useEffect(() => {
        setComments(allComments.comments.filter(comment => (comment?.key === block.key && comment?.noteType === type)))
    }, [allComments])

    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
    const openComment = () => {
        setSelected(false)
        navigation.push('CommentScreen', { key: block.key, noteId: noteId, commentType: CommentDataType.image, noteType: type, imageUri: data.src })
    }

    return <Fragment>
        <TouchableWithoutFeedback onLayout={(e) => setPos(e.nativeEvent.layout.y)} onPress={() => setSelected(!selected)} style={[{ width: Dimensions.get('screen').width - 72, marginLeft: 16, marginRight: 56, paddingVertical: 1, alignItems: 'center' }, selected ? { borderColor: 'red', borderStyle: 'dashed', borderWidth: 1 } : {}]} >
            <Image resizeMode='contain' style={{ width: Dimensions.get('screen').width - 80, minHeight: 100 }} source={{ uri: data.src }} accessibilityLabel={data.alt} />
        </TouchableWithoutFeedback>
        {selected ?
            <Button transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} onPress={openComment}>
                <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
            </Button> : null}
        {comments.map(comment => <Comment key={comment?.id} comment={comment} styles={styles} />)}
    </Fragment>

}

interface HyperLinkParams {
    block: Blocks;
    links: Array<{ text: string, offset: number, length: number, uri: string }>;
    styles: { text: TextStyle, header: TextStyle, textSmall: TextStyle };
    openVerseCallback: (youVersionUri: string | undefined, bibleGatewayUri: string) => void;
    verses: VerseType[];
    type: 'questions' | 'notes';
    date: string;
    mode: 'light' | 'dark';
    noteId: string
}

export function HyperLink({ block, links, styles, openVerseCallback, verses, type, date, mode, noteId }: HyperLinkParams): JSX.Element {
    const [show, setShow] = useState(false)
    const [passage, setPassage] = useState<HyperLinkParams['links'][0]>({ text: '', offset: -1, length: -1, uri: '' });
    const [pos, setPos] = useState(0);
    const [selected, setSelected] = useState(false);
    const allComments = useContext(CommentContext);
    const [comments, setComments] = useState<CommentContextType['comments']>([]);

    useEffect(() => {
        setComments(allComments.comments.filter(comment => (comment?.key === block.key && comment?.noteType === type)))
    }, [allComments])

    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
    const openComment = () => {
        setSelected(false)
        if (show)
            navigation.push('CommentScreen', { key: block.key, noteId: noteId, commentType: CommentDataType.biblePassage, noteType: type, textSnippet: passage.text })
        else
            navigation.push('CommentScreen', { key: block.key, noteId: noteId, commentType: CommentDataType.text, noteType: type, textSnippet: block.text })
    }

    const handleClick = async (link: HyperLinkParams['links'][0]) => {
        if (link.uri.includes('biblegateway')) {
            setPassage(link);
            setShow(link.offset === passage.offset ? !show : true);
        } else {
            const canOpen = await Linking.canOpenURL(link.uri);
            if (canOpen)
                try {
                    await Linking.openURL(link.uri)
                } catch (e) {
                    console.debug(e)
                }
        }
    }

    const replaceVerseNumbers = (content: string) => {
        const superscript: { [key: string]: string } = {
            '0': '\u2070',
            '1': '\u00B9',
            '2': '\u00B2',
            '3': '\u00B3',
            '4': '\u2074',
            '5': '\u2075',
            '6': '\u2076',
            '7': '\u2077',
            '8': '\u2078',
            '9': '\u2079'
        }

        const processed = content.replace(/[0123456789]/g,
            (num) => {
                return superscript[num]
            }
        )

        return processed + ' '
    }

    const parseBibleJSON = (data: any, index: number, length: number) => {

        //console.log(data)

        if (data?.attrs?.style === 's1') {
            return <Text style={styles.header} key={index}>
                {data.items.map((item: any, index: number) => {
                    if (item.text) {
                        return <Text key={item.text + index} style={{ ...styles.header, fontFamily: Theme.fonts.fontFamilyBold }}>{item.text + '\n'}</Text>
                    } else {
                        return null
                    }
                })}
            </Text>
        } else if (data?.attrs.style === 'q1' || data?.attrs.style === 'q2') {
            return <Text key={index} style={styles.text} >
                {data.items.map((item: any, index: number) => {
                    if (item.attrs?.style === 'v') {
                        return <Text key={index + 'v'} style={styles.text}>{replaceVerseNumbers(item.attrs?.number)}</Text>
                    } else if (item.text) {
                        return <Text key={item.text + index} style={styles.text}>{(data.attrs.style === 'q2' ? '   ' : '') + item.text + (index === length - 1 ? '' : '\n')}</Text>
                    } else if (item.items) {
                        return <Text key={index} style={styles.text}>{item.items.map((item2: any) => {
                            return <Text key={item2.text + index} style={styles.text}>{item2.text}</Text>
                        })}</Text>
                    } else {
                        return null
                    }
                })}
            </Text>
        } else {
            return <Text key={index} style={styles.text} >{index === 0 ? '' : '   '}
                {data.items.map((item: any, index: number) => {
                    if (item.attrs?.style === 'v') {
                        return <Text key={index + 'v'} style={styles.text}>{replaceVerseNumbers(item.attrs?.number)}</Text>
                    } else if (item.text) {
                        return <Text key={item.text + index} style={styles.text}>{item.text}</Text>
                    } else if (item.items) {
                        return <Text key={index} style={styles.text}>{item.items.map((item2: any) => {
                            return <Text key={item2.text + index} style={styles.text}>{item2.text}</Text>
                        })}</Text>
                    } else {
                        return null
                    }
                })}
                {(index === length - 1) ? '' : data.items[data.items.length - 1]?.text?.includes(':') ? '\n' : '\n \n'}</Text>
        }
    }

    const renderBibleVerse = (reference: string) => {
        const testId = `${type}-${date}-${block.key}-${passage.offset}-${passage.length}`;
        const biblePassage = verses.find(item => item.id === testId);

        let passageJSON = null;

        if (biblePassage?.content) {
            try {
                passageJSON = JSON.parse(biblePassage?.content);
                console.log(passageJSON)
            } catch (e) {
                passageJSON = null;
                console.debug(e);
            }
        }

        return <View style={{ backgroundColor: 'transparent', marginHorizontal: 16, borderColor: Theme.colors.grey3, borderRadius: 4, borderWidth: 1, marginBottom: 8 }} >
            <View style={{ backgroundColor: Theme.colors.grey3, paddingVertical: 8, borderTopLeftRadius: 3, borderTopRightRadius: 3, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
                <Text style={[styles.textSmall, { color: 'white' }]}>{reference} (NIV)</Text>
                <TouchableOpacity style={{ marginRight: 8 }} onPress={() => openVerseCallback(biblePassage?.youVersionUri, passage.uri)}>
                    <Thumbnail source={Theme.icons.white.newWindow} square style={{ width: 16, height: 16 }}></Thumbnail>
                </TouchableOpacity>
            </View>
            {!passageJSON ?
                <Text style={[styles.text, { paddingVertical: 12 }]}>Oops. Something went wrong. Please try opening this passage in the browser.</Text>
                : <Text style={{ padding: 12 }}>{passageJSON.map((item: any, index: number) => { return parseBibleJSON(item, index, passageJSON.length) })}</Text>
            }
        </View>
    }

    return (
        <Fragment>
            <Text style={{ ...styles.text, marginVertical: 12 }} onLayout={(e) => setPos(e.nativeEvent.layout.y)} onPress={() => setSelected(!selected)} >
                <Text style={{ ...styles.text, ...selected ? underline.selected : {} }}>{block.text.slice(0, links[0].offset)}</Text>
                {links.map((link, index) => {
                    return <Text key={index}>
                        <Text onPress={() => handleClick(link)} style={{ ...styles.text, ...{ textDecorationLine: 'underline', textDecorationColor: passage.offset === link.offset && show ? Theme.colors.red : undefined, textDecorationStyle: passage.offset === link.offset && show ? 'dotted' : undefined }, ...selected ? underline.selected : {} }}>{block.text.slice(link.offset, link.offset + link.length)}</Text>
                        {index + 1 < links.length ? <Text style={{ ...styles.text, ...selected ? underline.selected : {} }}>{block.text.slice(link.offset + link.length, links[index + 1].offset)}</Text> : null}
                    </Text>
                })}
                <Text style={{ ...styles.text, ...selected ? underline.selected : {} }}>{block.text.slice(links[links.length - 1].offset + links[links.length - 1].length)}</Text>
            </Text>
            {show ? renderBibleVerse(block.text.slice(passage.offset, passage.offset + passage.length)) : null}
            {selected || show ? <Button onPress={openComment} transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} >
                <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
            </Button> : null}
            {comments.map(comment => <Comment key={comment?.id} comment={comment} styles={styles} />)}
        </Fragment >
    )
}
