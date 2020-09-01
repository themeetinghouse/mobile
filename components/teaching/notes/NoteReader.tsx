import React, { useState, Fragment } from 'react';
import { View, Text, Image, StyleSheet, TextStyle, Dimensions } from 'react-native';
import { Theme } from '../../../Theme.style';
import * as Linking from 'expo-linking';
import { Thumbnail, Button } from 'native-base';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

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

interface CustomTextParams {
    processedStyles: InlineStyle[];
    block: Blocks;
    styles: { text: TextStyle, header: TextStyle, textSmall: TextStyle };
    mode: 'light' | 'dark';
}

function CustomText({ processedStyles, block, styles, mode }: CustomTextParams): JSX.Element {
    const [selected, setSelected] = useState(false);
    const [pos, setPos] = useState(0);

    if (processedStyles.length === 0) {
        return <Fragment>
            <Text onPress={() => setSelected(!selected)} onLayout={(e) => setPos(e.nativeEvent.layout.y)} style={{ ...styles.text, fontFamily: Theme.fonts.fontFamilyRegular, ...selected ? underline.selected : {} }}>{block.text}</Text>
            {selected ?
                <Button transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} >
                    <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
                </Button> : null}
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
                <Button onPress={() => console.log(block)} transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} >
                    <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
                </Button> : null}
        </Fragment>
    }
}

function CustomListItem({ processedStyles, block, styles, mode }: CustomTextParams): JSX.Element {

    const [selected, setSelected] = useState(false);
    const [pos, setPos] = useState(0);

    if (processedStyles.length === 0) {
        return <Fragment>
            <Text onPress={() => setSelected(!selected)} onLayout={(e) => setPos(e.nativeEvent.layout.y)} style={{ ...styles.text, ...{ marginLeft: 16 }, ...selected ? underline.selected : {} }}>&bull; {block.text}</Text>
            {selected ?
                <Button transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} >
                    <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
                </Button> : null}
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
                <Button transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} >
                    <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
                </Button> : null}
        </Fragment>
    }
}

function CustomHeading({ processedStyles, block, styles }: CustomTextParams): JSX.Element {

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
}

function CustomImage({ data, mode }: ImageParams): JSX.Element {
    const [selected, setSelected] = useState(false);
    const [pos, setPos] = useState(0);

    return <Fragment>
        <TouchableWithoutFeedback onLayout={(e) => setPos(e.nativeEvent.layout.y)} onPress={() => setSelected(!selected)} style={[{ width: Dimensions.get('screen').width - 72, marginLeft: 16, marginRight: 56, paddingVertical: 1, alignItems: 'center' }, selected ? { borderColor: 'red', borderStyle: 'dashed', borderWidth: 1 } : {}]} >
            <Image resizeMode='contain' style={{ width: Dimensions.get('screen').width - 80, minHeight: 100 }} source={{ uri: data.src }} accessibilityLabel={data.alt} />
        </TouchableWithoutFeedback>
        {selected ?
            <Button transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} >
                <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
            </Button> : null}
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
}

function HyperLink({ block, links, styles, openVerseCallback, verses, type, date, mode }: HyperLinkParams): JSX.Element {
    const [show, setShow] = useState(false)
    const [passage, setPassage] = useState<HyperLinkParams['links'][0]>({ text: '', offset: -1, length: -1, uri: '' });
    const [pos, setPos] = useState(0);
    const [selected, setSelected] = useState(false);

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

        console.log(data)

        if (data?.attrs?.style === 's1') {
            return <Text style={styles.header} key={index}>
                {data.items.map((item: any) => {
                    if (item.text) {
                        return <Text style={{ ...styles.header, fontFamily: Theme.fonts.fontFamilyBold }}>{item.text + '\n'}</Text>
                    } else if (item.items) {
                        return <Text>
                            {item.items.map((item2: any, index: number) => {
                                return <Text style={{ ...styles.header, fontFamily: Theme.fonts.fontFamilyBold }} key={index}>{item2.text}</Text>
                            })}</Text>
                    } else {
                        return null
                    }
                })}
            </Text>
        } else if (data?.attrs.style === 'q1' || data?.attrs.style === 'q2') {
            return <Text key={index} style={styles.text} >
                {data.items.map((item: any) => {
                    if (item.attrs?.style === 'v') {
                        return <Text style={styles.text}>{replaceVerseNumbers(item.attrs?.number)}</Text>
                    } else if (item.text) {
                        return <Text style={styles.text}>{(data.attrs.style === 'q2' ? '   ' : '') + item.text + (index === length - 1 ? '' : '\n')}</Text>
                    } else if (item.items) {
                        return <Text style={styles.text}>{item.items.map((item2: any, index: number) => {
                            return <Text key={index} style={styles.text}>{item2.text}</Text>
                        })}</Text>
                    } else {
                        return null
                    }
                })}
            </Text>
        } else {
            return <Text key={index} style={styles.text} >{index === 0 ? '' : '   '}
                {data.items.map((item: any) => {
                    if (item.attrs?.style === 'v') {
                        return <Text style={styles.text}>{replaceVerseNumbers(item.attrs?.number)}</Text>
                    } else if (item.text) {
                        return <Text style={styles.text}>{item.text}</Text>
                    } else if (item.items) {
                        return <Text style={styles.text}>{item.items.map((item2: any, index: number) => {
                            return <Text key={index} style={styles.text}>{item2.text}</Text>
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
            {selected || show ? <Button transparent style={{ position: 'absolute', right: 16, top: pos - 5 }} >
                <Thumbnail source={mode === 'dark' ? Theme.icons.white.addComment : Theme.icons.black.addComment} square style={{ width: 24, height: 24 }} />
            </Button> : null}
        </Fragment >
    )
}

interface NoteReaderParams {
    blocks: Blocks[];
    entityMap: any;
    mode: 'dark' | 'light';
    fontScale: number;
    type: 'questions' | 'notes';
    openVerseCallback: (youVersionUri: string | undefined, bibleGatewayUri: string) => void;
    verses: VerseType[];
    date: string;
}

export default function NoteReader({ blocks, entityMap, mode, fontScale, type, openVerseCallback, verses, date }: NoteReaderParams): JSX.Element {

    const color = mode === 'dark' ? 'white' : 'black'
    const styles = StyleSheet.create({
        text: {
            color: color,
            fontSize: 16 * fontScale,
            lineHeight: 24 * fontScale,
            paddingLeft: 16,
            marginRight: 56
        },
        textSmall: {
            color: color,
            fontSize: 12 * fontScale,
            lineHeight: 18 * fontScale,
            paddingHorizontal: 8
        },
        header: {
            color: color,
            fontSize: 24 * fontScale,
            lineHeight: 32 * fontScale,
            paddingLeft: 16,
            marginRight: 56,
            marginVertical: 24
        }
    })

    const markupArray: JSX.Element[] = [];

    function addStyles(styleArray: DraftStyle[]) {
        const flatStyles: DraftStyle[] = [];

        const copy = styleArray

        copy.forEach(style => {
            const index = flatStyles.findIndex(i => i.length === style.length && i.offset === style.offset);
            if (index !== -1) {
                flatStyles[index] = { ...flatStyles[index], style: flatStyles[index].style.concat(style.style) };
            } else {
                flatStyles.push(style);
            }
        })

        const processedStyles: InlineStyle[] = [];

        flatStyles.forEach(style => {
            let fontFamily: TextStyle['fontFamily'] = Theme.fonts.fontFamilyRegular;
            let textDecorationLine: TextStyle['textDecorationLine'] = 'none';

            if (style.style.includes("BOLD")) {
                fontFamily = Theme.fonts.fontFamilyBold;
            }

            if (style.style.includes("ITALIC")) {
                fontFamily = Theme.fonts.fontFamilyItalic;
            }

            if (style.style.includes("UNDERLINE")) {
                textDecorationLine = 'underline';
            }

            processedStyles.push({
                length: style.length,
                offset: style.offset,
                style: {
                    fontFamily,
                    textDecorationLine
                }
            })
        })

        return processedStyles
    }

    for (const block of blocks) {
        if (block.entityRanges.length > 0) {
            const links: Array<{ text: string, offset: number, length: number, uri: string }> = [];
            block.entityRanges.forEach((entity: any) => {
                const data = entityMap[entity.key];
                switch (data.type) {
                    case "IMAGE":
                        markupArray.push(<CustomImage mode={mode} data={data.data} key={block.key + type} />)
                        break;
                    case "LINK":
                        links.push({ text: block.text.slice(entity.offset, entity.offset + entity.length), offset: entity.offset, length: entity.length, uri: data.data.url });
                        break;
                }
            })

            if (links.length > 0) {
                markupArray.push(
                    <HyperLink mode={mode} key={block.key + type} block={block} links={links} styles={styles} verses={verses} type={type} date={date} openVerseCallback={openVerseCallback} />
                )
            }
        } else {
            const filteredStyles = block.inlineStyleRanges.filter(style => style.style === 'BOLD' || style.style === 'UNDERLINE' || style.style === 'ITALIC')
            let processedStyles: InlineStyle[] = [];
            if (filteredStyles.length > 0)
                processedStyles = addStyles(filteredStyles)

            const props = {
                mode: mode,
                key: block.key + type,
                block: block,
                processedStyles: processedStyles,
                styles: styles,
            }

            switch (block.type) {
                case "unstyled":
                case "paragraph":
                case "blockquote":
                case "code-block":
                    markupArray.push(<CustomText {...props} />)
                    break;

                case "header-one":
                case "header-two":
                case "header-three":
                case "header-four":
                case "header-five":
                case "header-six":
                    markupArray.push(<CustomHeading {...props} />)
                    break;

                case "unordered-list-item":
                case "ordered-list-item":
                    markupArray.push(<CustomListItem {...props} />)
                    break;
                case "atomic":
                    break;
            }
        }
    }

    return <View style={{ width: '100%', marginBottom: 48, marginTop: 12 }} >
        {markupArray.map(item => { return item })}
    </View>

}