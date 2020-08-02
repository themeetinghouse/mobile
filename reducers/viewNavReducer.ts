import { Moment } from 'moment'

type setSermonDateRangeReturn = {
    type: string;
    payload: {
        dateStart: Moment,
        dateEnd: Moment,
    }
}

export function setSermonDateRange(startDate: Moment, endDate: Moment): setSermonDateRangeReturn {
    return {
        type: "NAV__SET_SERMON_DATE_RANGE",
        payload: {
            dateStart: startDate,
            dateEnd: endDate,
        }
    }
}

export function viewNavReducer(state = {}, action: setSermonDateRangeReturn): any {
    switch (action.type){
        case "NAV__SET_SERMON_DATE_RANGE":
            return {
                ...state,
                sermonSearchDateStart: action.payload.dateStart,
                sermonSearchDateEnd: action.payload.dateEnd,
            }
        default: {
            return {
                ...state
            }
        }
    }
}