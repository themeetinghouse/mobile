import React, { useState } from 'react';
import { Image } from 'react-native';
import { Speaker } from '../../services/API';
import { Theme } from '../../Theme.style';
import CachedImage from '../CachedImage';

type TeacherListPictureProps = {
  item: Speaker;
};

export default function TeacherListPicture(
  props: TeacherListPictureProps
): JSX.Element {
  const { item } = props;
  const [unhide, setUnhide] = useState(true);
  return (
    <>
      {unhide ? (
        <Image
          style={{ width: 30, height: 30 }}
          source={Theme.icons.white.user}
        />
      ) : null}
      <CachedImage
        style={{
          position: 'absolute',
          top: -1,
          left: -1,
          width: 96,
          height: 96,
          borderRadius: 96,
          overflow: 'hidden',
        }}
        url={item.image ?? ''}
        onError={() => setUnhide(true)}
        onLoadEnd={() => setUnhide(false)}
        cacheKey={item?.id}
      />
    </>
  );
}
