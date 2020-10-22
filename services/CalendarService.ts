
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
                return await CalendarService.findTMHCalendar() || "1"; // if unable to create tmh-calendar defaults to id 1.

            }
        } catch (error) {
            return error
        }
    }
    static createTMHCalendar = async (): Promise<any> => {
        if (await CalendarService.checkPermissions()) {
            try {
                const TMHCalendarid = await Calendar.createCalendarAsync({
                    name: "TMH",
                    title: "TMH-Events",
                    color: "blue",
                    accessLevel: "owner",
                    entityType: Calendar.EntityTypes.EVENT,
                    ownerAccount: "personal",
                    source: {
                        isLocalAccount: true,
                        name: "TMH-Events",
                        type: "LOCAL"
                    },
                    isVisible: true,
                    isSynced: true,
                })
                console.log("TMHCalendarid is found " + TMHCalendarid)
                return TMHCalendarid;
            }
            catch (error) {
                console.warn(error)
            }
        }
        else {
            //console.log("permission not granted")
            return false;
        }
    }

    static findTMHCalendar = async (): Promise<any> => {
        try {
            console.log("Looking for TMHCalendar")
            const calendars = await Calendar.getCalendarsAsync();
            if (calendars.filter((calendar) => {
                return calendar.source.name === "TMH-Events"
            })[0]?.id === undefined) {
                return await CalendarService.createTMHCalendar()
            }
        }
        catch (error) {
            console.warn(error)
        }
    }

    static validateEventFields = (event: any, options: any): boolean | any => {
        const start_date = moment(options.start_time)
        const end_date = moment(options.end_time)
        console.log(`start_date ${start_date}`)
        console.log(`end_date ${end_date}`)
        const eventObject: any = {
            title: event.name,
            startDate: new Date(start_date.toDate()),
            endDate: new Date(end_date.toDate())
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
                if (error.message.includes("permission")) {
                    Alert.alert(
                        'Permission Error',
                        'Please enable Calendar permissions in settings',
                        [
                            { text: 'Dismiss' }
                        ],
                        { cancelable: false })
                }
            }
        } else {
            console.log("Failed to validate event data")
        }
    }

}