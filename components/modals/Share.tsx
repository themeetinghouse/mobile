import React, { useState } from 'react';
import { StyleSheet, Clipboard, Share, Platform } from 'react-native';
import { Button, View, Text, Thumbnail } from 'native-base';
import { Theme } from '../../Theme.style'
import * as Linking from 'expo-linking';


const style = StyleSheet.create({
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
        marginRight: 4,
    }
})

interface Params {
    link: string;
    message: string;
    show: boolean
}

export default function ShareModal({ link, show, message }: Params): JSX.Element {

    const [copyLinkText, setCopyLinkText] = useState('Copy Link')

    const shareToTwitter = async () => {
        const url = `https://twitter.com/intent/tweet?text=${message}&url=${link}&via=themeetinghouse`

        try {
            await Linking.canOpenURL(url)
            Linking.openURL(url)
        } catch (e) {
            console.debug(e)
        }
    }

    const share = async () => {
        const params =
            Platform.OS === 'ios' ?
                { url: link, message: message }
                : { message: link, title: message }

        try {
            Share.share(params)
        } catch (e) {
            console.debug(e)
        }
    }

    if (show)
        return <View style={{ position: 'absolute', zIndex: 9999, top: 56 - 10.5 - 6, right: 0 }} >
            <View style={[style.triangle, { alignSelf: 'flex-end' }]}></View>
            <View style={{ width: 254, height: 160, backgroundColor: 'white', padding: 16 }} >
                <Button style={{ width: 222, height: 56, borderRadius: 0, backgroundColor: Theme.colors.background }} block onPress={() => { Clipboard.setString(link); setCopyLinkText('Copied') }}>
                    <Thumbnail square source={Theme.icons.white.link} style={{ width: 24, height: 24 }} ></Thumbnail>
                    <Text style={{ color: 'white', fontFamily: Theme.fonts.fontFamilyBold, fontSize: 16, lineHeight: 24 }} uppercase={false}>{copyLinkText}</Text>
                </Button>
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 16 }} >
                    <Button style={{ width: 103, height: 56, borderRadius: 0, borderWidth: 3, borderColor: Theme.colors.background, backgroundColor: 'transparent', marginRight: 16 }} block onPress={shareToTwitter}>
                        <Thumbnail square source={Theme.icons.black.twitter} style={{ width: 24, height: 24 }} ></Thumbnail>
                    </Button>
                    <Button style={{ width: 103, height: 56, borderRadius: 0, borderWidth: 3, borderColor: Theme.colors.background, backgroundColor: 'transparent' }} block onPress={share}>
                        <Thumbnail square source={Theme.icons.black.share} style={{ width: 24, height: 24 }} ></Thumbnail>
                    </Button>
                </View>
            </View>
        </View>
    else
        return <View />
}