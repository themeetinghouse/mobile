import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import FallbackImage, {
  AnimatedFallbackImage,
  FallbackImageBackground,
} from '../FallbackImage';

const uri = 'not-a-real-url.png';
const catchUri = 'fallback-uri';

const components = [
  <FallbackImage key={0} uri={uri} catchUri={catchUri} />,
  <AnimatedFallbackImage key={1} uri={uri} catchUri={catchUri} />,
  <FallbackImageBackground
    key={2}
    uri={uri}
    catchUri={catchUri}
    style={{ width: 100, height: 100 }}
  />,
];

describe('FallbackImage components', () => {
  components.forEach((component) => {
    test('expect uri, then catchUri on error', () => {
      const { queryByTestId } = render(component);

      expect(queryByTestId('fallback-image').props.source.uri).toEqual(uri);
      queryByTestId('fallback-image').props.onError();
      expect(queryByTestId('fallback-image').props.source.uri).toEqual(
        catchUri
      );
    });
  });
});

describe('FallbackImageBackground component', () => {
  test('can accept children', () => {
    const { toJSON } = render(
      <FallbackImageBackground
        key={2}
        uri={uri}
        catchUri={catchUri}
        style={{ width: 100, height: 100 }}
      >
        <Text>Test</Text>
      </FallbackImageBackground>
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
