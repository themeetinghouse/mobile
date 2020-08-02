import React, { useState } from 'react';
import { Theme, Style } from '../Theme.style';
import { Container, Text, Button, Icon, Content, Left, Right, Header, View, Body } from 'native-base';
import moment from 'moment';
import { StatusBar, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { setSermonDateRange } from '../reducers/viewNavReducer';
import { connect } from 'react-redux';

const style = {
    content: [Style.cardContainer, {
        backgroundColor: Theme.colors.black,
        padding: 16
    }],
    header: [Style.header, {
    }],
    headerLeft: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50,
    },
    headerBody: {
        flexGrow: 3,
        justifyContent: "center",
    } as ViewStyle,
    headerRight: {
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 50
    },
    headerTitle: [Style.header.title, {
        width: "100%",
    }] as TextStyle,
    headerButtonText: [Style.header.buttonText, {}],
    title: [Style.title, {
    }],
    body: [Style.body, {
    }],

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
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    } as ViewStyle,
    monthItem: {
        fontFamily: Theme.fonts.fontFamilyBold,
        fontSize: Theme.fonts.small,
        color: Theme.colors.white,
        textAlign: "center",
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
        width: 85,
        marginRight: 3,
        marginBottom: 3,
    },
    monthHighlightSelected: {
        borderColor: Theme.colors.white,
    },
}

interface Params {
    navigation: any;
    startDate: string;
    endDate: string;
    dispatch: any;
}

function DateRangeSelectScreen({ navigation, startDate, endDate, dispatch }: Params) {

    let currentYear = moment().get("year");
    const startYear = moment(startDate || "2005-01-01").get("year");
    const years = [];
    while (currentYear >= startYear) years.push(currentYear--);
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    const [firstDate, setFirstDate] = useState<any>({});
    const [secondDate, setSecondDate] = useState<any>({});

    const selectDateItem = (year: number, month: number) => {
        console.log("DateRangeSelectScreen.selectDateItem(): firstDate = ", firstDate);
        console.log("DateRangeSelectScreen.selectDateItem(): secondDate = ", secondDate);
        if (!firstDate.year) {
            firstDate.selectNext = true;
        } else if (!secondDate.year) {
            secondDate.selectNext = true;
        }
        if (firstDate.selectNext) {
            setFirstDate({ year: year, month: month, selectNext: !firstDate.selectNext });
            setSecondDate({ year: secondDate.year, month: secondDate.month, selectNext: !secondDate.selectNext });
        } else if (secondDate.selectNext) {
            setSecondDate({ year: year, month: month, selectNext: !secondDate.selectNext });
            setFirstDate({ year: firstDate.year, month: firstDate.month, selectNext: !firstDate.selectNext });
        }
    }

    const isSelected = (year: number, month: number) => {
        return (firstDate.year === year && firstDate.month === month && firstDate.selectNext) || (secondDate.year === year && secondDate.month === month && secondDate.selectNext);
    }

    const isBetween = (year: number, month: number) => {
        const thisMoment = moment().startOf('month').set('year', year).set('month', month);
        const firstMoment = moment().startOf('month').set('year', firstDate.year || 1970).set('month', firstDate.month || 0);
        const secondMoment = moment().startOf('month').set('year', secondDate.year || 1970).set('month', secondDate.month || 0);
        // If only one is defined (first click), then we only care about an exact match
        if (!firstDate.year || !secondDate.year) {
            return thisMoment.isSame(firstMoment) || thisMoment.isSame(secondMoment);
        } else {
            return ((thisMoment.isSameOrAfter(firstMoment) && thisMoment.isSameOrBefore(secondMoment))
                || (thisMoment.isSameOrAfter(secondMoment) && thisMoment.isSameOrBefore(firstMoment)));
        }
    }

    const saveAndClose = () => {
        const firstMoment = moment().startOf('month').set('year', firstDate.year || 1970).set('month', firstDate.month || 0);
        const secondMoment = moment().startOf('month').set('year', secondDate.year || 1970).set('month', secondDate.month || 0);
        if (firstMoment.isBefore(secondMoment)) {
            dispatch(setSermonDateRange(firstMoment, secondMoment));
        } else {
            dispatch(setSermonDateRange(secondMoment, firstMoment));
        }
        navigation.goBack();
    }

    return (
        <Container>

            <Header style={style.header}>
                <StatusBar backgroundColor={Theme.colors.black} barStyle="default" />
                <Left style={style.headerLeft}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='close' />
                    </Button>
                </Left>
                <Body style={style.headerBody}>
                    <Text style={style.headerTitle}>Date Range</Text>
                </Body>
                <Right style={style.headerRight}>
                    <TouchableOpacity onPress={() => saveAndClose()}>
                        <Text style={style.headerButtonText}>Done</Text>
                    </TouchableOpacity>

                </Right>
            </Header>

            <Content style={style.content}>
                {years.map(year => (
                    <View key={year + ""} style={style.yearSection}>
                        <Text style={style.yearTitle}>{year}</Text>
                        <View style={style.monthItemContainer}>
                            {months.map((m, index) => (
                                <TouchableOpacity
                                    key={m + "" + index}
                                    style={[style.monthHighlight, isSelected(year, index) ? style.monthHighlightSelected : {}]}
                                    onPress={() => { selectDateItem(year, index) }}>
                                    <Text key={index + ""} style={[style.monthItem, isBetween(year, index) ? style.monthItemHighlight : {}]}>{moment().set("month", index).format("MMM")}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}
            </Content>
        </Container>
    )
}

function mapStateToProps(state: { viewNav: { sermonSearchStateDate: any; sermonSearchEndDate: any; }; }) {
    return {
        startDate: state.viewNav.sermonSearchStateDate,
        endDate: state.viewNav.sermonSearchEndDate,
    }
}

export default connect(mapStateToProps)(DateRangeSelectScreen);