import React from 'react';
import { View, StyleSheet } from 'react-native';
import Theme from '../../../src/Theme.style';
import { useContentContext } from '../../../src/contexts/ContentScreenContext/ContentScreenContext';
import { ContentItemType } from './ContentTypes';
import TMHImage from './Image/TMHImage';
import TMHTextBody from './Text/TMHTextBody';
import TMHTextHeader from './Text/TMHTextHeader';
import TMHLogo from './Logo/TMHLogo';
import CustomPlaylistCarousel from './VideoCarousels/CustomPlaylistCarousel';
import TMHVideo from './Video/TMHVideo';
import TMHButton from './Button/TMHButton';
import TMHLinkItem from './Button/TMHLinkItem';

const styles = StyleSheet.create({
  divider: {
    height: 15,
    backgroundColor: Theme.colors.background,
    padding: 0,
  },
});
export default function RenderRouter({ item }: { item: ContentItemType }) {
  const { state } = useContentContext();
  const { groups } = state;
  switch (item.type) {
    case 'header':
      return <TMHTextHeader item={item} />;
    case 'body':
      return <TMHTextBody item={item} />;
    case 'button':
      return <TMHButton item={item} />;
    case 'logo':
      return <TMHLogo item={item} />;
    case 'image': {
      return <TMHImage item={item} />;
    }
    case 'custom-playlist':
      return <CustomPlaylistCarousel item={item} />;
    case 'video':
      return <TMHVideo item={item} />;
    case 'link-item': {
      if (item.groups?.length) {
        const findGroup = groups.find(
          (group) => group === item?.groups?.find((group2) => group2 === group)
        );
        if (findGroup) {
          <TMHLinkItem hideBorder={item.hideBorder} item={item} />;
        } else return null;
      }
      return <TMHLinkItem hideBorder={item.hideBorder} item={item} />;
    }
    case 'divider':
      return <View style={styles.divider} />;
    case 'spacing':
      return <View style={{ height: item.size }} />;
    default:
      return null;
  }
}
