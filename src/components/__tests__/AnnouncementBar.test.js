import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import AnnouncementBar from '../home/AnnouncementBar';

const mockPush = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      push: mockPush,
    }),
  };
});

describe('announcement bar', () => {
  test('children render', () => {
    const { queryByText } = render(<AnnouncementBar message="test" />);
    expect(queryByText('test')).toBeTruthy();
  });

  test('navigate', () => {
    const { queryByText } = render(<AnnouncementBar message="test" />);
    const touchable = queryByText('test');
    fireEvent.press(touchable);
    expect(mockPush).toBeCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('LiveStreamScreen');
  });
});
