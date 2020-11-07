import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, VirtualizedList } from 'react-native';
import StaffItem from "../staff/StaffItem";
import StaffDirectoryService from "../../services/StaffDirectoryService";

interface StaffList {
    sortByName: boolean
}
interface Staff {
    FirstName: string
    LastName: string
    Position: string
    Phone: string
    Email: string
    key: number
}
export default function StaffList({ sortByName }: StaffList): JSX.Element {
    const [staff, setStaff] = useState([]);
    useEffect(() => {
        const loadStaff = async () => {
            console.log("Fetching data from site")
            setStaff(await StaffDirectoryService.loadStaffList())
        }
        if (staff.length === 0)
            loadStaff()
    }, [])
    /* useEffect(() => {
    setStaff(sort())
    }, [sortByName]) */
    /*const sort = () => {
        if (sortByName) {
            return staff.sort(function (a: any, b: any) {
                return a.LastName > b.LastName;
            })
        } else {
            return staff
        }
    }*/
    const parseTelephone = (tel: string) => {
        const telephone = tel.split(',')[0].replace(/\D/g, '')
        const extension = tel.split(',')[1] ? tel.split(',')[1].replace(/\D/g, '') : ""
        if (telephone && extension) return telephone + "," + extension
        else return telephone
    }
    const getItem = (data: Staff, index: number) => {
        return {
            key: index.toString(),
            FirstName: staff[index].FirstName,
            LastName: staff[index].LastName,
            Email: staff[index].Email,
            Phone: parseTelephone(staff[index].Phone),
            Position: staff[index].Position
        }

    }

    const getItemCount = (data: any) => {
        return staff.length;
    }

    return (
        <SafeAreaView>
            <VirtualizedList
                data={staff}
                initialNumToRender={6}
                renderItem={({ item }) => <StaffItem key={item.key} staff={item}></StaffItem>}
                getItemCount={getItemCount}
                getItem={getItem}
                maxToRenderPerBatch={6}
                windowSize={2}
                removeClippedSubviews={true}
            />
        </SafeAreaView>
    )
}