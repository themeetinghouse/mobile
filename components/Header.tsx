import React from 'react';
import { Platform, ViewStyle } from 'react-native';
import { Header } from 'native-base';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    children: React.ReactNode;
    style: ViewStyle;
    doNotRemoveSafeArea?: boolean;
}

export default function CustomHeader(props: Props): JSX.Element {

    const insets = useSafeAreaInsets();

    const getDefaultHeaderHeight = (
        statusBarHeight: number
    ): number => {
        let headerHeight;

        if (Platform.OS === 'ios') {
            headerHeight = 44;
        } else if (Platform.OS === 'android') {
            headerHeight = 56;
        } else {
            headerHeight = 64;
        }

        return headerHeight - statusBarHeight;
    };

    const height = getDefaultHeaderHeight(props.doNotRemoveSafeArea ? 0 : insets.top);

    return <Header style={[{ height: height }, props.style]}>{props.children}</Header>
}