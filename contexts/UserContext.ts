import { createContext } from 'react';

export type UserData = {
    sub: string;
    email_verified: boolean;
    email: string;
    'custom:home_site'?: string;
} | null

type UserContext = {
    userData: UserData;
    updateUser: (data: UserData) => void;
} | null

const UserContext = createContext<UserContext>({ userData: null, updateUser: () => null});
export default UserContext