import React from 'react';
import { Theme } from '../../Theme.style';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    children: React.ReactNode;
}

export default function Header({ children }: Props): JSX.Element {

    const safeArea = useSafeAreaInsets();
    const { colors } = useTheme();


    return <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: safeArea?.top,
        backgroundColor: Theme.colors.background,
        borderBottomColor: colors.border,
        borderBottomWidth: StyleSheet.hairlineWidth
    }}>{children}</View>

}