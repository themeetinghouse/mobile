import { Button, Text, Thumbnail, View } from 'native-base';
import React, { useContext, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Image } from 'react-native';
import MediaContext from '../contexts/MediaContext';
import { Theme } from '../Theme.style';
import YoutubePlayer from 'react-native-youtube-iframe';

const styles = StyleSheet.create({
    containerStyle: {
        position: 'absolute',
        height: 56,
        width: '100%',
        bottom: 90,
        backgroundColor: Theme.colors.black,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: 12,
        lineHeight: 18,
        color: 'white'
    },
    subTitle: {
        fontFamily: Theme.fonts.fontFamilyRegular,
        fontSize: 12,
        lineHeight: 18,
        color: Theme.colors.grey5
    }
})

export default function MiniPlayer(): JSX.Element {

    const media = useContext(MediaContext);

    const [play, setPlay] = useState(true);
    const [videoReady, setVideoReady] = useState(false);
    const playerRef = useRef<any>();

    const closeVideo = () => {
        media.setMedia({ type: 'none', audio: null, video: null })
    }

    const closeAudio = async () => {
        console.log('close')
    }

    const test = async () => {
        const test = await playerRef.current.getCurrentTime();
        console.log(test)

    }

    const test2 = async () => {
        playerRef.current.seekTo(90, true);
    }

    switch (media.media.type) {
        case 'audio':
            return <View></View>
        case 'video':
            return (
                <View style={styles.containerStyle}>
                    <View pointerEvents="none">
                        <YoutubePlayer ref={playerRef} onReady={()=>setVideoReady(true)} forceAndroidAutoplay height={videoReady && play ? 56 : 0} width={videoReady && play ? 100 : 0} videoId="VO9GVLfMtXQ" play={play} initialPlayerParams={{ controls: false, modestbranding: true, }} />
                        <Image source={{ uri: 'https://img.youtube.com/vi/VO9GVLfMtXQ/sddefault.jpg' }} style={{ width: videoReady && play ? 0 : 100, height: videoReady && play ? 0 : 56 }} />
                    </View>
                    <View style={{ marginLeft: 8, width: Dimensions.get('window').width - (100+56+56), paddingRight: 12 }}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.title}>Those Dry Bone</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.subTitle}>The Life and Death of God Very long title</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', flexBasis: 112 }} >
                        <Button transparent onPress={()=>setPlay(!play)} style={{ width: 56, height: 56 }} >
                            <Thumbnail source={play ? Theme.icons.white.pauseMiniPlayer : Theme.icons.white.playMiniPlayer} style={{ width: 24, height: 24 }}></Thumbnail>
                        </Button>
                        <Button transparent onPress={test2} style={{ width: 56, height: 56 }} >
                            <Thumbnail source={Theme.icons.white.closeCancel} style={{ width: 24, height: 24 }}></Thumbnail>
                        </Button>
                    </View>
                </View>
            ) 
        case 'none':
            return <View></View>
    }
    
}