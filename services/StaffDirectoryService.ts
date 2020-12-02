import SpeakersService from "./SpeakersService";

export type Coordinator = {
    Coordinator: boolean | undefined | null;
    Email: string;
    FirstName: string;
    LastName: string;
    Position: string;
    sites: Array<string>;
    Teacher: boolean | null;
    Location: string;
}
export default class StaffDirectoryService {
    static mapToLocation(code: string): string {
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
    static parseTelephone = (tel: string): string | undefined => {
        const telephone = tel.split(',')[0].replace(/\D/g, '')
        const extension = tel.split(',')[1] ? tel.split(',')[1].replace(/\D/g, '') : ""
        if (telephone && extension) return telephone + "," + extension
        else return telephone
    }

    static loadStaffList = async (): Promise<any> => {
        try {
            const listOfSpeakers: any = await SpeakersService.loadSpeakersList();
            const getSiteData: any = await fetch(`https://www.themeetinghouse.com/static/data/staff.json`)
            const pageContent = await getSiteData.json()
            const staff: any = [];
            pageContent.map((staffItem: any) => {
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
            for (let i = 0; i < staff.length; i++) {
                staff[i] = { ...staff[i], id: i.toString(), Phone: StaffDirectoryService.parseTelephone(staff[i].Phone), uri: `https://themeetinghouse.com/cache/320/static/photos/staff/${staff[i].FirstName}_${staff[i].LastName}_app.jpg` }
            }
            let staffName = "";
            for (let x = 0; x < staff.length; x++) {
                for (let i = 0; i < listOfSpeakers.items.length; i++) {
                    staffName = staff[x].FirstName + " " + staff[x].LastName
                    if (staffName === listOfSpeakers.items[i].name)
                        staff[x] = { ...staff[x], Teacher: true }
                }
            }
            return staff;
        } catch (error) {
            console.log(error)
        }
    }
    static loadStaffListByLocation = async (selectedLocation: any | null): Promise<any> => { //takes the users selected (location) parish
        try {
            const staff = await StaffDirectoryService.loadStaffList()
            const coordinators = await StaffDirectoryService.loadCoordinatorsList();
            const sectionedList: any = [
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
            ].filter((a) => { return a.locationid === selectedLocation?.locationData?.locationId })

            const staffTeam = staff.map((staffItem: any) => {
                for (let x = 0; x < staffItem.sites.length; x++) {
                    for (let i = 0; i < sectionedList.length; i++) {
                        if (staffItem.sites[x] === sectionedList[i].code) {
                            return { ...staffItem, Location: sectionedList[i].title }
                        }
                        else {
                            return null
                        }
                    }
                }
            }).filter((a: any) => a !== null).sort((a: any, b: any) => a.LastName.localeCompare(b.LastName))

            const coordinatorTeam = coordinators.map((coordinatorItem: Coordinator) => {
                for (let x = 0; x < coordinatorItem.sites.length; x++) {
                    for (let i = 0; i < sectionedList.length; i++) {
                        if (coordinatorItem.sites[x] === sectionedList[i].code) {
                            return { ...coordinatorItem, Location: sectionedList[i].title };
                        }
                        else {
                            return null
                        }
                    }
                }
            }).filter((a: any) => a !== null).sort((a: any, b: any) => a.LastName.localeCompare(b.LastName))

            sectionedList[0].data = [...staffTeam, ...coordinatorTeam]
            const listOfSpeakers: any = await SpeakersService.loadSpeakersList()
            let staffName = "";
            for (let x = 0; x < sectionedList[0].data.length; x++) {
                for (let i = 0; i < listOfSpeakers.items.length; i++) {
                    staffName = sectionedList[0].data[x].FirstName + " " + sectionedList[0].data[x].LastName
                    if (staffName === listOfSpeakers.items[i].name)
                        sectionedList[0].data[x] = { ...sectionedList[0].data[x], Teacher: true }
                }
            }
            return sectionedList;
        } catch (error) {
            console.log(error)
        }
    }
    static loadCoordinatorsList = async (): Promise<any> => {
        try {
            const getSiteData: any = await fetch(`https://www.themeetinghouse.com/static/data/coordinators.json`)
            const pageContent = await getSiteData.json()
            const transformed = pageContent.map((coordinator: any) => {
                return { ...coordinator, Coordinator: true }
            })
            return transformed;
        } catch (error) {
            console.log(error)
        }
    }
}