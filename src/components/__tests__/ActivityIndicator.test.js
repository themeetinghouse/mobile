import React from 'react';
import { render } from '@testing-library/react-native';

import ActivityIndicator from '../ActivityIndicator';

test('Active indicator', () => {
  const { toJSON } = render(<ActivityIndicator animating />);

  expect(toJSON()).toMatchSnapshot();
});

test('Inactive indicator', () => {
  const { toJSON } = render(<ActivityIndicator animating={false} />);

  expect(toJSON()).toMatchSnapshot();
});
