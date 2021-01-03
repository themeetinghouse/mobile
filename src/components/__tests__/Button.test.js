import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import AllButton from '../buttons/AllButton';
import IconButton from '../buttons/IconButton';
import TeachingButton from '../buttons/TeachingButton';
import WhiteButton, { WhiteButtonAsync } from '../buttons/WhiteButton';

describe('Snapshot and functional tests for button components', () => {
  test('All button, default props', () => {
    const mockPress = jest.fn();

    const { getByText, toJSON } = render(
      <AllButton handlePress={mockPress}>Test</AllButton>
    );

    const button = getByText('Test');
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockPress).toBeCalledTimes(2);

    expect(toJSON()).toMatchSnapshot();
  });

  test('Icon button, default props', () => {
    const mockPress = jest.fn();

    const { getByText, toJSON } = render(
      <IconButton onPress={mockPress} label="Testing" />
    );

    const button = getByText('Testing');
    fireEvent.press(button);

    expect(mockPress).toBeCalledTimes(1);

    expect(toJSON()).toMatchSnapshot();
  });

  test('Icon button, test rightArrow prop', () => {
    const mockPress = jest.fn();

    const { toJSON } = render(<IconButton onPress={mockPress} rightArrow />);

    expect(toJSON()).toMatchSnapshot();
  });

  test('Teaching button, active', () => {
    const mockPress = jest.fn();

    const { toJSON, getByText } = render(
      <TeachingButton onPress={mockPress} active label="TMH" />
    );

    const button = getByText('TMH');
    fireEvent.press(button);

    expect(mockPress).toBeCalledTimes(1);

    expect(toJSON()).toMatchSnapshot();
  });

  test('Teaching button, inactive', () => {
    const mockPress = jest.fn();

    const { toJSON, getByText } = render(
      <TeachingButton onPress={mockPress} active={false} label="TMH" />
    );

    const button = getByText('TMH');
    for (let i = 0; i < 50; i++) {
      fireEvent.press(button);
    }

    expect(mockPress).toBeCalledTimes(50);

    expect(toJSON()).toMatchSnapshot();
  });

  test('White button, outlined', () => {
    const mockPress = jest.fn();

    const { toJSON, getByText } = render(
      <WhiteButton onPress={mockPress} label="TMH" outlined />
    );

    const button = getByText('TMH');
    for (let i = 0; i < 12; i++) {
      fireEvent.press(button);
    }

    expect(mockPress).toBeCalledTimes(12);

    expect(toJSON()).toMatchSnapshot();
  });

  test('White button, solidBlack', () => {
    const { toJSON, getByText } = render(
      <WhiteButton label="TMH" solidBlack />
    );

    // button label, uppercase prop is false
    expect(getByText('TMH').props.uppercase).toBeFalsy();

    expect(toJSON()).toMatchSnapshot();
  });

  test('Async white button, outlined, loading', () => {
    const mockPress = jest.fn();

    const { toJSON, queryByText } = render(
      <WhiteButtonAsync onPress={mockPress} label="TMH" outlined isLoading />
    );

    expect(queryByText('TMH')).toBeFalsy();
    expect(mockPress).toBeCalledTimes(0);

    expect(toJSON()).toMatchSnapshot();
  });

  test('Async white button, solidBlack, not loading', () => {
    const { toJSON, getByText } = render(
      <WhiteButtonAsync label="TMH" solidBlack isLoading={false} />
    );

    // button label, uppercase prop is false
    expect(getByText('TMH').props.uppercase).toBeFalsy();

    expect(toJSON()).toMatchSnapshot();
  });
});
