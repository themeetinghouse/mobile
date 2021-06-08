import moment from 'moment-timezone';
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import WhiteButton from '../../../src/components/buttons/WhiteButton';
import Calendar from '../../services/CalendarService';
import Theme from '../../Theme.style';
import { getTimeStamp } from './HomeChurchUtils';
import { HomeChurch } from './HomeChurchScreen';

interface Params {
  homeChurch: HomeChurch;
  handleClose: () => void;
  type: 'contact' | 'calendar' | '';
}
const HomeChurchConfirmationModal = ({
  homeChurch,
  handleClose,
  type,
}: Params): JSX.Element => {
  const startTime = moment.tz(getTimeStamp(homeChurch), moment.tz.guess());
  const [open] = useState(true);
  const addToCalendar = async () => {
    const time = startTime;
    const endTime = moment(time).add(2, 'hours');
    try {
      await Calendar.createEvent(
        {
          name: homeChurch?.name,
          place: {
            location: {
              street: homeChurch?.location?.address?.address1,
            },
          },
        },
        {
          start_time: time.format(),
          end_time: endTime.format(),
        }
      );
    } catch (err) {
      // error occurred
    } finally {
      // great success
    }
  };
  return (
    <Modal animationType="slide" visible={open} transparent>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,.5)',
        }}
      >
        <View
          style={{
            padding: 32,
            width: '100%',
            backgroundColor: 'white',
            alignSelf: 'center',
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontFamily: Theme.fonts.fontFamilyBold,
                fontSize: 24,
                width: '95%',
                color: 'black',
                textAlign: 'left',
                marginBottom: 16,
              }}
            >
              {type === 'contact'
                ? `Send email to the leader of ${homeChurch?.name}?`
                : type === 'calendar'
                ? `Add ${homeChurch?.name} to your calendar?`
                : ''}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 6,
                width: 27,
                height: 24,
              }}
              onPress={() => {
                handleClose();
              }}
            >
              <Image
                style={{
                  width: 27,
                  height: 24,
                }}
                source={Theme.icons.black.closeCancel}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontFamily: Theme.fonts.fontFamilyMedium,
              fontSize: 16,
              lineHeight: 24,
              color: 'black',
              textAlign: 'left',
              marginBottom: 16,
            }}
          >
            {type === 'contact' ? (
              `This will open your default email client to compose a new message.`
            ) : type === 'calendar' ? (
              <>
                This will add a single entry to your calendar for{' '}
                <Text style={{ fontFamily: Theme.fonts.fontFamilyBold }}>
                  {startTime.format('dddd, MMM DD')} from{' '}
                  {startTime.format('hh:mm')} -{' '}
                  {startTime.add(2, 'hours').format('h:mm a')}
                </Text>
              </>
            ) : (
              ''
            )}
          </Text>
          <View style={{ height: 56, marginBottom: 16, marginTop: 16 }}>
            <WhiteButton
              solidBlack
              label="Yes"
              onPress={async () => {
                if (type === 'contact') {
                  await Linking.openURL(
                    `mailto:roger.massie@themeetinghouse.com?subject=Inquiry%20About%20Home%20Church&body=Home%20Church%20ID:%20${homeChurch?.id}`
                  );
                  handleClose();
                } else if (type === 'calendar') await addToCalendar();
              }}
            />
          </View>
          <View style={{ borderWidth: 3, height: 56, marginBottom: 16 }}>
            <WhiteButton label="Cancel" onPress={handleClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default HomeChurchConfirmationModal;
