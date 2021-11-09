import * as Calendar from 'expo-calendar';
import { Alert, Platform } from 'react-native';
import moment from 'moment';

type CalendarEvent = {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
};

type EventOptions = {
  // eslint-disable-next-line camelcase
  start_time: string;
  // eslint-disable-next-line camelcase
  end_time: string;
};
export default class CalendarService {
  static requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        return true;
      }
      return false;
    }
    return false;
  };

  static checkPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const check = await Calendar.getCalendarPermissionsAsync();
      if (check.status === 'granted') {
        return true;
      }
      const requestPermission = await CalendarService.requestPermissions();
      if (requestPermission) return true;
      return false;
    }
    // mac and web unhandled?
    return false;
  };

  static getDefaultCalendar = async (): Promise<string | null> => {
    try {
      if (Platform.OS === 'ios') {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.id;
      }
      return await CalendarService.findTMHCalendar(); // if unable to create tmh-calendar defaults to id 1.
    } catch (error) {
      if (error instanceof Error) return error.message;
    }
    return null;
  };

  static createTMHCalendar = async (): Promise<string> => {
    if (await CalendarService.checkPermissions()) {
      try {
        const TMHCalendarid = await Calendar.createCalendarAsync({
          name: 'TMH',
          title: 'TMH-Events',
          color: 'blue',
          accessLevel: 'owner',
          entityType: Calendar.EntityTypes.EVENT,
          ownerAccount: 'personal',
          source: {
            isLocalAccount: true,
            name: 'TMH-Events',
            type: 'LOCAL',
          },
          isVisible: true,
          isSynced: true,
        });
        return TMHCalendarid;
      } catch (error) {
        console.warn(error);
      }
    }
    return '0';
  };

  static findTMHCalendar = async (): Promise<string> => {
    try {
      // console.log("Looking for TMHCalendar")
      const calendars = await Calendar.getCalendarsAsync();
      const tmhCalendarId = calendars.filter((calendar) => {
        return calendar.source.name === 'TMH-Events';
      })[0]?.id;

      if (tmhCalendarId === undefined) {
        // console.log("Calendar does not exist")
        return await CalendarService.createTMHCalendar();
      }
      // console.log("Calendar is found with id " + tmhCalendarId)
      return tmhCalendarId;
    } catch (error) {
      console.warn(error);
      return '1';
    }
  };

  static validateEventFields = (
    event: any,
    options: EventOptions
  ): CalendarEvent => {
    const startDate = moment(options.start_time);
    const endDate = moment(options.end_time);
    // console.log(`start_date ${startDate}`);
    // console.log(`end_date ${endDate}`);
    const eventObject: CalendarEvent = {
      title: event.name,
      startDate: new Date(startDate.toDate()),
      endDate: new Date(endDate.toDate()),
    };
    if (event.place?.location?.street) {
      eventObject.location = event.place.location.street;
    } else if (event.place?.name) {
      eventObject.location = event.place.name;
    }
    return eventObject;
  };

  static eventNotExists = async (
    calendarId: string,
    options: EventOptions,
    eventItem: any
  ): Promise<boolean | undefined> => {
    try {
      const notExists = await Calendar.getEventsAsync(
        [calendarId],
        new Date(moment(options.start_time).toDate()),
        new Date(moment(options.end_time).toDate())
      );
      if (notExists.length === 0) {
        // console.log(notExists)
        // console.log("Event doesn't exist")
        return true;
      }
      for (let x = 0; x < notExists.length; x++) {
        if (notExists[x].title === eventItem.name) return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  static createEvent = async (
    eventItem: any,
    options: EventOptions
  ): Promise<EventOptions | undefined> => {
    const validated: boolean | any = CalendarService.validateEventFields(
      eventItem,
      options
    );
    if (validated !== false) {
      try {
        await CalendarService.checkPermissions();
        const defaultCalendar: string =
          (await CalendarService.getDefaultCalendar()) ?? '';
        const shouldCreateEvent = await CalendarService.eventNotExists(
          defaultCalendar,
          options,
          eventItem
        );
        if (shouldCreateEvent) {
          const eventIdInCalendar: string = await Calendar.createEventAsync(
            defaultCalendar,
            validated
          );
          if (Platform.OS === 'android') {
            Calendar.openEventInCalendar(eventIdInCalendar);
            return options;
          }
          // console.log("Created an IOS event")
          Alert.alert(
            'Added to Calendar',
            // eslint-disable-next-line camelcase
            moment(options?.start_time).format('dddd, MMMM Do YYYY, h:mm a'),
            [{ text: 'Dismiss' }],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Event Exists',
            'Event has already been added.',
            [{ text: 'Dismiss' }],
            { cancelable: false }
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('permission')) {
            Alert.alert(
              'Permission Error',
              'Please enable Calendar permissions in settings',
              [{ text: 'Dismiss' }],
              { cancelable: false }
            );
          }
        }
      }
    } else {
      console.log('Failed to validate event data');
    }
    return undefined;
  };
}
