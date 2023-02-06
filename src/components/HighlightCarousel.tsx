import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { MainStackParamList } from 'src/navigation/AppNavigator';
import { Video } from 'src/services/API';
import useDebounce from '../../src/hooks/useDebounce';
import SermonsService from '../services/SermonsService';
import GenericCarousel from './GenericCarousel';

type HighlightCarouselProps = {
  setLoaded: (value: boolean) => void;
};

export default function HighlightCarousel(
  props: HighlightCarouselProps
): JSX.Element {
  const { setLoaded } = props;
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const [highlights, setHighlights] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextToken, setNextToken] = useState<undefined | string>(undefined);
  const { debounce } = useDebounce();
  const loadHighlights = async () => {
    try {
      const result = await SermonsService.loadHighlightsList(5, nextToken);
      const items = (result.items as Video[]) ?? [];
      setHighlights((prev) => [...prev, ...items]);
      setNextToken(result.nextToken ?? undefined);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (item: any, index: number) => {
    navigation.push('HighlightScreen', {
      highlights: highlights.slice(index),
      nextToken,
      fromSeries: false,
    });
  };

  useEffect(() => {
    loadHighlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoaded(!loading);
  }, [loading, setLoaded]);
  return (
    <GenericCarousel
      handleNavigation={(item, index) =>
        debounce(() => handleNavigation(item, index ?? -1))
      }
      loadMore={loadHighlights}
      data={{
        items: highlights,
        nextToken: nextToken ?? '',
        loading,
      }}
      header="Highlights"
      subHeader="Short snippets of teaching"
    />
  );
}
