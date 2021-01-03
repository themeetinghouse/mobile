import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { Container, Text, Button, Content, View, Thumbnail } from 'native-base';
import moment from 'moment';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TeachingStackParamList } from '../../navigation/MainTabNavigator';
import { Theme, Style, HeaderStyle } from '../../Theme.style';
import WhiteButton from '../../components/buttons/WhiteButton';
import MiniPlayerStyleContext from '../../contexts/MiniPlayerStyleContext';

const style = StyleSheet.create({
  content: {
    ...Style.cardContainer,
    ...{
      backgroundColor: Theme.colors.black,
      padding: 16,
    },
  },
  header: Style.header,
  headerLeft: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerBody: {
    flexGrow: 3,
    justifyContent: 'center',
  },
  headerRight: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 50,
  },
  headerTitle: {
    ...HeaderStyle.title,
    ...{
      width: '100%',
    },
  },
  headerButtonText: HeaderStyle.buttonText,
  title: Style.title,
  body: Style.body,
  yearSection: {
    marginBottom: 32,
  },
  yearTitle: {
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.large,
    color: Theme.colors.white,
    marginBottom: 8,
  },
  monthItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  monthItem: {
    fontFamily: Theme.fonts.fontFamilyBold,
    fontSize: Theme.fonts.small,
    color: Theme.colors.white,
    textAlign: 'center',
    lineHeight: 40,
    backgroundColor: Theme.colors.gray2,
    borderWidth: 1,
    borderColor: Theme.colors.black,
  },
  monthItemHighlight: {
    backgroundColor: Theme.colors.white,
    color: Theme.colors.black,
  },
  monthHighlight: {
    borderWidth: 1,
    borderColor: Theme.colors.black,
    width: 0.22 * Dimensions.get('screen').width,
    marginRight: 3,
    marginBottom: 3,
  },
  monthHighlightSelected: {
    borderColor: Theme.colors.white,
  },
});

interface Params {
  navigation: StackNavigationProp<TeachingStackParamList>;
}

type Date = {
  year?: number;
  month?: number;
  selectNext?: boolean;
};

export default function DateRangeSelectScreen({
  navigation,
}: Params): JSX.Element {
  let currentYear = moment().get('year');
  const startYear = moment('2006').get('year');
  const years = [];
  while (currentYear >= startYear) years.push((currentYear -= 1));
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const [firstDate, setFirstDate] = useState<Date>({});
  const [secondDate, setSecondDate] = useState<Date>({});
  const miniPlayerStyle = useContext(MiniPlayerStyleContext);

  const { setDisplay } = miniPlayerStyle;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Date Range',
      headerTitleStyle: style.headerTitle,
      headerStyle: { backgroundColor: Theme.colors.background },
      headerLeft: function render() {
        return (
          <Button transparent onPress={() => navigation.goBack()}>
            <Thumbnail
              square
              accessibilityLabel="Close Date Range"
              source={Theme.icons.white.closeCancel}
              style={{ width: 24, height: 24 }}
            />
          </Button>
        );
      },
      headerLeftContainerStyle: { left: 16 },
      headerRight: function render() {
        return <View style={{ flex: 1 }} />;
      },
    });
  }, [navigation]);

  useEffect(() => {
    setDisplay('none');
  }, [setDisplay]);

  useEffect(() => {
    const unsub = navigation.addListener('blur', () => {
      setDisplay('flex');
    });
    return unsub;
  }, [navigation, setDisplay]);

  const selectDateItem = (year: number, month: number) => {
    if (!firstDate.year) {
      firstDate.selectNext = true;
    } else if (!secondDate.year) {
      secondDate.selectNext = true;
    }
    if (firstDate.selectNext) {
      setFirstDate({
        year,
        month,
        selectNext: !firstDate.selectNext,
      });
      setSecondDate({
        year: secondDate.year,
        month: secondDate.month,
        selectNext: !secondDate.selectNext,
      });
    } else if (secondDate.selectNext) {
      setSecondDate({
        year,
        month,
        selectNext: !secondDate.selectNext,
      });
      setFirstDate({
        year: firstDate.year,
        month: firstDate.month,
        selectNext: !firstDate.selectNext,
      });
    }
  };

  const isSelected = (year: number, month: number) => {
    return (
      (firstDate.year === year &&
        firstDate.month === month &&
        firstDate.selectNext) ||
      (secondDate.year === year &&
        secondDate.month === month &&
        secondDate.selectNext)
    );
  };

  const isBetween = (year: number, month: number) => {
    const thisMoment = moment()
      .startOf('month')
      .set('year', year)
      .set('month', month);
    const firstMoment = moment()
      .startOf('month')
      .set('year', firstDate.year || 1970)
      .set('month', firstDate.month || 0);
    const secondMoment = moment()
      .startOf('month')
      .set('year', secondDate.year || 1970)
      .set('month', secondDate.month || 0);
    // If only one is defined (first click), then we only care about an exact match
    if (!firstDate.year || !secondDate.year) {
      return thisMoment.isSame(firstMoment) || thisMoment.isSame(secondMoment);
    }
    return (
      (thisMoment.isSameOrAfter(firstMoment) &&
        thisMoment.isSameOrBefore(secondMoment)) ||
      (thisMoment.isSameOrAfter(secondMoment) &&
        thisMoment.isSameOrBefore(firstMoment))
    );
  };

  const saveAndClose = () => {
    let firstMoment = null;
    let secondMoment = null;
    if (firstDate.year && firstDate.month !== undefined)
      firstMoment = moment()
        .startOf('month')
        .set('year', firstDate.year)
        .set('month', firstDate.month);
    if (secondDate.year && secondDate.month !== undefined)
      secondMoment = moment()
        .startOf('month')
        .set('year', secondDate.year || 1970)
        .set('month', secondDate.month || 0);

    if (firstMoment && secondMoment) {
      if (firstMoment.isBefore(secondMoment)) {
        navigation.navigate('AllSermonsScreen', {
          startDate: firstMoment.format(),
          endDate: secondMoment.format(),
        });
      } else {
        navigation.navigate('AllSermonsScreen', {
          startDate: secondMoment.format(),
          endDate: firstMoment.format(),
        });
      }
    } else if (firstMoment) {
      navigation.navigate('AllSermonsScreen', {
        startDate: firstMoment.format(),
        endDate: firstMoment.format(),
      });
    } else if (secondMoment) {
      navigation.navigate('AllSermonsScreen', {
        startDate: secondMoment.format(),
        endDate: secondMoment.format(),
      });
    } else {
      navigation.navigate('AllSermonsScreen');
    }
  };

  return (
    <Container style={{ backgroundColor: 'black' }}>
      <Content style={style.content}>
        {years.map((year) => (
          <View key={`${year}`} style={style.yearSection}>
            <Text style={style.yearTitle}>{year}</Text>
            <View style={style.monthItemContainer}>
              {months.map((month, index) => (
                <TouchableOpacity
                  key={month + year}
                  style={[
                    style.monthHighlight,
                    isSelected(year, index) ? style.monthHighlightSelected : {},
                  ]}
                  onPress={() => {
                    selectDateItem(year, index);
                  }}
                >
                  <Text
                    style={[
                      style.monthItem,
                      isBetween(year, index) ? style.monthItemHighlight : {},
                    ]}
                  >
                    {moment().set('month', index).format('MMM')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </Content>
      <View
        style={{
          flexGrow: 0,
          paddingTop: 24,
          paddingBottom: 52,
          backgroundColor: '#111111',
          paddingHorizontal: '5%',
          zIndex: 10000,
        }}
      >
        <WhiteButton
          label="Save"
          onPress={() => saveAndClose()}
          style={{ height: 56 }}
        />
        <WhiteButton
          outlined
          label="Clear All"
          onPress={() => {
            setFirstDate({});
            setSecondDate({});
            navigation.navigate('AllSermonsScreen', {
              startDate: '',
              endDate: '',
            });
          }}
          style={{ marginTop: 16, height: 56 }}
        />
      </View>
    </Container>
  );
}
