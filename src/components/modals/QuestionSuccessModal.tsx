import React, { useEffect, useState } from 'react';
import { View, Text, Thumbnail} from 'native-base';
import { Modal, Image} from 'react-native';
import Theme, { Style } from '../../Theme.style';
import WhiteButton from '../buttons/WhiteButton';

interface Params {
  show:boolean;
  setShow:any;
}

export default function QuestionSuccessModal({show, setShow}:Params): JSX.Element {
  return (
    <Modal animationType="none" visible={show} transparent>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        
        <View
          style={{
            backgroundColor: 'white',
            padding: 32,
            width: '96%',
            alignSelf: 'center',
          }}
        >
          <Image style={{marginBottom:28,alignSelf:"center",width:27,height:24}} source={Theme.icons.black.checkMark}></Image>
          <Text
            style={{
              fontFamily: Theme.fonts.fontFamilyBold,
              fontSize: 24,
              lineHeight: 32,
              color: 'black',
             
              alignSelf: 'center',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            Your question has been submitted!
          </Text>
          <Text
            style={{
              fontFamily: Theme.fonts.fontFamilyMedium,
              fontSize: 16,
              lineHeight: 24,
              color: 'black',
              alignSelf: 'center',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            Thanks for entrusting us with your questions. We'll do our best to answer it this week!
          </Text>
          <View style={{ height: 56, marginBottom: 16 }}>
            <WhiteButton
              solidBlack
              label="OK"
              onPress={() => setShow(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
