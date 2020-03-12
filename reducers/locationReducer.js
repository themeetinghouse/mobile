
export function selectLocation(location){
    return {
        type: "LOCATION__SELECT_LOCATION",
        payload: {
            location: location
        }
    }
}

export function locationReducer(state = {location: { id: 'oakville', name: "Oakville (default)"}}, action){
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