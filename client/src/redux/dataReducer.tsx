import * as ActionTypes from './ActionTypes';

export const dataReducer = (state = {
        isLoading: true,
        errMess: null,
        data: []
    }, action: any) => {
        
    switch(action.type) {
        case ActionTypes.ADD_DATA:
            return {...state, isLoading: false, errMess: null, data: action.payload};

        case ActionTypes.DATA_LOADING:
            return {...state, isLoading: true, errMess: null, data: []};

        case ActionTypes.DATA_FAILED:
            return {...state, isLoading: false, errMess: action.payload, data: []};

        default:
            return state;
    }
}