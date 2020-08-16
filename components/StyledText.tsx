import React from 'react';
import { Text } from 'react-native';

interface Props {
  style: any;
  [key: string]: any;
}

export function MonoText(props: Props): JSX.Element {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />
  );
}
