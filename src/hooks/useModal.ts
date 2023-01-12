import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Auth } from 'aws-amplify';
import moment from 'moment';
import { useModalContext } from '../contexts/ModalContext/ModalContext';

const checkUserIsVerified = async () => {
  const user = await Auth.currentAuthenticatedUser();
  return user.attributes.email_verified;
};

export default function useModal(finishedLoading: boolean) {
  const { newModal, dismissModal } = useModalContext();
  const navigation = useNavigation();
  useEffect(() => {
    const checkUser = async () => {
      let daysSinceLastNotification = 0;
      const lastNotification = await AsyncStorage.getItem('lastNotification');
      console.log({ lastNotification });
      if (lastNotification) {
        const lastNotificationDate = moment(lastNotification);
        const now = moment();
        daysSinceLastNotification = now.diff(lastNotificationDate, 'days');
        if (daysSinceLastNotification <= 14) return;
      }
      const firstLoginCompleted = await AsyncStorage.getItem(
        'firstLoginCompleted'
      );
      try {
        const isUserVerified = await checkUserIsVerified();
        if (!isUserVerified) {
          newModal({
            isVisible: true,
            title: 'We noticed your account is not verified.',
            body: 'In order to access all of the features of the app, please verify your account. If you have any questions, please contact us.',
            dismissActionLabel: 'Dismiss',
            dismiss: () => dismissModal?.(),
            actionLabel: 'Verify Account',
            action: () => {
              dismissModal?.();
              navigation.navigate('Auth', { screen: 'ConfirmSignUpScreen' });
            },
          });
          await AsyncStorage.setItem(
            'lastNotification',
            moment().format('YYYY-MM-DD')
          );
        } else {
          console.log('User is already verified.');
        }
        if (!firstLoginCompleted) {
          newModal({
            isVisible: true,
            title: 'Welcome to the The Meeting House App!',
            body: "We're glad you're here! We hope you like the app and find it useful. To get the most out of it, please log in to your account. If you don't have one, make one and you'll be able to comment on teaching notes, view location staff and more.",
            actionLabel: 'Register or Login',
            action: () => {
              dismissModal?.();
              navigation.navigate('Auth');
            },
            dismiss: () => dismissModal?.(),
            dismissActionLabel: 'Not now',
          });
          await AsyncStorage.setItem(
            'lastNotification',
            moment().format('YYYY-MM-DD')
          );
          await AsyncStorage.setItem('firstLoginCompleted', 'true');
        } else {
          console.log('User has previously completed first start up.');
        }
        console.log('User is already logged in.');
      } catch (error) {
        if (!firstLoginCompleted) {
          newModal({
            isVisible: true,
            title: 'Welcome to the The Meeting House App!',
            body: "We're glad you're here! We hope you like the app and find it useful. To get the most out of it, please log in to your account. If you don't have one, make one and you'll be able to comment on teaching notes, view location staff and more.",
            actionLabel: 'Register or Login',
            action: () => {
              dismissModal?.();
              navigation.navigate('Auth');
            },
            dismiss: () => dismissModal?.(),
            dismissActionLabel: 'Not now',
          });
          await AsyncStorage.setItem(
            'lastNotification',
            moment().format('YYYY-MM-DD')
          );
          await AsyncStorage.setItem('firstLoginCompleted', 'true');
        } else
          newModal({
            isVisible: true,
            title: "We noticed you aren't logged in yet.",
            body: 'In order to access all of the features of the app, please log in. If you have any questions, please contact us.',
            dismissActionLabel: 'Dismiss',
            dismiss: () => dismissModal?.(),
            actionLabel: 'Register an Account',
            action: () => {
              dismissModal?.();
              navigation.navigate('Auth');
            },
          });

        await AsyncStorage.setItem(
          'lastNotification',
          moment().format('YYYY-MM-DD')
        );
        console.error({ error });
      }
    };
    if (!finishedLoading) return;
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishedLoading]);
}
