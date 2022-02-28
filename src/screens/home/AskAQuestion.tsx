/* eslint-disable camelcase */
import React, { useLayoutEffect, useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Alert,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import { MainStackParamList } from '../../navigation/AppNavigator';
import { askQuestion } from '../../graphql/queries';
import WhiteButton from '../../components/buttons/WhiteButton';
import { AskQuestionQuery } from '../../services/API';
import UserContext from '../../contexts/UserContext';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    backgroundColor: Theme.colors.black,
    paddingTop: 80,
  },
  body: {
    ...Style.body,
    marginTop: 32,
    marginHorizontal: 16,
  },
  headingText: {
    color: Theme.colors.gray5,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  minorText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: Theme.colors.gray5,
  },
  header: Style.header,
  headerTitle: {
    ...HeaderStyle.title,
    fontSize: 16,
    marginLeft: Platform.OS === 'ios' ? 0 : -56,
  },
  input: {
    backgroundColor: Theme.colors.gray1,
    borderColor: Theme.colors.white,
    borderWidth: 3,
    height: 104,
    marginTop: 24,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emailInput: {
    backgroundColor: Theme.colors.gray1,
    borderColor: Theme.colors.white,
    borderWidth: 3,
    marginTop: 8,
    paddingHorizontal: 20,
    color: 'white',
    height: 56,
    fontSize: 16,
  },
});

interface Params {
  navigation: StackNavigationProp<MainStackParamList, 'AskAQuestion'>;
}

export default function AskAQuestion({ navigation }: Params): JSX.Element {
  const userContext = useContext(UserContext);
  const { userData } = userContext;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Send In A Question',
      headerTitleStyle: { ...style.headerTitle },
      headerTransparent: true,
      headerStyle: { backgroundColor: Theme.colors.black },
      headerLeft: function render() {
        return (
          <TouchableOpacity
            style={{ padding: 16, marginLeft: -16, zIndex: 1 }}
            onPress={() => navigation.goBack()}
          >
            <Image
              accessibilityLabel="close icon"
              source={Theme.icons.white.closeCancel}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        );
      },
      headerLeftContainerStyle: { left: 16 },
    });
  }, [navigation]);
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userData?.email) {
      setEmail(userData.email);
    }
  }, [userData?.email]);

  const submitQuestion = async () => {
    const regex = /\S+@\S+\.\S+/;
    if (email && regex.test(email)) {
      if (question.length < 11) {
        Alert.alert(
          'An error occurred',
          'Question must be longer than 10 characters.'
        );
        return;
      }
      const variables = { email, body: question };
      const response = (await API.graphql(
        graphqlOperation(askQuestion, variables)
      )) as GraphQLResult<AskQuestionQuery>;
      const failure = Boolean(response?.data?.askQuestion?.err);
      if (!failure) {
        navigation.navigate('Main', {
          screen: 'Home',
          params: { screen: 'HomeScreen', params: { questionResult: true } },
        });
      } else {
        Alert.alert('An error occurred', 'Please try again later.');
      }
    } else {
      Alert.alert('An error occurred', 'Please enter a valid email address');
    }
  };

  return (
    <ScrollView style={style.content}>
      <View style={style.body}>
        <Text style={style.headingText}>
          Questions submitted here will have the chance to be answered this week
          after the sermon during our Q&A time.
        </Text>
        <TextInput
          accessibilityLabel="Question Description"
          keyboardAppearance="dark"
          autoFocus
          placeholder={"Ask whatever you'd like..."}
          placeholderTextColor="#646469"
          textContentType="none"
          keyboardType="default"
          value={question}
          multiline
          textAlignVertical="top"
          onChange={(e) => setQuestion(e.nativeEvent.text)}
          maxLength={1500}
          autoCapitalize="sentences"
          style={style.input}
        />
        <TextInput
          accessibilityLabel="Email Address"
          keyboardAppearance="dark"
          placeholder="Email"
          placeholderTextColor="#646469"
          textContentType="emailAddress"
          keyboardType="email-address"
          value={email}
          onChange={(e) => setEmail(e.nativeEvent.text.toLowerCase())}
          style={style.emailInput}
        />
        <Text style={style.minorText}>
          We do our best to answer as many questions as possible, but we cannot
          guarantee that we’ll be able to get to yours.
        </Text>
        <WhiteButton
          style={{ height: 56, marginVertical: 40 }}
          label="Submit a Question"
          onPress={submitQuestion}
        />
      </View>
    </ScrollView>
  );
}
