import React, { useState } from 'react';
import { Image } from 'react-native';
import { Theme } from '../../Theme.style';

export default function TeacherListPicture(item: any): JSX.Element {
  const [unhide, setUnhide] = useState(true);
  return (
    <>
      {unhide ? (
        <Image
          style={{ width: 30, height: 30 }}
          source={Theme.icons.white.user}
        />
      ) : null}
      <Image
        style={{
          position: 'absolute',
          top: -1,
          left: -1,
          width: 96,
          height: 96,
          borderRadius: 96,
          overflow: 'hidden',
        }}
        source={{ uri: item.item.image }}
        onError={() => setUnhide(true)}
        onLoadEnd={() => setUnhide(false)}
      />
    </>
  );
}
