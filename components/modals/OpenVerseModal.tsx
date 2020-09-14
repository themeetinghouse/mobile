import React, { useState, useContext } from 'react';
import WhiteButton from '../buttons/WhiteButton';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { View, Thumbnail, Text, Button } from 'native-base';
import Theme from '../../Theme.style';
import UserContext from '../../contexts/UserContext'

interface OpenVerseModalParams {
    closeCallback: () => void;
    openPassageCallback: (openIn: 'app' | 'web', remember: boolean) => Promise<void>;
}

export default function OpenVerseModal({ closeCallback, openPassageCallback }: OpenVerseModalParams): JSX.Element {

    const [rememberChoice, setRememberChoice] = useState(false);
    const [openIn, setOpenIn] = useState<'' | 'app' | 'web'>('');
    const user = useContext(UserContext);

    const handleOpenPassage = () => {
        if (openIn !== '')
            openPassageCallback(openIn, rememberChoice)
    }

    return <View style={{ bottom: 0, height: 386 - (user?.userData?.email_verified ? 0 : 80), backgroundColor: 'white', padding: 16 }} >
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} >
            <Text style={{ fontFamily: Theme.fonts.fontFamilyBold, fontSize: 24, lineHeight: 32, color: 'black', width: '67%' }}>How would you like to open this verse?</Text>
            <Button transparent onPress={closeCallback} ><Thumbnail source={Theme.icons.black.closeCancel} square style={{ width: 24, height: 24 }}></Thumbnail></Button>
        </View>
        <TouchableOpacity onPress={() => setOpenIn('app')} style={{ height: 56, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: Theme.colors.grey6, borderBottomWidth: 1 }} >
            <Text style={{ fontFamily: Theme.fonts.fontFamilyBold, fontSize: 16, lineHeight: 24, color: 'black' }}>Open in Bible App</Text>
            {openIn === 'app' ? <Thumbnail source={Theme.icons.black.checkMark} style={{ width: 24, height: 24 }} square /> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOpenIn('web')} style={{ height: 56, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: Theme.colors.grey6, borderBottomWidth: 1 }} >
            <Text style={{ fontFamily: Theme.fonts.fontFamilyBold, fontSize: 16, lineHeight: 24, color: 'black' }}>Open in Web Browser</Text>
            {openIn === 'web' ? <Thumbnail source={Theme.icons.black.checkMark} style={{ width: 24, height: 24 }} square /> : null}
        </TouchableOpacity>
        {user?.userData?.email_verified ? <View style={{ height: 80, display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <TouchableWithoutFeedback onPress={() => setRememberChoice(!rememberChoice)} style={{ width: 32, height: 32, borderWidth: 2, borderColor: Theme.colors.grey5, alignItems: 'center', justifyContent: 'center' }} >
                {rememberChoice ? <Thumbnail source={Theme.icons.black.checkMark} style={{ width: 24, height: 24 }} square /> : null}
            </TouchableWithoutFeedback>
            <Text style={{ fontFamily: Theme.fonts.fontFamilyRegular, fontSize: 16, lineHeight: 24, color: 'black', marginLeft: 20 }}>Remember my choice</Text>
        </View> : null}
        <View style={{ height: 56 }} >
            <WhiteButton solidBlack label="Open Passage" onPress={handleOpenPassage} ></WhiteButton>
        </View>
    </View>
}