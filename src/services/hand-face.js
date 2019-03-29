import axios from "../utils/axios-utils";
import * as api from "../apis/index.js";
export function OmsHandOverSave(params) {
    return new Promise((resolve, reject) => {
        axios.post(api.OmsHandOverSave, params
        ).then(response => {
            resolve(response.data);
        }, err => {
            resolve(err);
        })
            .catch((error) => {
                resolve(error);
            })
    })
}
export function OmsHandOverShow(params) {
    return new Promise((resolve, reject) => {
        axios.post(api.OmsHandOverQuery, params
        ).then(response => {
            resolve(response.data);
        }, err => {
            resolve(err);
        })
            .catch((error) => {
                resolve(error);
            })
    })
}