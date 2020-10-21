
import * as Calendar from "expo-calendar";
import { Alert, Platform } from "react-native";
import moment from "moment";

export default class CalendarService {
    static requestPermissions = async (): Promise<boolean> => {
        if (Platform.OS === "android" || Platform.OS === "ios") {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === "granted") {
                return true;
            }
            else {
                return false
            }
        }
        else {
            return false;
        }
    }
    static checkPermissions = async (): Promise<boolean> => {
        if (Platform.OS === "android" || Platform.OS === "ios") {
            const check = await Calendar.getCalendarPermissionsAsync();
            if (check.status === "granted") {
                return true;
            }
            else {
                const requestPermission = await CalendarService.requestPermissions()
                if (requestPermission) return true;
                else return false
            }
        }
        else {
            //mac and web unhandled?
            return false;
        }
    }
    static getDefaultCalendar = async (): Promise<string> => {
        try {
            if (Platform.OS === "ios") {
                const defaultCalendar = await Calendar.getDefaultCalendarAsync()
                return defaultCalendar.id;
            }
            else {
                // TODO: CALENDAR TO ADD TO MUST BE DETERMINED FOR ANDROID. 
                // TODO: CREATING A CALENDAR createCalendarAsync() AND CREATING EVENTS IN IT ALLOWS EVENTS TO SHOW IN CALENDAR APP

                // const defaultCalendar = await Calendar.getCalendarsAsync();
                return "1";
            }
        } catch (error) {
            return error
        }
    }
    static validateEventFields = (event: any, options: any): boolean | any => {
        const start_date = options.start_time
        const end_date = options.end_time
        console.log(`start_date ${start_date}`)
        console.log(`end_date ${end_date}`)
        const eventObject: any = {
            title: event.name,
            startDate: new Date(start_date),
            endDate: new Date(end_date)
        }
        if (event.place?.location?.street) eventObject.location = event.place.location.street
        else if (event.place?.name) eventObject.location = event.place.name
        return eventObject;

    }

    static createEvent = async (eventItem: any, options: any): Promise<any> => {
        // TODO: IMPLEMENT WAY TO CHECK IF EVENT ALREADY EXISTS BEFORE ADDING IT.
        console.log("Creating event.")
        console.log(options)
        const validated: boolean | any = CalendarService.validateEventFields(eventItem, options)
        if (validated !== false) {
            try {
                await CalendarService.checkPermissions()
                const defaultCalendar: string = await CalendarService.getDefaultCalendar();
                const eventIdInCalendar: string = await Calendar.createEventAsync(defaultCalendar, validated)
                if (Platform.OS === "android") {
                    Alert.alert(
                        'Added to Calendar',
                        moment(options?.start_time).format("dddd, MMMM Do YYYY, h:mm a"),
                        [
                            { text: 'Dismiss' }
                        ],
                        { cancelable: false })
                    Calendar.openEventInCalendar(eventIdInCalendar);
                }
                else {
                    console.log("Created an IOS event")
                    Alert.alert(
                        'Added to Calendar',
                        moment(options?.start_time).format("dddd, MMMM Do YYYY, h:mm a"),
                        [
                            { text: 'Dismiss' },
                        ],
                        { cancelable: false })
                }

            } catch (error) {
                console.warn(error)
            }
        } else {
            console.log("Failed to validate event data")
        }
    }

}