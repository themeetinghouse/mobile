import LocationService from './LocationsService';
import * as SQLite from 'expo-sqlite';
import moment from "moment";

export default class StaffDirectoryService {
    static mapToLocation(code: string) {
        switch (code) {
            case "HMAN": return "Ancaster"
            case "ALLI": return "Alliston"
            case "BRAM": return "Brampton"
            case "BRFD": return "Brantford"
            case "BURL": return "Burlington"
            case "HMMT": return "Hamilton Mountain"
            case "HMDT": return "Hamilton - Downtown"
            case "KIT": return "Kitchener"
            case "LOND": return "London"
            case "NMKT": return "Newmarket"
            case "OAKV": return "Oakville"
            case "OTTA": return "Ottawa"
            case "OWSN": return "Owen Sound"
            case "PRSN": return "Parry Sound"
            case "RHLL": return "Richmond Hill"
            case "SAND": return "Sandbanks"
            case "TODT": return "Toronto - Downtown"
            case "TOBC": return "Toronto - East"
            case "TOHP": return "Toronto - High Park"
            case "TOUP": return "Toronto - Uptown"
            case "WAT": return "Waterloo"
            default: return "unknown"
        }
    }
    static loadStaffList = async (): Promise<any> => {
        try {
            const getSiteData: any = await fetch(`https://www.themeetinghouse.com/static/data/staff.json`)
            const pageContent = await getSiteData.json()
            let staff: any = [];
            pageContent.map((staffItem, index) => {
                for (let x = 0; x < staffItem.sites.length; x++) {
                    if (StaffDirectoryService.mapToLocation(staffItem.sites[x]) !== "unknown") {
                        staff.push({ ...staffItem, Location: StaffDirectoryService.mapToLocation(staffItem.sites[x]) })
                        break;
                    }
                    if (x === staffItem.sites.length - 1 && StaffDirectoryService.mapToLocation(staffItem.sites[x]) === "unknown") {
                        staff.push({ ...staffItem, Location: StaffDirectoryService.mapToLocation(staffItem.sites[x]) })
                    }
                }
            })
            return staff;
        } catch (error) {
            console.log(error)
        }
    }
    static loadStaffListByLocation = async (selectedLocation: any): Promise<any> => { //takes the users selected (location) parish
        try {
            const staff = await StaffDirectoryService.loadStaffList()
            let sectionedList: any = [];
            if (selectedLocation?.locationData?.locationId !== "unknown") {
                sectionedList = [ // these need to be hard-coded.
                    { locationid: "ancaster", code: "HMAN", title: "Ancaster", data: [] },
                    { locationid: "alliston", code: "ALLI", title: "Alliston", data: [] },
                    { locationid: "brampton", code: "BRAM", title: "Brampton", data: [] },
                    { locationid: "brantford", code: "BRFD", title: "Brantford", data: [] },
                    { locationid: "burlington", code: "BURL", title: "Burlington", data: [] },
                    { locationid: "hamilton-mountain", code: "HMMT", title: "Hamilton Mountain", data: [] },
                    { locationid: "hamilton-downtown", code: "HMDT", title: "Hamilton - Downtown", data: [] },
                    { locationid: "kitchener", code: "KIT", title: "Kitchener", data: [] },
                    { locationid: "london", code: "LOND", title: "London", data: [] },
                    { locationid: "newmarket", code: "NMKT", title: "Newmarket", data: [] },
                    { locationid: "oakville", code: "OAKV", title: "Oakville", data: [] },
                    { locationid: "ottawa", code: "OTTA", title: "Ottawa", data: [] },
                    { locationid: "owen-sound", code: "OWSN", title: "Owen Sound", data: [] },
                    { locationid: "parry-sound", code: "PRSN", title: "Parry Sound", data: [] },
                    { locationid: "richmond-hill", code: "RHLL", title: "Richmond Hill", data: [] },
                    { locationid: "sandbanks", code: "SAND", title: "Sandbanks", data: [] },
                    { locationid: "toronto-downtown", code: "TODT", title: "Toronto - Downtown", data: [] },
                    { locationid: "toronto-east", code: "TOBC", title: "Toronto - East", data: [] },
                    { locationid: "toronto-high-park", code: "TOHP", title: "Toronto - High Park", data: [] },
                    { locationid: "toronto-uptown", code: "TOUP", title: "Toronto - Uptown", data: [] },
                    { locationid: "waterloo", code: "WAT", title: "Waterloo", data: [] },
                ].sort((a, b) => { return a.locationid === selectedLocation?.locationData?.locationId ? -1 : b.locationid == selectedLocation?.locationData?.locationId ? 1 : 0; })
            }
            else {
                sectionedList = [ // these need to be hard-coded.
                    { locationid: "ancaster", code: "HMAN", title: "Ancaster", data: [] },
                    { locationid: "alliston", code: "ALLI", title: "Alliston", data: [] },
                    { locationid: "brampton", code: "BRAM", title: "Brampton", data: [] },
                    { locationid: "brantford", code: "BRFD", title: "Brantford", data: [] },
                    { locationid: "burlington", code: "BURL", title: "Burlington", data: [] },
                    { locationid: "hamilton-mountain", code: "HMMT", title: "Hamilton Mountain", data: [] },
                    { locationid: "hamilton-downtown", code: "HMDT", title: "Hamilton - Downtown", data: [] },
                    { locationid: "kitchener", code: "KIT", title: "Kitchener", data: [] },
                    { locationid: "london", code: "LOND", title: "London", data: [] },
                    { locationid: "newmarket", code: "NMKT", title: "Newmarket", data: [] },
                    { locationid: "oakville", code: "OAKV", title: "Oakville", data: [] },
                    { locationid: "ottawa", code: "OTTA", title: "Ottawa", data: [] },
                    { locationid: "owen-sound", code: "OWSN", title: "Owen Sound", data: [] },
                    { locationid: "parry-sound", code: "PRSN", title: "Parry Sound", data: [] },
                    { locationid: "richmond-hill", code: "RHLL", title: "Richmond Hill", data: [] },
                    { locationid: "sandbanks", code: "SAND", title: "Sandbanks", data: [] },
                    { locationid: "toronto-downtown", code: "TODT", title: "Toronto - Downtown", data: [] },
                    { locationid: "toronto-east", code: "TOBC", title: "Toronto - East", data: [] },
                    { locationid: "toronto-high-park", code: "TOHP", title: "Toronto - High Park", data: [] },
                    { locationid: "toronto-uptown", code: "TOUP", title: "Toronto - Uptown", data: [] },
                    { locationid: "waterloo", code: "WAT", title: "Waterloo", data: [] },
                ]
            }
            staff.map((staffItem: any) => {
                for (let x = 0; x < staffItem.sites.length; x++) {
                    for (let i = 0; i < sectionedList.length; i++) {
                        if (staffItem.sites[x] === sectionedList[i].code) sectionedList[i].data.push({ ...staffItem, Location: sectionedList[i].title })
                    }
                }
            })
            return sectionedList;
        } catch (error) {
            console.log(error)
        }
    }
    /*     static loadCoordinatorsList = async (): Promise<any> => {
            try {
                const getSiteData: any = await fetch(`https://www.themeetinghouse.com/static/data/coordinators.json`)
                const pageContent = await getSiteData.json()
    
                const transformed = pageContent.map((coordinator) => {
                    return { ...coordinator, Coordinator: true }
                })
                return transformed;
            } catch (error) {
                console.log(error)
            }
        } */

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