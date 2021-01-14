import React, { useState } from 'react';
import { Image, View, StyleSheet, Dimensions } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { InstagramData } from '../../services/Instagram';

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

  if (validImage && image?.thumbnails) {
    return (
      <TouchableHighlight
        accessibilityRole="imagebutton"
        style={style.imageContainer}
        key={image?.id}
        onPress={() => Linking.openURL(`https://instagram.com/p/${image?.id}`)}
      >
        <Image
          onError={() => setValidImage(false)}
          style={style.image}
          source={{ uri: image?.thumbnails[3]?.src ?? '' }}
          accessibilityLabel={image?.altText ?? 'tap to view on Instagram'}
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
      {images?.map((image) => {
        return <InstagramImage image={image} key={image?.id} />;
      })}
    </View>
  );
}
