import React from 'react';
import { Share, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { render, fireEvent } from '@testing-library/react-native';
import NeedsSignUpModal from '../modals/NeedsSignUpModal';
import ShareModal from '../modals/Share';

const mockPush = jest.fn();
const mockGoBack = jest.fn();
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      push: mockPush,
      goBack: mockGoBack,
    }),
  };
});

beforeEach(() => {
  mockPush.mockReset();
  mockGoBack.mockReset();
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    insets: { top: 0, bottom: 0, left: 0, right: 0 },
  }),
}));

describe('share modal', () => {
  const cb = jest.fn();

  const message = 'this is a message';
  const link = 'https://themeetinghouse.com';

  test('clipboard', async () => {
    jest.spyOn(Clipboard, 'setStringAsync').mockReturnValue();
    const { queryByText } = render(
      <ShareModal link={link} message={message} closeCallback={cb} />
    );

    expect(queryByText('Copy Link')).toBeTruthy();

    const copyButton = queryByText('Copy Link');

    fireEvent.press(copyButton);

    expect(queryByText('Copied')).toBeTruthy();
    expect(Clipboard.setStringAsync).toHaveBeenCalledWith(link);
  });

  test('twitter', () => {
    const openURLMock = jest.fn();
    jest.spyOn(Linking, 'openURL').mockImplementation(openURLMock);

    const { queryByTestId } = render(
      <ShareModal link={link} message={message} closeCallback={cb} />
    );

    const btn = queryByTestId('twitter');

    fireEvent.press(btn);

    expect(openURLMock).toHaveBeenCalledWith(
      `https://twitter.com/intent/tweet?text=${message}&url=${link}&via=themeetinghouse`
    );
    jest.spyOn(Linking, 'openURL').mockRestore();
  });

  test('share, ios', () => {
    Share.share = jest.fn();
    Platform.OS = 'ios';

    const { queryByTestId } = render(
      <ShareModal link={link} message={message} closeCallback={cb} />
    );

    const btn = queryByTestId('share');

    fireEvent.press(btn);

    expect(Share.share).toHaveBeenCalledWith({
      url: link,
      message,
    });
  });

  test('share, android', () => {
    Share.share = jest.fn();
    Platform.OS = 'android';

    const { queryByTestId } = render(
      <ShareModal link={link} message={message} closeCallback={cb} />
    );

    const btn = queryByTestId('share');

    fireEvent.press(btn);

    expect(Share.share).toHaveBeenCalledWith({ message: link, title: message });
  });
});

describe('needs sign up to use notes modal', () => {
  test('initState true, create account', () => {
    const { getByTestId, queryByText } = render(<NeedsSignUpModal initState />);

    expect(getByTestId('modal').props.visible).toBeTruthy();

    const createAccount = queryByText('Create an account');

    fireEvent.press(createAccount);
    expect(mockPush).toHaveBeenCalledWith('Auth', { screen: 'SignUpScreen' });

    expect(getByTestId('modal').props.visible).toBeFalsy();
  });

  test('initState true, go back', () => {
    const { getByTestId, queryByText } = render(<NeedsSignUpModal initState />);

    expect(getByTestId('modal').props.visible).toBeTruthy();

    const goBack = queryByText('Go back');

    fireEvent.press(goBack);
    expect(mockGoBack).toHaveBeenCalled();

    expect(getByTestId('modal').props.visible).toBeFalsy();
  });

  test('initState false, control state from parent', () => {
    let state = false;

    const { getByTestId, rerender } = render(
      <NeedsSignUpModal initState={state} />
    );

    expect(getByTestId('modal').props.visible).toBeFalsy();

    state = true;

    rerender(<NeedsSignUpModal initState={state} />);

    expect(getByTestId('modal').props.visible).toBeTruthy();
  });
});
