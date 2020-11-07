import LocationService from './LocationsService';
import * as SQLite from 'expo-sqlite';
import moment from "moment";

export default class StaffDirectoryService {
    static loadStaffList = async (): Promise<any> => {
        try {
            const getSiteData: any = await fetch(`https://www.themeetinghouse.com/static/data/staff.json`)
            const pageContent = await getSiteData.json()
            return pageContent;
            //await StaffDirectoryService.storeStaffData(pageContent)
        } catch (error) {
            console.log(error)
        }
    }
    /*
    static storeStaffData = async (staffData: any): Promise<any> => {
        try {
            //store into db
        }
        catch (error) {
            console.log(error)
        }
    }
    static getStoredStaffData = async (): Promise<any> => {
        // fetch from db const storedStaffData = await SecureStore.getItemAsync('staffData')
        //return StaffDirectoryService.parseStorageItem(storedStaffData)
    }

    static parseStorageItem = (staffData: any): any => {
        const obj = JSON.parse(staffData)
        return { ...obj, dateFetched: obj?.dateFetched }
    }*/
}