
import * as Calendar from "expo-calendar";
import { Alert, Linking, Platform } from "react-native";
import moment from "moment";
type Event = {

}

export default class CalendarService {
    static requestPermissions = async (): Promise<boolean> => {
        //console.log("requestPermissions() called. Requesting Permission")
        console.log(Platform.OS)
        if (Platform.OS === "android" || Platform.OS === "ios") {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === "granted") {
                //console.log("Permission has been granted.")
                return true;
            }
            else {
                //TODO: SOMEHOW ACCOUNT FOR ACCIDENTALLY DENIED PERMISSION
                //console.log(status)
                //console.log("permission not granted in requestPermissions()")
                return false
            }
        }
        else {
            //mac and web unhandled
            //console.log("OS not supported")
            return false;
        }
    }
    static checkPermissions = async (): Promise<boolean> => {
        //console.log("checkPermissions() called. Checking Permission")
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
        //console.log("Getting default calendar")
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
    static validateEventFields = (event: any): boolean | any => {
        const start_date = moment(event.start_time)
        const end_date = moment(event.end_time)
        if (start_date.isValid() && end_date.isValid()) {
            const eventObject: any = {
                title: event.name,
                startDate: new Date(event.start_time),
                endDate: new Date(event.end_time),
            }
            if (event.place?.location?.street) eventObject.location = event.place.location.street
            else if (event.place?.name) eventObject.location = event.place.name
            return eventObject;
        } return false

    }

    static createEvent = async (eventItem: Event): Promise<any> => {
        // TODO: IMPLEMENT WAY TO CHECK IF EVENT ALREADY EXISTS BEFORE ADDING IT.
        // console.log("Creating event.")
        const validated: boolean | any = CalendarService.validateEventFields(eventItem)
        if (validated !== false) {
            try {
                if (CalendarService.checkPermissions()) {
                    const defaultCalendar: string = await CalendarService.getDefaultCalendar();
                    const eventIdInCalendar: string = await Calendar.createEventAsync(defaultCalendar, validated)
                    if (Platform.OS === "android") {
                        Calendar.openEventInCalendar(eventIdInCalendar);
                        Alert.alert('event created')
                    }
                    else {
                        //Linking.openURL('calshow:')
                    }
                }
                else {
                    console.log("Permissions not allowed.")
                }
            } catch (error) {

            }
        } else {
            console.log("Failed to validate event data")
        }
    }

}