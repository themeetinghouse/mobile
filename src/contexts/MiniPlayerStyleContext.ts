import { createContext } from 'react';
import { ViewStyle } from 'react-native';

type MiniPlayerStyleContext = {
  display: ViewStyle['display'];
  setDisplay: (data: MiniPlayerStyleContext['display']) => void;
};

const MiniPlayerStyleContext = createContext<MiniPlayerStyleContext>({
  display: 'flex',
  setDisplay: () => null,
});

export default MiniPlayerStyleContext;
