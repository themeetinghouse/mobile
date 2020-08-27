import React from 'react';
import { View, Text, Image, StyleSheet, TextStyle } from 'react-native';
import { Theme } from '../../../Theme.style';
import * as Linking from 'expo-linking';


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

interface Params {
    blocks: Blocks[];
    entityMap: any;
    mode: 'dark' | 'light';
}

const bookCodes: { [book: string]: string } = {
    'genesis': 'GEN',
    'exodus': 'EXO',
    'leviticus': 'LEV',
    'numbers': 'NUM',
    'deuteronomy': 'DEU',
    'joshua': 'JOS',
    'judges': 'JDG',
    'ruth': 'RUT',
    '1 samuel': '1SA',
    '2 samuel': '2SA',
    '1 kings': '1KI',
    '2 kings': '2KI',
    '1 chronicles': '1CH',
    '2 chronicles': '2CH',
    'ezra': 'EZR',
    'nehemiah': 'NEH',
    'esther': 'EST',
    'job': 'JOB',
    'psalms': 'PSA',
    'proverbs': 'PRO',
    'ecclesiastes': 'ECC',
    'song of solomon': 'SNG',
    'songs': 'SNG',
    'isaiah': 'ISA',
    'jeremiah': 'JER',
    'lamentations': 'LAM',
    'ezekiel': 'EZK',
    'daniel': 'DAN',
    'hosea': 'HOS',
    'joel': 'JOL',
    'amos': 'AMO',
    'obadiah': 'OBA',
    'jonah': 'JON',
    'micah': 'MIC',
    'nahum': 'NAM',
    'habakkuk': 'HAB',
    'zephaniah': 'ZEP',
    'haggai': 'HAG',
    'zechariah': 'ZEC',
    'malachi': 'MAL',
    'matthew': 'MAT',
    'mark': 'MRK',
    'luke': 'LKE',
    'john': 'JHN',
    'acts': 'ACT',
    'romans': 'ROM',
    '1 corinthians': '1CO',
    '2 corinthians': '2CO',
    'galatians': 'GAL',
    'ephesians': 'EPH',
    'philippians': 'PHP',
    'colossians': 'COL',
    '1 thessalonians': '1TH',
    '2 thessalonians': '2TH',
    '1 timothy': '1TI',
    '2 timothy': '2TI',
    'titus': 'TIT',
    'philemon': 'PHM',
    'hebrews': 'HEB',
    'james': 'JAS',
    '1 peter': '1PE',
    '2 peter': '2PE',
    '1 john': '1JN',
    '2 john': '2JN',
    '3 john': '3JN',
    'jude': 'JUD',
    'revelation': 'REV'
}

function getYouVersionURI(bibleRef: string): string {
    const temp = bibleRef.split(' ');
    const book = temp[0].toLowerCase();
    const chap = temp[1].split(':')[0]

    return `https://www.bible.com/bible/111/${book}.${chap}.NIV`
}

export default function NoteReader({ blocks, entityMap, mode }: Params): JSX.Element {

    const color = mode === 'dark' ? 'white' : 'black'
    const styles = StyleSheet.create({
        text: {
            color: color,
            fontSize: 16,
            lineHeight: 24,
            paddingHorizontal: 16
        },
        header: {
            color: color,
            fontSize: 24,
            lineHeight: 32,
            paddingHorizontal: 16,
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
            const links: Array<{ text: string, offset: number, length: number }> = [];
            block.entityRanges.forEach((entity: any) => {
                const data = entityMap[entity.key];
                switch (data.type) {
                    case "IMAGE":
                        markupArray.push(<Image key={block.key} resizeMode='contain' style={{ width: '100%', minHeight: 120 }} source={{ uri: data.data.src }} accessibilityLabel={data.data.alt}></Image>)
                        break;
                    case "LINK":
                        links.push({ text: block.text.slice(entity.offset, entity.offset + entity.length), offset: entity.offset, length: entity.length });
                        break;
                }
            })

            if (links.length > 0) {
                markupArray.push(
                    <Text key={block.key} style={{ paddingHorizontal: 16, marginVertical: 12 }} >
                        <Text style={{ ...styles.text, }}>{block.text.slice(0, links[0].offset)}</Text>
                        {links.map((link, index) => {
                            return <Text key={index}>
                                <Text style={{ ...styles.text, ...{ textDecorationLine: 'underline' } }}>{block.text.slice(link.offset, link.offset + link.length)}</Text>
                                {index + 1 < links.length ? <Text style={styles.text}>{block.text.slice(link.offset + link.length, links[index + 1].offset)}</Text> : null}
                            </Text>
                        })}
                        <Text style={styles.text}>{block.text.slice(links[links.length - 1].offset + links[links.length - 1].length)}</Text>
                    </Text>
                )
            }
        } else {
            const filteredStyles = block.inlineStyleRanges.filter(style => style.style === 'BOLD' || style.style === 'UNDERLINE' || style.style === 'ITALIC')
            let processedStyles: InlineStyle[] = [];
            if (filteredStyles.length > 0)
                processedStyles = addStyles(filteredStyles)

            switch (block.type) {
                case "unstyled":
                case "paragraph":
                case "blockquote":
                case "code-block":
                    if (processedStyles.length === 0) {
                        markupArray.push(<Text key={block.key} style={{ ...styles.text, fontFamily: Theme.fonts.fontFamilyRegular }}>{block.text}</Text>)
                    } else {
                        markupArray.push(
                            <Text key={block.key} style={{ paddingHorizontal: 16, marginVertical: 12 }} >
                                <Text style={styles.text}>{block.text.slice(0, processedStyles[0].offset)}</Text>
                                {processedStyles.map((style, index) => {
                                    return <Text key={index}>
                                        <Text style={{ ...styles.text, ...style.style }}>{block.text.slice(style.offset, style.offset + style.length)}</Text>
                                        {index + 1 < processedStyles.length ? <Text style={styles.text}>{block.text.slice(style.offset + style.length, processedStyles[index + 1].offset)}</Text> : null}
                                    </Text>
                                })}
                                <Text style={styles.text}>{block.text.slice(processedStyles[processedStyles.length - 1].offset + processedStyles[processedStyles.length - 1].length)}</Text>
                            </Text>
                        )
                    }
                    break;

                case "header-one":
                case "header-two":
                case "header-three":
                case "header-four":
                case "header-five":
                case "header-six":
                    if (processedStyles.length === 0) {
                        markupArray.push(<Text key={block.key} style={{ ...styles.header, fontFamily: Theme.fonts.fontFamilyRegular }}>{block.text}</Text>)
                    } else {
                        markupArray.push(
                            <Text key={block.key} style={{ paddingHorizontal: 16, marginVertical: 12 }} >
                                <Text style={{ ...styles.header }}>{block.text.slice(0, processedStyles[0].offset)}</Text>
                                {processedStyles.map((style, index) => {
                                    return <Text key={index}>
                                        <Text style={{ ...styles.header, ...style.style }}>{block.text.slice(style.offset, style.offset + style.length)}</Text>
                                        {index + 1 < processedStyles.length ? <Text style={styles.header}>{block.text.slice(style.offset + style.length, processedStyles[index + 1].offset)}</Text> : null}
                                    </Text>
                                })}
                                <Text style={styles.header}>{block.text.slice(processedStyles[processedStyles.length - 1].offset + processedStyles[processedStyles.length - 1].length)}</Text>
                            </Text>
                        )
                    }
                    break;

                case "unordered-list-item":
                case "ordered-list-item":
                    if (processedStyles.length === 0) {
                        markupArray.push(<Text key={block.key} style={{ ...styles.text, ...{ marginLeft: 16 } }}>&bull; {block.text}</Text>)
                    } else {
                        markupArray.push(
                            <Text key={block.key} style={{ ...styles.text, ...{ marginLeft: 16 } }}>&bull;{' '}
                                <Text style={styles.text}>{block.text.slice(0, processedStyles[0].offset)}</Text>
                                {processedStyles.map((style, index) => {
                                    return <Text key={index}>
                                        <Text style={{ ...styles.text, ...style.style }}>{block.text.slice(style.offset, style.offset + style.length)}</Text>
                                        {index + 1 < processedStyles.length ? <Text style={styles.text}>{block.text.slice(style.offset + style.length, processedStyles[index + 1].offset)}</Text> : null}
                                    </Text>
                                })}
                                <Text style={styles.text}>{block.text.slice(processedStyles[processedStyles.length - 1].offset + processedStyles[processedStyles.length - 1].length)}</Text>
                            </Text>
                        )
                    }
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