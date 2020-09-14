import React, { useState } from 'react';
import { Image, ImageStyle } from 'react-native';

interface Params {
    uri: string;
    catchUri: string;
    style?: ImageStyle
}

export default function Img({ uri, catchUri, style }: Params): JSX.Element {

    const [source, setSource] = useState(uri);

    return <Image source={{ uri: source }} style={style} onError={() => setSource(catchUri)} />
}
