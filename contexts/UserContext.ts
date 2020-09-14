import { createContext } from 'react';

export type UserData = {
    sub: string;
    email_verified: boolean;
    email: string;
    'custom:home_location'?: string;
    'custom:preference_openBible'?: 'app' | 'web';
} | null

type UserContext = {
    userData: UserData;
    setUserData: (data: UserData) => void;
} | null

const UserContext = createContext<UserContext>({ userData: null, setUserData: () => null });
export default UserContext