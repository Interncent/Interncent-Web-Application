import axios from 'axios'
import jwtDecode from 'jwt-decode'
// axios.defaults.baseURL = 'https://kjsceconnect-backend.herokuapp.com'
axios.defaults.baseURL = 'http://localhost:3002'
var secureId = null;

export async function setTokenHeader(token) {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        secureId = await jwtDecode(localStorage.jwtToken)['_id'];
    } else {
        delete axios.defaults.headers.common["Authorization"];
        secureId = null;
    }
}

export async function apiCall(method, path, data) {
    return new Promise((resolve, reject) => {
        return axios[method](`/api/${secureId}${path}`, data)
            .then(res => {
                return resolve(res.data);
            }).catch(err => {
                return reject(err)
            })
    });
}
export function apiCallAuth(method, path, data) {

    return new Promise((resolve, reject) => {
        return axios[method](path, data)
            .then(res => {
                return resolve(res.data);
            }).catch(err => {
                return reject(err)
            })
    });
}