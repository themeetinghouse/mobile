import React from 'react';
import { View, Button, Right, Thumbnail, Text } from 'native-base';
import { Theme, Style } from '../../Theme.style';
import { TouchableOpacity } from 'react-native';

const style = {
    container: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    button: {
        backgroundColor: Theme.colors.transparent,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        
    },
    icon: {
        marginLeft: 0,
    },
    iconRight: {
        width: Theme.icons.width,
        height: Theme.icons.height,
        marginRight: 15
    },
    label: {
        borderBottomColor: Theme.colors.white,
        borderBottomWidth: 1,
        paddingTop: 3,
        paddingBottom: 3,
        marginLeft: 15,
        marginRight: 15,
        color: Theme.colors.white,
    }
}



export default function IconButton(props){
    return (
        <View style={[style.container, props.style]}>
            <TouchableOpacity style={style.button} onPress={props.onPress}>
                { props.icon && 
                    <Thumbnail square source={props.icon} style={[Style.icon, style.icon]}></Thumbnail>
                }
                <View>
                    <Text style={[style.label, (props.style && props.style.label) || {}]}>{props.label}</Text>
                </View>
                { props.rightArrow && 
                    <Right>
                        <Thumbnail source={Theme.icons.white.arrow} style={style.iconRight}></Thumbnail>
                    </Right>
                }
            </TouchableOpacity>
        </View>
    )
}