import React from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import { Theme } from '../../../Theme.style';
import {
  HyperLink,
  CustomHeading,
  CustomImage,
  CustomListItem,
  CustomText,
  HeaderImage,
} from './TextComponents';
import { GetNotesQuery } from '../../../services/API';

type ContentType =
  | 'unstyled'
  | 'paragraph'
  | 'header-one'
  | 'header-two'
  | 'header-three'
  | 'header-four'
  | 'header-five'
  | 'header-six'
  | 'unordered-list-item'
  | 'ordered-list-item'
  | 'blockquote'
  | 'code-block'
  | 'atomic';

type DraftStyle = {
  length: number;
  offset: number;
  style: string;
};

type InlineStyle = {
  length: number;
  offset: number;
  style: TextStyle;
};

type Blocks = {
  data: any;
  depth: number;
  entityRanges: any[];
  inlineStyleRanges: DraftStyle[];
  key: string;
  text: string;
  type: ContentType;
};

type VerseType = NonNullable<
  NonNullable<GetNotesQuery['getNotes']>['verses']
>['items'];

interface NoteReaderParams {
  blocks: Blocks[];
  entityMap: any;
  mode: 'dark' | 'light';
  fontScale: number;
  type: 'questions' | 'notes';
  openVerseCallback: (
    youVersionUri: string | undefined,
    bibleGatewayUri: string
  ) => void;
  verses: VerseType;
  date: string;
  noteId: string;
  fromLiveStream: boolean | undefined;
}

export default function NoteReader({
  blocks,
  entityMap,
  mode,
  fontScale,
  type,
  openVerseCallback,
  verses,
  date,
  noteId,
  fromLiveStream,
}: NoteReaderParams): JSX.Element {
  const color = mode === 'dark' ? 'white' : 'black';
  const styles = StyleSheet.create({
    text: {
      color,
      fontSize: 16 * fontScale,
      lineHeight: 24 * fontScale,
      paddingLeft: 16,
      marginRight: 56,
    },
    textSmall: {
      color,
      fontSize: 12 * fontScale,
      lineHeight: 18 * fontScale,
      paddingHorizontal: 8,
    },
    header: {
      color,
      fontSize: 24 * fontScale,
      lineHeight: 32 * fontScale,
      paddingLeft: 16,
      marginRight: 56,
      marginVertical: 24,
    },
  });

  const markupArray: JSX.Element[] = [];

  function addStyles(styleArray: DraftStyle[]) {
    const flatStyles: DraftStyle[] = [];

    const copy = styleArray;

    copy.forEach((style) => {
      const index = flatStyles.findIndex(
        (i) => i.length === style.length && i.offset === style.offset
      );
      if (index !== -1) {
        flatStyles[index] = {
          ...flatStyles[index],
          style: flatStyles[index].style.concat(style.style),
        };
      } else {
        flatStyles.push(style);
      }
    });

    const processedStyles: InlineStyle[] = [];

    flatStyles.forEach((style) => {
      let fontFamily: TextStyle['fontFamily'] = Theme.fonts.fontFamilyRegular;
      let textDecorationLine: TextStyle['textDecorationLine'] = 'none';

      if (style.style.includes('BOLD')) {
        fontFamily = Theme.fonts.fontFamilyBold;
      }

      if (style.style.includes('ITALIC')) {
        fontFamily = Theme.fonts.fontFamilyItalic;
      }

      if (style.style.includes('UNDERLINE')) {
        textDecorationLine = 'underline';
      }

      processedStyles.push({
        length: style.length,
        offset: style.offset,
        style: {
          fontFamily,
          textDecorationLine,
        },
      });
    });

    return processedStyles;
  }

  let numberOfImages = 0;

  blocks.forEach((block) => {
    if (block.entityRanges.length > 0) {
      const links: Array<{
        text: string;
        offset: number;
        length: number;
        uri: string;
      }> = [];
      block.entityRanges.forEach((entity: any) => {
        const data = entityMap[entity.key];
        if (data.type === 'IMAGE') {
          if (numberOfImages === 0) {
            // this removes the first header image
            if (!fromLiveStream)
              markupArray.push(
                <HeaderImage data={data.data} key={data.data?.src} />
              );
          } else {
            markupArray.push(
              <CustomImage
                styles={styles}
                noteId={noteId}
                block={block}
                mode={mode}
                data={data.data}
                key={block.key + type}
                type={type}
              />
            );
          }
          numberOfImages += 1;
        } else if (data.type === 'LINK') {
          links.push({
            text: block.text.slice(
              entity.offset,
              entity.offset + entity.length
            ),
            offset: entity.offset,
            length: entity.length,
            uri: data.data.url,
          });
        }
      });

      if (links.length > 0) {
        markupArray.push(
          <HyperLink
            noteId={noteId}
            mode={mode}
            key={block.key + type}
            block={block}
            links={links}
            styles={styles}
            verses={verses}
            type={type}
            date={date}
            openVerseCallback={openVerseCallback}
          />
        );
      }
    } else {
      const filteredStyles = block.inlineStyleRanges.filter(
        (style) =>
          style.style === 'BOLD' ||
          style.style === 'UNDERLINE' ||
          style.style === 'ITALIC'
      );
      let processedStyles: InlineStyle[] = [];
      if (filteredStyles.length > 0)
        processedStyles = addStyles(filteredStyles);

      switch (block.type) {
        case 'unstyled':
        case 'paragraph':
        case 'blockquote':
        case 'code-block':
          markupArray.push(
            <CustomText
              key={block.key + type}
              processedStyles={processedStyles}
              block={block}
              styles={styles}
              mode={mode}
              type={type}
              noteId={noteId}
            />
          );
          break;

        case 'header-one':
        case 'header-two':
        case 'header-three':
        case 'header-four':
        case 'header-five':
        case 'header-six':
          markupArray.push(
            <CustomHeading
              key={block.key + type}
              block={block}
              styles={styles}
            />
          );
          break;

        case 'unordered-list-item':
        case 'ordered-list-item':
          markupArray.push(
            <CustomListItem
              key={block.key + type}
              processedStyles={processedStyles}
              block={block}
              styles={styles}
              mode={mode}
              type={type}
              noteId={noteId}
            />
          );
          break;

        default:
          break;
      }
    }
  });

  return (
    <View
      style={
        fromLiveStream && type === 'notes'
          ? { width: '100%', marginBottom: 48, marginTop: -18 }
          : { width: '100%', marginBottom: 48, marginTop: 12 }
      }
    >
      {markupArray.map((item) => {
        return item;
      })}
    </View>
  );
}
