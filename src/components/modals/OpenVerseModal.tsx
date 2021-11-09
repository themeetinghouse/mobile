import React, { useState, useContext } from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { View, Image, Text, Button } from 'native-base';
import WhiteButton from '../buttons/WhiteButton';
import Theme from '../../Theme.style';
import UserContext from '../../contexts/UserContext';

interface OpenVerseModalParams {
  closeCallback: () => void;
  openPassageCallback: (
    openIn: 'app' | 'web',
    remember: boolean
  ) => Promise<void>;
}

export default function OpenVerseModal({
  closeCallback,
  openPassageCallback,
}: OpenVerseModalParams): JSX.Element {
  const [rememberChoice, setRememberChoice] = useState(false);
  const [openIn, setOpenIn] = useState<'' | 'app' | 'web'>('');
  const user = useContext(UserContext);

  const handleOpenPassage = () => {
    if (openIn !== '') openPassageCallback(openIn, rememberChoice);
  };

  // eslint-disable-next-line camelcase
  const emailVerified = user.userData?.email_verified;

  return (
    <View
      style={{
        bottom: 0,
        height: 386 - (emailVerified ? 0 : 80),
        backgroundColor: 'white',
        padding: 16,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontFamily: Theme.fonts.fontFamilyBold,
            fontSize: 24,
            lineHeight: 32,
            color: 'black',
            width: '67%',
          }}
        >
          How would you like to open this verse?
        </Text>
        <Button onPress={closeCallback}>
          <Image
            alt="Cancel Icon"
            source={Theme.icons.black.closeCancel}
            style={{ width: 24, height: 24 }}
          />
        </Button>
      </View>
      <TouchableOpacity
        onPress={() => setOpenIn('app')}
        style={{
          height: 56,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomColor: Theme.colors.grey6,
          borderBottomWidth: 1,
        }}
      >
        <Text
          style={{
            fontFamily: Theme.fonts.fontFamilyBold,
            fontSize: 16,
            lineHeight: 24,
            color: 'black',
          }}
        >
          Open in Bible App
        </Text>
        {openIn === 'app' ? (
          <Image
            source={Theme.icons.black.checkMark}
            style={{ width: 24, height: 24 }}
            alt="Check mark Icon"
          />
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setOpenIn('web')}
        style={{
          height: 56,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomColor: Theme.colors.grey6,
          borderBottomWidth: 1,
        }}
      >
        <Text
          style={{
            fontFamily: Theme.fonts.fontFamilyBold,
            fontSize: 16,
            lineHeight: 24,
            color: 'black',
          }}
        >
          Open in Web Browser
        </Text>
        {openIn === 'web' ? (
          <Image
            source={Theme.icons.black.checkMark}
            style={{ width: 24, height: 24 }}
            alt="Check mark Icon"
          />
        ) : null}
      </TouchableOpacity>
      {emailVerified ? (
        <View
          style={{
            height: 80,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => setRememberChoice(!rememberChoice)}
            style={{
              width: 32,
              height: 32,
              borderWidth: 2,
              borderColor: Theme.colors.grey5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {rememberChoice ? (
              <Image
                source={Theme.icons.black.checkMark}
                style={{ width: 24, height: 24 }}
                alt="Check mark Icon"
              />
            ) : null}
          </TouchableWithoutFeedback>
          <Text
            style={{
              fontFamily: Theme.fonts.fontFamilyRegular,
              fontSize: 16,
              lineHeight: 24,
              color: 'black',
              marginLeft: 20,
            }}
          >
            Remember my choice
          </Text>
        </View>
      ) : null}
      <View style={{ height: 56 }}>
        <WhiteButton
          solidBlack
          label="Open Passage"
          onPress={handleOpenPassage}
        />
      </View>
    </View>
  );
}
