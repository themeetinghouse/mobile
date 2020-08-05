import React, { useState } from 'react'
import { Authenticator } from 'aws-amplify-react-native';
import Login from './Login';
import ForgotPassword from './ForgotPassword'
import ConfirmSignUp from './ConfirmSignUp'

interface Props {
    navigation: any;
}

export default function Auth(props: Props): JSX.Element {

    const [authState, setAuthState] = useState('');

    return <Authenticator hideDefault={true} usernameAttributes='email'>
        <Login {...props} onStateChange={(authState) => setAuthState(authState)} authState={authState} />
        <ForgotPassword onStateChange={(authState) => setAuthState(authState)} authState={authState} />
        <ConfirmSignUp onStateChange={(authState) => setAuthState(authState)} authState={authState} />
    </Authenticator>
}


