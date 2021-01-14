import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import SearchBar from '../SearchBar';

const mockHandler = jest.fn();

describe('search bar', () => {
  test('handleTextChanged, cancel button', () => {
    const { queryByPlaceholderText, queryByTestId } = render(
      <SearchBar
        style={{}}
        searchText="test"
        placeholderLabel="placeholder"
        handleTextChanged={(e) => mockHandler(e)}
      />
    );

    expect(queryByPlaceholderText('placeholder')).toBeTruthy();

    const input = queryByPlaceholderText('placeholder');

    fireEvent.changeText(input, 'jesus is a');
    fireEvent.changeText(input, 'jesus is a cool dude');

    expect(mockHandler).toHaveBeenCalledTimes(2);
    expect(mockHandler).toHaveBeenCalledWith('jesus is a');
    expect(mockHandler).toHaveBeenLastCalledWith('jesus is a cool dude');

    expect(queryByTestId('close-search')).toBeTruthy();
    const button = queryByTestId('close-search');

    fireEvent.press(button);
    expect(mockHandler).toHaveBeenLastCalledWith('');
  });

  test('cancel button not rendered if no searchText', () => {
    const { queryByTestId } = render(
      <SearchBar
        style={{}}
        searchText=""
        placeholderLabel="placeholder"
        handleTextChanged={(e) => mockHandler(e)}
      />
    );

    expect(queryByTestId('close-search')).toBeFalsy();
  });
});
