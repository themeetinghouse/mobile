import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import SermonsService from '../services/SermonsService';
import loadSomeAsync from '../utils/loading';
import GenericCarousel from './GenericCarousel';

export default function HighlightCarousel(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [highlights, setHighlights] = useState({
    items: [],
    loading: true,
    nextToken: undefined,
  });

  const loadHighlights = async () => {
    loadSomeAsync(
      SermonsService.loadHighlightsList,
      highlights,
      setHighlights,
      5
    );
  };

  const handleNavigation = (item: any, index: number) => {
    navigation.push('HighlightScreen', {
      highlights: highlights.items.slice(index),
      nextToken: highlights.nextToken,
      fromSeries: false,
    });
  };

  useEffect(() => {
    loadHighlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <GenericCarousel
      handleNavigation={(item, index) => handleNavigation(item, index ?? -1)}
      loadMore={loadHighlights}
      data={{
        items: highlights.items,
        nextToken: highlights?.nextToken ?? '',
        loading: highlights.loading,
      }}
      header="Highlights"
      subHeader="Short snippets of teaching"
    />
  );
}
