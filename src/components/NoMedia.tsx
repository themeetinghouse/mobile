import React, { useEffect, useContext } from 'react';
import MediaContext from '../contexts/MediaContext';

interface Props {
  children: JSX.Element;
}

export default function NoMedia({ children }: Props): JSX.Element {
  const media = useContext(MediaContext);

  const { audio } = media.media;
  const { setMedia } = media;

  useEffect(() => {
    async function closeMedia() {
      try {
        await audio?.sound.unloadAsync();
      } finally {
        setMedia({
          video: null,
          videoTime: 0,
          audio: null,
          playerType: 'none',
          playing: false,
          series: '',
          episode: '',
        });
      }
    }
    closeMedia();
  }, [audio, setMedia]);

  return <>{children}</>;
}
