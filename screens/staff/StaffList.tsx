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
            setStaff(await StaffDirectoryService.loadStaffList())
        }
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
        tel = tel.replace(/\D/g, '');
        if (tel.length === 10) return tel;
        if (tel.length)
            console.log(tel)
        return tel;
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