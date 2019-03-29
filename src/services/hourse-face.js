import axios from "../utils/axios-utils";
import * as api from "../apis/index.js";
export function OmsHourseQuery(params) {
    return new Promise((resolve, reject) => {
        axios.post(api.OmsHouseQuery, params
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
export function OmsHouseDetail(params) {
    return new Promise((resolve, reject) => {
        axios.post(api.OmsHouseDetail + '?id=' + params.id
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
export function OmsHousePhysical(params) {
    return new Promise((resolve, reject) => {
        axios.post(api.OmsHousePhysical ,params
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
export function OmsHouseLive(params) {
    return new Promise((resolve, reject) => {
        axios.post(api.OmsHouseLive ,params
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
export function OmsHouseGetid(params) {
    return new Promise((resolve, reject) => {
        axios.post(api.OmsHouseGetid + '?id=' + params.id
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
export function CurrentLoginInformations(params) {
    return new Promise((resolve, reject) => {
        axios.post(api.CurrentLoginInformations ,params
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
