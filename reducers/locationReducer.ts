type selectLocationReturnType = {
    type: string;
    payload: {
        location: any;
    }
}


export function selectLocation(location: any): selectLocationReturnType {
    return {
        type: "LOCATION__SELECT_LOCATION",
        payload: {
            location: location
        }
    }
}

export function locationReducer(state = {location: { id: 'oakville', name: "Oakville (default)"}}, action: any): any{
    switch (action.type){
        case 'LOCATION__SELECT_LOCATION': {
            return {
                ...state,
                location: action.payload.location
            }
        }
        default:
            return state;
    }
}