
export function setSermonDateRange(startDate, endDate){
    return {
        type: "NAV__SET_SERMON_DATE_RANGE",
        payload: {
            dateStart: startDate,
            dateEnd: endDate,
        }
    }
}

export function viewNavReducer(state = {}, action){
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