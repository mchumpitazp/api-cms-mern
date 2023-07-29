import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';

export const fetchData = (token: string) => (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch(dataLoading());

    return fetch(baseUrl + '/data/', {
            headers: {
                'x-access-token': token
            }
        })
        .then(response => {
            if (response.ok)
                return response;
            else 
                throw Error('Error ' + response.status + ': ' + response.statusText);
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => response.json())
        .then(data => dispatch(addData(data)))
        .catch(error => dispatch(dataFailed(error.message)));
};

export const dataLoading = () => ({
    type: ActionTypes.DATA_LOADING
});

export const dataFailed = (errmess: any) => ({
    type: ActionTypes.DATA_FAILED,
    payload: errmess
});

export const addData = (files: any) => ({
    type: ActionTypes.ADD_DATA,
    payload: files
});