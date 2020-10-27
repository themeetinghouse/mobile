import React from 'react';
import { Theme } from '../Theme.style';
import { View, Text } from "react-native"
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
    message: string;
}
export default function AnnouncementBar(props: Props): JSX.Element {

    const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
    const style = StyleSheet.create({
        container: {
            backgroundColor: Theme.colors.yellow,
            padding: 16,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            lineHeight: 2,
            zIndex: 1,
            marginBottom: -33
        },
        message: {
            color: Theme.colors.black,
            fontSize: 16
        }

    })
    return (
        <View style={style.container}>
            <Text onPress={() => navigation.push('LiveStreamScreen')} style={style.message}>{props.message}</Text>
        </View>

    )
}

