import { createContext } from 'react';
import { CognitoUser } from '@aws-amplify/auth';

export type UserData = {
  sub: string;
  // eslint-disable-next-line camelcase
  email_verified: boolean;
  email: string;
  'custom:home_location'?: string;
  'custom:preference_openBible'?: 'app' | 'web';
} | null;

type UserContext = {
  userData: UserData;
  setUserData: (data: UserData) => void;
};

const UserContext = createContext<UserContext>({
  userData: null,
  setUserData: () => null,
});

export default UserContext;

export interface TMHCognitoUser extends CognitoUser {
  attributes: UserData;
  username: string;
}
