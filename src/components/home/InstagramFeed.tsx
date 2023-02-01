import React, { useState } from 'react';
import { Image, View, StyleSheet, Dimensions } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { InstagramData } from '../../services/Instagram';
import CachedImage from '../CachedImage';

const screenWidth = Dimensions.get('window').width;

const style = StyleSheet.create({
  image: {
    width: 0.44 * screenWidth,
    height: 0.44 * screenWidth,
  },
  imageContainer: {
    width: 0.5 * screenWidth,
    height: 0.5 * screenWidth,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function InstagramImage({
  image,
}: {
  image: NonNullable<InstagramData>[0];
}): JSX.Element | null {
  const [validImage, setValidImage] = useState(true);
  if (validImage && image) {
    return (
      <TouchableHighlight
        accessibilityRole="imagebutton"
        accessibilityLabel="View in instagram"
        accessibilityHint={`Navigate to the instagram post ${image.caption}`}
        style={style.imageContainer}
        onPress={() => Linking.openURL(image.permalink ?? '')}
      >
        <CachedImage
          onError={() => {
            setValidImage(false);
          }}
          style={style.image}
          cacheKey={image?.id ?? encodeURI(image.media_url ?? '')}
          url={encodeURI(image.media_url ?? '')}
        />
      </TouchableHighlight>
    );
  }

  return null;
}

interface Params {
  images: InstagramData;
}

export default function InstagramFeed({ images }: Params): JSX.Element {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {images?.slice(0, 8).map((image) => {
        return <InstagramImage image={image} key={image?.id} />;
      })}
    </View>
  );
}
