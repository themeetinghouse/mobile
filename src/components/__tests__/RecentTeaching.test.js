import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RecentTeaching from '../home/RecentTeaching';

const mockTeaching = [
  {
    Youtube: {
      snippet: {
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/QzSrQpC8A6A/default.jpg',
          },
          high: {
            url: 'https://i.ytimg.com/vi/QzSrQpC8A6A/hqdefault.jpg',
          },
          maxres: {
            url: 'https://i.ytimg.com/vi/QzSrQpC8A6A/maxresdefault.jpg',
          },
          medium: {
            url: 'https://i.ytimg.com/vi/QzSrQpC8A6A/mqdefault.jpg',
          },
          standard: {
            url: 'https://i.ytimg.com/vi/QzSrQpC8A6A/sddefault.jpg',
          },
        },
      },
    },
    YoutubeIdent: 'QzSrQpC8A6A',
    audioURL:
      'https://media.themeetinghouse.com/podcast/audio/2020/2020-08-30-1246-sermon.mp3',
    description:
      'In John 8, Jesus confronts the systems we can rely on for security. Instead Jesus invites us into real security in him and in community - one of the gospel promises of a new way of relating to God and each other.',
    episodeNumber: 38,
    episodeTitle: 'Real Security',
    id: 'QzSrQpC8A6A',
    length: '29',
    notesURL: 'https://www.themeetinghouse.com/notes/2020-08-30',
    publishedDate: '2020-08-30',
    series: {
      id: 'Jesus by John',
      title: 'Jesus by John',
    },
    seriesTitle: 'Jesus by John',
    speakers: {
      items: [
        {
          speaker: {
            id: 'Lisa Goetze',
          },
        },
      ],
    },
    videoTypes: 'adult-sunday',
    videoURL:
      'https://media.themeetinghouse.com/vpodcast/2020/2020-08-30-1246-video.mp4',
    viewCount: '393',
  },
  {
    Youtube: {
      snippet: {
        thumbnails: {
          default: {
            url: 'https://i.ytimg.com/vi/V5An4R0F1BY/default.jpg',
          },
          high: {
            url: 'https://i.ytimg.com/vi/V5An4R0F1BY/hqdefault.jpg',
          },
          maxres: {
            url: 'https://i.ytimg.com/vi/V5An4R0F1BY/maxresdefault.jpg',
          },
          medium: {
            url: 'https://i.ytimg.com/vi/V5An4R0F1BY/mqdefault.jpg',
          },
          standard: {
            url: 'https://i.ytimg.com/vi/V5An4R0F1BY/sddefault.jpg',
          },
        },
      },
    },
    YoutubeIdent: 'V5An4R0F1BY',
    audioURL:
      'https://media.themeetinghouse.com/podcast/audio/2020/2020-12-13-1261-sermon.mp3',
    description:
      'Tapping into joy as a way of living generously helps us and allows us to extend that to others, especially when Christmas can be a hard season.',
    episodeNumber: 2,
    episodeTitle: 'Comedy & A Posture of Generosity',
    id: 'V5An4R0F1BY',
    length: '42',
    notesURL: 'https://www.themeetinghouse.com/notes/2020-12-13',
    publishedDate: '2020-12-13',
    series: {
      id: 'Christmas in 3 Acts',
      title: 'Christmas in 3 Acts',
    },
    seriesTitle: 'Christmas in 3 Acts',
    speakers: {
      items: [
        {
          speaker: {
            id: 'Danielle Strickland',
          },
        },
      ],
    },
    videoTypes: 'adult-sunday',
    videoURL:
      'https://media.themeetinghouse.com/vpodcast/2020/2020-12-13-1261-video.mp4',
    viewCount: '511',
  },
];

const mockNotes = [
  {
    createdAt: '2020-09-06T05:38:19.616Z',
    episodeDescription:
      'A message to all Pastors, Overseers, Elders, Leaders, and Disciples of Jesus about how to lead and how to follow.',
    episodeNumber: 39,
    id: '2020-09-06',
    pdf: 'http://media.themeetinghouse.com/podcast/handouts/2020-09-06-1247-notes.pdf',
    seriesId: 'Jesus by John',
    tags: [],
    title: 'Gateway Leadership',
    topics: null,
    updatedAt: '2020-09-13T01:32:57.295Z',
  },
  {
    createdAt: '2020-12-13T00:47:50.867Z',
    episodeDescription:
      'Tapping into joy as a way of living generously helps us and allows us to extend that to others, especially when Christmas can be a hard season.',
    episodeNumber: 2,
    id: '2020-12-13',
    pdf: 'http://media.themeetinghouse.com/podcast/handouts/2020-12-13-1261-notes.pdf',
    seriesId: 'Christmas in 3 Acts',
    tags: [],
    title: 'Comedy & A Posture of Generosity',
    topics: null,
    updatedAt: '2020-12-13T01:24:50.455Z',
  },
  {
    createdAt: '2020-12-26T17:02:13.357Z',
    episodeDescription:
      "As Jesus people, we aren't the ones with all the answers - we're the ones with hope. We partner, wait, labour, and celebrate with the One who doesn't grow tired or weary as He ushers in his kingdom.",
    episodeNumber: 1,
    id: '2020-12-27',
    pdf: 'http://media.themeetinghouse.com/podcast/handouts/2020-12-27-1263-notes.pdf',
    seriesId: '000',
    tags: [],
    title: 'Tired Feet. Hopeful Hearts.',
    topics: null,
    updatedAt: '2020-12-27T14:19:01.046Z',
  },
  {
    createdAt: '2020-12-19T20:19:27.356Z',
    episodeDescription:
      'The Christmas story as fairytale, full of imagery and dramatic action, draws us into the larger narrative of who God is, into a battle being won in beautiful and unexpected ways. ',
    episodeNumber: 3,
    id: '2020-12-20',
    pdf: 'http://media.themeetinghouse.com/podcast/handouts/2020-12-20-1262-notes.pdf',
    seriesId: 'Christmas in 3 Acts',
    tags: [],
    title: 'Fairytale & A Posture of Mission',
    topics: null,
    updatedAt: '2020-12-19T20:53:21.692Z',
  },
];

const mockNavigate = jest.fn();
const mockPush = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
      push: mockPush,
    }),
  };
});

afterEach(() => {
  mockNavigate.mockClear();
  mockPush.mockClear();
});

describe('Recent Teaching component on Home Screen', () => {
  // Regular Sunday
  test('On Sunday Sept 6, expect notes from Sunday Sept 6', () => {
    const { queryByTestId } = render(
      <RecentTeaching teaching={mockTeaching[0]} note={mockNotes[0]} />
    );

    expect(queryByTestId('teaching-notes')).toBeTruthy();
    expect(queryByTestId('teaching-video')).toBeFalsy();
    expect(queryByTestId('notes-button')).toBeTruthy();
  });

  // During middle of week
  test('On Wednesday Dec 16, expect video from Sunday Dec 13', () => {
    const { queryByTestId } = render(
      <RecentTeaching teaching={mockTeaching[1]} note={mockNotes[1]} />
    );

    expect(queryByTestId('teaching-notes')).toBeFalsy();
    expect(queryByTestId('teaching-video')).toBeTruthy();
    expect(queryByTestId('notes-button')).toBeTruthy();
  });

  // Sunday after Christmas Eve
  test('On Sunday Dec 27, expect notes from Dec 27 (not video from Christmas Eve)', () => {
    const { queryByTestId } = render(
      <RecentTeaching teaching={mockTeaching[2]} note={mockNotes[2]} />
    );

    expect(queryByTestId('teaching-notes')).toBeTruthy();
    expect(queryByTestId('teaching-video')).toBeFalsy();
    expect(queryByTestId('notes-button')).toBeTruthy();
  });

  // One day after Christmas Eve
  test('On Friday Dec 25, expect video from Christmas Eve, but no notes button', () => {
    const { queryByTestId } = render(
      <RecentTeaching teaching={mockTeaching[3]} note={mockNotes[3]} />
    );

    expect(queryByTestId('teaching-notes')).toBeFalsy();
    expect(queryByTestId('teaching-video')).toBeTruthy();
    expect(queryByTestId('notes-button')).toBeFalsy();
  });

  test('Toggle teaching description expander (video available)', () => {
    const { queryByTestId } = render(
      <RecentTeaching teaching={mockTeaching[3]} note={mockNotes[3]} />
    );

    const descriptionText = queryByTestId('description');
    expect(descriptionText.props.numberOfLines).toEqual(2);
    fireEvent.press(descriptionText);
    expect(descriptionText.props.numberOfLines).toBeUndefined();
    fireEvent.press(descriptionText);
    expect(descriptionText.props.numberOfLines).toEqual(2);
  });

  test('Toggle teaching description expander (notes only)', () => {
    const { queryByTestId } = render(
      <RecentTeaching teaching={mockTeaching[2]} note={mockNotes[2]} />
    );

    const descriptionText = queryByTestId('description');
    expect(descriptionText.props.numberOfLines).toEqual(2);
    fireEvent.press(descriptionText);
    expect(descriptionText.props.numberOfLines).toBeUndefined();
    fireEvent.press(descriptionText);
    expect(descriptionText.props.numberOfLines).toEqual(2);
  });

  test('Snapshot using data from Sunday Dec 27', () => {
    const { toJSON } = render(
      <RecentTeaching teaching={mockTeaching[2]} note={mockNotes[2]} />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  test('Snapshot using null data', () => {
    const { toJSON, queryByTestId } = render(
      <RecentTeaching teaching={null} note={null} />
    );

    // No content should render
    expect(queryByTestId('teaching-notes')).toBeFalsy();
    expect(queryByTestId('teaching-video')).toBeFalsy();
    expect(queryByTestId('notes-button')).toBeFalsy();
    expect(queryByTestId('description')).toBeFalsy();

    expect(toJSON()).toMatchSnapshot();
  });

  test('Navigate (notes only)', () => {
    const { queryByTestId } = render(
      <RecentTeaching teaching={mockTeaching[0]} note={mockNotes[0]} />
    );
    const goToNotesBtn = queryByTestId('notes-button').findByProps({
      label: 'Notes',
    });

    fireEvent.press(goToNotesBtn);
    expect(mockNavigate).toBeCalledTimes(1);
  });

  test('Navigate (video available)', () => {
    const { queryByTestId } = render(
      <RecentTeaching teaching={mockTeaching[1]} note={mockNotes[1]} />
    );

    const goToTeachingBtn = queryByTestId('go-to-teaching');
    const goToTeacherBtn = queryByTestId('go-to-teacher');
    const goToNotesBtn = queryByTestId('notes-button').findByProps({
      label: 'Notes',
    });

    fireEvent.press(goToTeachingBtn);
    expect(mockNavigate).toBeCalledTimes(2);
    mockNavigate.mockClear();

    fireEvent.press(goToTeacherBtn);
    expect(mockNavigate).toBeCalledTimes(1);

    fireEvent.press(goToNotesBtn);
    expect(mockPush).toBeCalledTimes(1);
  });
});
