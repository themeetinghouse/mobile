import moment from 'moment-timezone';
import { HomeChurch } from './HomeChurchScreen';

export const getDayOfWeek = (homechurch: HomeChurch): string => {
  if (homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly)
    if (
      homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
        ?.occurOnSunday
    )
      return 'Sunday';
    else if (
      homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
        ?.occurOnMonday
    )
      return 'Monday';
    else if (
      homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
        ?.occurOnTuesday
    )
      return 'Tuesday';
    else if (
      homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
        ?.occurOnWednesday
    )
      return 'Wednesday';
    else if (
      homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
        ?.occurOnThursday
    )
      return 'Thursday';
    else if (
      homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
        ?.occurOnFriday
    )
      return 'Friday';
    else if (
      homechurch?.schedule?.recurrences?.recurrence?.recurrenceWeekly
        ?.occurOnSaturday
    )
      return 'Saturday';
    else return moment(homechurch.startDate).format('dddd');
  else return moment(homechurch?.startDate).format('dddd');
};

export const getTimeStamp = (homeChurch: HomeChurch) => {
  const timeInEST = moment(homeChurch?.schedule?.startTime);
  return moment() < moment().isoWeekday(getDayOfWeek(homeChurch))
    ? moment
        .tz('America/Toronto')
        .isoWeekday(getDayOfWeek(homeChurch))
        .set({
          hour: timeInEST.get('hour'),
          minute: timeInEST.get('minute'),
          second: timeInEST.get('second'),
        })
    : moment
        .tz('America/Toronto')
        .isoWeekday(getDayOfWeek(homeChurch))
        .add(7, 'days')
        .set({
          hour: timeInEST.get('hour'),
          minute: timeInEST.get('minute'),
          second: timeInEST.get('second'),
        });
};
