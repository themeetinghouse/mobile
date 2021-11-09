import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextStyle,
  Dimensions,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Button } from 'native-base';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import { MainStackParamList } from '../../../navigation/AppNavigator';
import { CommentDataType, GetNotesQuery } from '../../../services/API';
import CommentContext, {
  CommentContextType,
} from '../../../contexts/CommentContext';
import { Theme } from '../../../Theme.style';

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

const underline = StyleSheet.create({
  selected: {
    textDecorationColor: Theme.colors.red,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
});

interface CommentParams {
  comment: CommentContextType['comments'][0];
  styles: { text: TextStyle; header: TextStyle; textSmall: TextStyle };
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
        noteId: comment.noteId,
      });
  };

  return (
    <TouchableWithoutFeedback
      onPress={openComment}
      style={{
        backgroundColor: Theme.colors.grey3,
        marginHorizontal: 16,
        borderColor: Theme.colors.grey3,
        borderRadius: 4,
        borderWidth: 1,
        marginBottom: 8,
      }}
    >
      <Text
        style={[
          styles.textSmall,
          { color: Theme.colors.grey5, paddingVertical: 8, paddingLeft: 16 },
        ]}
      >
        {date} &bull; {comment?.time}
      </Text>
      <Text style={[styles.text, { paddingBottom: 12, color: 'white' }]}>
        {comment?.comment}
      </Text>
      {comment?.tags && comment?.tags.length > 0 ? (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            paddingLeft: 16,
            paddingBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          {comment?.tags?.map((tag) => {
            return (
              <View
                key={tag}
                style={{
                  backgroundColor: '#FFFFFF10',
                  borderRadius: 2,
                  paddingTop: 4,
                  paddingBottom: 2,
                  paddingHorizontal: 8,
                  marginRight: 4,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={[
                    styles.textSmall,
                    {
                      color: 'white',
                      fontFamily: Theme.fonts.fontFamilyRegular,
                      lineHeight: 18,
                    },
                  ]}
                >
                  {tag}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </TouchableWithoutFeedback>
  );
}

interface CustomTextParams {
  processedStyles: InlineStyle[];
  block: Blocks;
  styles: { text: TextStyle; header: TextStyle; textSmall: TextStyle };
  mode: 'light' | 'dark';
  type: 'questions' | 'notes';
  noteId: string;
}

export function CustomText({
  processedStyles,
  block,
  styles,
  mode,
  type,
  noteId,
}: CustomTextParams): JSX.Element | null {
  const [selected, setSelected] = useState(false);
  const [pos, setPos] = useState(0);
  const allComments = useContext(CommentContext);
  const [comments, setComments] = useState<CommentContextType['comments']>([]);

  useEffect(() => {
    setComments(
      allComments.comments.filter(
        (comment) => comment?.key === block.key && comment?.noteType === type
      )
    );
  }, [block.key, type, allComments]);

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const openComment = () => {
    setSelected(false);
    navigation.push('CommentScreen', {
      key: block.key,
      noteId,
      commentType: CommentDataType.text,
      noteType: type,
      textSnippet: block.text,
    });
  };

  const hasText = /\w/g.test(block.text);

  if (processedStyles.length === 0) {
    return (
      <>
        <Text
          onPress={hasText ? () => setSelected(!selected) : undefined}
          onLayout={(e) => setPos(e.nativeEvent.layout.y)}
          style={{
            ...styles.text,
            fontFamily: Theme.fonts.fontFamilyRegular,
            ...(selected ? underline.selected : {}),
          }}
        >
          {block.text}
        </Text>
        {selected ? (
          <Button
            onPress={openComment}
            style={{ position: 'absolute', right: 16, top: pos - 5 }}
          >
            <Image
              source={
                mode === 'dark'
                  ? Theme.icons.white.addComment
                  : Theme.icons.black.addComment
              }
              style={{ width: 24, height: 24 }}
            />
          </Button>
        ) : null}
        {comments.map((comment) => (
          <Comment key={comment?.id} comment={comment} styles={styles} />
        ))}
      </>
    );
  }
  return (
    <>
      <Text
        onLayout={(e) => setPos(e.nativeEvent.layout.y)}
        onPress={hasText ? () => setSelected(!selected) : undefined}
        style={{ ...styles.text, marginVertical: 12 }}
      >
        <Text
          style={{ ...styles.text, ...(selected ? underline.selected : {}) }}
        >
          {block.text.slice(0, processedStyles[0].offset)}
        </Text>
        {processedStyles.map((style, index) => {
          return (
            <Text key={style.offset}>
              <Text
                style={{
                  ...styles.text,
                  ...style.style,
                  ...(selected ? underline.selected : {}),
                }}
              >
                {block.text.slice(style.offset, style.offset + style.length)}
              </Text>
              {index + 1 < processedStyles.length ? (
                <Text
                  style={{
                    ...styles.text,
                    ...(selected ? underline.selected : {}),
                  }}
                >
                  {block.text.slice(
                    style.offset + style.length,
                    processedStyles[index + 1].offset
                  )}
                </Text>
              ) : null}
            </Text>
          );
        })}
        <Text
          style={{ ...styles.text, ...(selected ? underline.selected : {}) }}
        >
          {block.text.slice(
            processedStyles[processedStyles.length - 1].offset +
              processedStyles[processedStyles.length - 1].length
          )}
        </Text>
      </Text>
      {selected ? (
        <Button
          onPress={openComment}
          style={{ position: 'absolute', right: 16, top: pos - 5 }}
        >
          <Image
            source={
              mode === 'dark'
                ? Theme.icons.white.addComment
                : Theme.icons.black.addComment
            }
            style={{ width: 24, height: 24 }}
          />
        </Button>
      ) : null}
      {comments.map((comment) => (
        <Comment key={comment?.id} comment={comment} styles={styles} />
      ))}
    </>
  );
}

export function CustomListItem({
  processedStyles,
  block,
  styles,
  mode,
  noteId,
  type,
}: CustomTextParams): JSX.Element {
  const [selected, setSelected] = useState(false);
  const [pos, setPos] = useState(0);
  const allComments = useContext(CommentContext);
  const [comments, setComments] = useState<CommentContextType['comments']>([]);

  useEffect(() => {
    setComments(
      allComments.comments.filter(
        (comment) => comment?.key === block.key && comment?.noteType === type
      )
    );
  }, [block.key, type, allComments]);

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const openComment = () => {
    setSelected(false);
    navigation.push('CommentScreen', {
      key: block.key,
      noteId,
      commentType: CommentDataType.text,
      noteType: type,
      textSnippet: block.text,
    });
  };

  if (processedStyles.length === 0) {
    return (
      <>
        <Text
          onPress={() => setSelected(!selected)}
          onLayout={(e) => setPos(e.nativeEvent.layout.y)}
          style={{
            ...styles.text,
            ...{ marginLeft: 16 },
            ...(selected ? underline.selected : {}),
          }}
        >
          &bull; {block.text}
        </Text>
        {selected ? (
          <Button
            style={{ position: 'absolute', right: 16, top: pos - 5 }}
            onPress={openComment}
          >
            <Image
              source={
                mode === 'dark'
                  ? Theme.icons.white.addComment
                  : Theme.icons.black.addComment
              }
              style={{ width: 24, height: 24 }}
            />
          </Button>
        ) : null}
        {comments.map((comment) => (
          <Comment key={comment?.id} comment={comment} styles={styles} />
        ))}
      </>
    );
  }
  return (
    <>
      <Text
        onPress={() => setSelected(!selected)}
        onLayout={(e) => setPos(e.nativeEvent.layout.y)}
        style={{
          ...styles.text,
          ...{ marginLeft: 16 },
          ...(selected ? underline.selected : {}),
        }}
      >
        &bull;{' '}
        <Text
          style={{ ...styles.text, ...(selected ? underline.selected : {}) }}
        >
          {block.text.slice(0, processedStyles[0].offset)}
        </Text>
        {processedStyles.map((style, index) => {
          return (
            <Text key={style.offset}>
              <Text
                style={{
                  ...styles.text,
                  ...style.style,
                  ...(selected ? underline.selected : {}),
                }}
              >
                {block.text.slice(style.offset, style.offset + style.length)}
              </Text>
              {index + 1 < processedStyles.length ? (
                <Text
                  style={{
                    ...styles.text,
                    ...(selected ? underline.selected : {}),
                  }}
                >
                  {block.text.slice(
                    style.offset + style.length,
                    processedStyles[index + 1].offset
                  )}
                </Text>
              ) : null}
            </Text>
          );
        })}
        <Text
          style={{ ...styles.text, ...(selected ? underline.selected : {}) }}
        >
          {block.text.slice(
            processedStyles[processedStyles.length - 1].offset +
              processedStyles[processedStyles.length - 1].length
          )}
        </Text>
      </Text>
      {selected ? (
        <Button
          style={{ position: 'absolute', right: 16, top: pos - 5 }}
          onPress={openComment}
        >
          <Image
            source={
              mode === 'dark'
                ? Theme.icons.white.addComment
                : Theme.icons.black.addComment
            }
            style={{ width: 24, height: 24 }}
          />
        </Button>
      ) : null}
      {comments.map((comment) => (
        <Comment key={comment?.id} comment={comment} styles={styles} />
      ))}
    </>
  );
}

export function CustomHeading({
  block,
  styles,
}: Pick<CustomTextParams, 'block' | 'styles'>): JSX.Element {
  return (
    <Text style={{ ...styles.header, fontFamily: Theme.fonts.fontFamilyBold }}>
      {block.text}
    </Text>
  );
}

interface ImageParams {
  data: {
    src: string;
    alt: string;
    width: string | number;
    height: string | number;
  };
  mode: 'light' | 'dark';
  type: 'questions' | 'notes';
  block: Blocks;
  noteId: string;
  styles: { text: TextStyle; header: TextStyle; textSmall: TextStyle };
}

export function CustomImage({
  data,
  mode,
  type,
  block,
  noteId,
  styles,
}: ImageParams): JSX.Element {
  const [selected, setSelected] = useState(false);
  const [pos, setPos] = useState(0);
  const allComments = useContext(CommentContext);
  const [comments, setComments] = useState<CommentContextType['comments']>([]);

  useEffect(() => {
    setComments(
      allComments.comments.filter(
        (comment) => comment?.key === block.key && comment?.noteType === type
      )
    );
  }, [block.key, type, allComments]);

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const openComment = () => {
    setSelected(false);
    navigation.push('CommentScreen', {
      key: block.key,
      noteId,
      commentType: CommentDataType.image,
      noteType: type,
      imageUri: data.src,
    });
  };

  return (
    <>
      <View
        onLayout={(e) => setPos(e.nativeEvent.layout.y)}
        style={{
          justifyContent: 'flex-start',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => setSelected(!selected)}
          style={[
            {
              marginLeft: 16,
              marginRight: 56,
              padding: 4,
              alignItems: 'center',
            },
            selected
              ? { borderColor: 'red', borderStyle: 'dashed', borderWidth: 1 }
              : {},
          ]}
        >
          <Image
            resizeMode="contain"
            style={{ minWidth: 200, minHeight: 200 }}
            source={{ uri: data.src }}
            accessibilityLabel={data.alt}
          />
        </TouchableWithoutFeedback>
      </View>
      {selected ? (
        <Button
          style={{ position: 'absolute', right: 16, top: pos - 5 }}
          onPress={openComment}
        >
          <Image
            source={
              mode === 'dark'
                ? Theme.icons.white.addComment
                : Theme.icons.black.addComment
            }
            style={{ width: 24, height: 24 }}
          />
        </Button>
      ) : null}
      {comments.map((comment) => (
        <Comment key={comment?.id} comment={comment} styles={styles} />
      ))}
    </>
  );
}

type HeaderImageParams = Pick<ImageParams, 'data'>;

export function HeaderImage({ data }: HeaderImageParams): JSX.Element {
  return (
    <Image
      resizeMode="contain"
      style={{ width: Dimensions.get('screen').width, minHeight: 100 }}
      source={{ uri: data.src }}
      accessibilityLabel={data.alt}
    />
  );
}

interface HyperLinkParams {
  block: Blocks;
  links: Array<{ text: string; offset: number; length: number; uri: string }>;
  styles: { text: TextStyle; header: TextStyle; textSmall: TextStyle };
  openVerseCallback: (
    youVersionUri: string | undefined,
    bibleGatewayUri: string
  ) => void;
  verses: VerseType;
  type: 'questions' | 'notes';
  date: string;
  mode: 'light' | 'dark';
  noteId: string;
}

export function HyperLink({
  block,
  links,
  styles,
  openVerseCallback,
  verses,
  type,
  date,
  mode,
  noteId,
}: HyperLinkParams): JSX.Element {
  const [show, setShow] = useState(false);
  const [passage, setPassage] = useState<HyperLinkParams['links'][0]>({
    text: '',
    offset: -1,
    length: -1,
    uri: '',
  });
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState(false);
  const allComments = useContext(CommentContext);
  const [comments, setComments] = useState<CommentContextType['comments']>([]);

  useEffect(() => {
    setComments(
      allComments.comments.filter(
        (comment) => comment?.key === block.key && comment?.noteType === type
      )
    );
  }, [block.key, type, allComments]);

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const openComment = () => {
    setSelected(false);
    if (show)
      navigation.push('CommentScreen', {
        key: block.key,
        noteId,
        commentType: CommentDataType.biblePassage,
        noteType: type,
        textSnippet: passage.text,
      });
    else
      navigation.push('CommentScreen', {
        key: block.key,
        noteId,
        commentType: CommentDataType.text,
        noteType: type,
        textSnippet: block.text,
      });
  };

  const handleClick = async (link: HyperLinkParams['links'][0]) => {
    if (link.uri.includes('biblegateway')) {
      setPassage(link);
      setShow(link.offset === passage.offset ? !show : true);
    } else {
      try {
        await Linking.openURL(link.uri);
      } catch (e) {
        console.debug(e);
      }
    }
  };

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
      '9': '\u2079',
    };

    const processed = content.replace(/[0123456789]/g, (num) => {
      return superscript[num];
    });

    return `${processed} `;
  };

  const renderEndOfBiblePassage = (
    index: number,
    length: number,
    data: any
  ): string => {
    if (index === length - 1 || (index === 0 && length <= 2)) {
      return '';
    }

    if (data.items[data.items.length - 1]?.text?.includes(':')) {
      return '\n';
    }

    return '\n \n';
  };

  const passageHeader = (text: string) => {
    return (
      <Text
        key={text}
        style={{
          ...styles.header,
          fontFamily: Theme.fonts.fontFamilyBold,
        }}
      >
        {text}
      </Text>
    );
  };

  const parseBibleJSON = (data: any, index: number, length: number) => {
    if (data?.attrs?.style === 's1') {
      return (
        <Text style={styles.header} key={index}>
          {data.items.map((item: any) => {
            if (item.text) {
              return passageHeader(item.text);
            }
            if (item?.attrs?.style === 'nd') {
              return item.items.map((subItem: any) => {
                if (subItem.text) {
                  return passageHeader(subItem.text);
                }
                return null;
              });
            }
            return null;
          })}
          {'\n'}
        </Text>
      );
    }
    if (data?.attrs.style === 'q1' || data?.attrs.style === 'q2') {
      return (
        <Text key={index} style={styles.text}>
          {data.items.map((item: any, dataIndex: number) => {
            if (item.attrs?.style === 'v') {
              return (
                <Text key={item.attrs?.number} style={styles.text}>
                  {replaceVerseNumbers(item.attrs?.number)}
                </Text>
              );
            }
            if (item.text) {
              if (
                data.items[dataIndex - 1] &&
                data.items[dataIndex - 1]?.attrs?.style === 'v'
              ) {
                return (
                  <Text key={item.text} style={styles.text}>
                    {item.text + (dataIndex === length - 1 ? '' : '\n')}
                  </Text>
                );
              }
              if (
                dataIndex === 0 &&
                data.items.length >= 2 &&
                data.items[1].text
              ) {
                return (
                  <Text key={item.text} style={styles.text}>
                    {(data.attrs.style === 'q2' ? '   ' : '') + item.text}
                  </Text>
                );
              }
              return (
                <Text key={item.text} style={styles.text}>
                  {(data.attrs.style === 'q2' ? '   ' : '') +
                    item.text +
                    (dataIndex === length - 1 ? '' : '\n')}
                </Text>
              );
            }
            if (item.items) {
              return (
                <Text key={index} style={styles.text}>
                  {item.items.map((item2: any) => {
                    return (
                      <Text key={item2.text} style={styles.text}>
                        {item2.text}
                      </Text>
                    );
                  })}
                </Text>
              );
            }
            return null;
          })}
        </Text>
      );
    }
    if (!data.items.length) {
      return null;
    }
    return (
      <Text key={index} style={styles.text}>
        {index === 0 ? '' : '   '}
        {data.items.map((item: any) => {
          if (item.attrs?.style === 'v') {
            return (
              <Text key={item.attrs?.number} style={styles.text}>
                {replaceVerseNumbers(item.attrs?.number)}
              </Text>
            );
          }
          if (item.text) {
            return (
              <Text key={item.text} style={styles.text}>
                {item.text}
              </Text>
            );
          }
          if (item.items) {
            return (
              <Text key={item.items[0].text} style={styles.text}>
                {item.items.map((item2: any) => {
                  return (
                    <Text key={item2.text} style={styles.text}>
                      {item2.text}
                    </Text>
                  );
                })}
              </Text>
            );
          }
          return null;
        })}
        {renderEndOfBiblePassage(index, length, data)}
      </Text>
    );
  };

  const renderBibleVerse = (reference: string) => {
    const testId = `${type}-${date}-${block.key}-${passage.offset}-${passage.length}`;
    const biblePassage = verses?.find((item) => item?.id === testId);

    let passageJSON = null;

    if (biblePassage?.content) {
      try {
        passageJSON = JSON.parse(biblePassage?.content);
      } catch {
        passageJSON = null;
      }
    }

    return (
      <View
        style={{
          backgroundColor: 'transparent',
          marginHorizontal: 16,
          borderColor: Theme.colors.grey3,
          borderRadius: 4,
          borderWidth: 1,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            backgroundColor: Theme.colors.grey3,
            paddingVertical: 8,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={[styles.textSmall, { color: 'white' }]}>
            {reference} (NIV)
          </Text>
          <TouchableOpacity
            style={{ marginRight: 8 }}
            onPress={() =>
              openVerseCallback(biblePassage?.youVersionUri, passage.uri)
            }
          >
            <Image
              source={Theme.icons.white.newWindow}
              style={{ width: 16, height: 16 }}
            />
          </TouchableOpacity>
        </View>
        {!passageJSON ? (
          <Text style={[styles.text, { paddingVertical: 12 }]}>
            Oops. Something went wrong. Please try opening this passage in the
            browser.
          </Text>
        ) : (
          <Text style={{ padding: 12 }}>
            {passageJSON.map((item: any, index: number) => {
              return parseBibleJSON(item, index, passageJSON.length);
            })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <>
      <Text
        style={{ ...styles.text, marginVertical: 12 }}
        onLayout={(e) => setPos(e.nativeEvent.layout.y)}
        onPress={() => setSelected(!selected)}
      >
        <Text
          style={{ ...styles.text, ...(selected ? underline.selected : {}) }}
        >
          {block.text.slice(0, links[0].offset)}
        </Text>
        {links.map((link, index) => {
          return (
            <Text key={link.text}>
              <Text
                onPress={() => handleClick(link)}
                style={{
                  ...styles.text,
                  ...{
                    textDecorationLine: 'underline',
                    textDecorationColor:
                      passage.offset === link.offset && show
                        ? Theme.colors.red
                        : undefined,
                    textDecorationStyle:
                      passage.offset === link.offset && show
                        ? 'dotted'
                        : undefined,
                  },
                  ...(selected ? underline.selected : {}),
                }}
              >
                {block.text.slice(link.offset, link.offset + link.length)}
              </Text>
              {index + 1 < links.length ? (
                <Text
                  style={{
                    ...styles.text,
                    ...(selected ? underline.selected : {}),
                  }}
                >
                  {block.text.slice(
                    link.offset + link.length,
                    links[index + 1].offset
                  )}
                </Text>
              ) : null}
            </Text>
          );
        })}
        <Text
          style={{ ...styles.text, ...(selected ? underline.selected : {}) }}
        >
          {block.text.slice(
            links[links.length - 1].offset + links[links.length - 1].length
          )}
        </Text>
      </Text>
      {show
        ? renderBibleVerse(
            block.text.slice(passage.offset, passage.offset + passage.length)
          )
        : null}
      {selected || show ? (
        <Button
          onPress={openComment}
          style={{ position: 'absolute', right: 16, top: pos - 5 }}
        >
          <Image
            source={
              mode === 'dark'
                ? Theme.icons.white.addComment
                : Theme.icons.black.addComment
            }
            style={{ width: 24, height: 24 }}
          />
        </Button>
      ) : null}
      {comments.map((comment) => (
        <Comment key={comment?.id} comment={comment} styles={styles} />
      ))}
    </>
  );
}
