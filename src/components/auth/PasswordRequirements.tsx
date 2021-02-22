import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Theme } from '../../Theme.style';

interface PasswordIconProps {
  meetsRequirement: boolean;
  requirement: string;
}

function PasswordRequirement({
  meetsRequirement,
  requirement,
}: PasswordIconProps) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        backgroundColor: Theme.colors.grey1,
        paddingRight: 10,
        paddingLeft: 6,
        borderRadius: 40,
        marginRight: 8,
        paddingVertical: 4,
      }}
    >
      {meetsRequirement ? (
        <Entypo name="check" size={14} color={Theme.colors.green} />
      ) : (
        <Entypo name="cross" size={14} color={Theme.colors.red} />
      )}
      <Text
        style={{
          color: 'white',
          fontFamily: Theme.fonts.fontFamilyRegular,
          fontSize: 14,
          marginLeft: 4,
        }}
      >
        {requirement}
      </Text>
    </View>
  );
}

interface Props {
  password: string;
  style?: StyleProp<ViewStyle>;
}

export default function PasswordRequirements({
  password,
  style,
}: Props): JSX.Element {
  return (
    <View
      style={[
        style,
        {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: 12,
        },
      ]}
    >
      <Text
        style={{
          color: 'white',
          fontFamily: Theme.fonts.fontFamilyBold,
          fontSize: 14,
          marginRight: 8,
        }}
      >
        Password must contain at least:
      </Text>
      <PasswordRequirement
        meetsRequirement={password.length >= 8}
        requirement="8 characters"
      />
      <PasswordRequirement
        meetsRequirement={/(?=.*[A-Z])/.test(password)}
        requirement="upper &amp; lowercase letters"
      />
      <PasswordRequirement
        meetsRequirement={/(?=.*[0-9])/.test(password)}
        requirement="1 number"
      />
      <PasswordRequirement
        // eslint-disable-next-line no-useless-escape
        meetsRequirement={/(?=.*[\=\+\$\*\.\,\?\"\!\@\#\%\&\'\:\;\[\]\{\}\(\)\/\\\>\<\|\_\~\`\^\-])/.test(
          password
        )}
        requirement="1 special character (e.g. @ ! $ ^ ?)"
      />
    </View>
  );
}
