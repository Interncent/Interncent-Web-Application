import { apiCallAuth, apiCall } from '../../services/api'
import { SET_CURRENT_USER, UPDATE_USER_REFRESH } from '../actionTypes'
import { setTokenHeader } from '../../services/api'

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    }
}
export function setAuthorizationHeader(token) {
    setTokenHeader(token);
}

export function logout() {
    return async dispatch => {
        await dispatch(setCurrentUser({}));
        setAuthorizationHeader(false);
        localStorage.clear();
        localStorage.setItem('isAuthenticated', false);
    }
}

export function authUser(emailToken) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCallAuth('get', '/api/auth/verify-email/' + emailToken, '')
                .then(({ token, ...user }) => {
                    localStorage.setItem("jwtToken", token);
                    localStorage.setItem('isAuthenticated', true);
                    setAuthorizationHeader(token);
                    dispatch(setCurrentUser(user));
                    resolve();
                })
                .catch(err => reject(err));
        });
    };
}
export function loginUser(user) {
    return dispatch => {
        return new Promise((resolve, reject) => {
            return apiCallAuth('post', '/api/auth/signin', user)
                .then(async ({ token, ...user }) => {
                    localStorage.setItem("jwtToken", token);
                    localStorage.setItem('isAuthenticated', true);
                    await setAuthorizationHeader(token);
                    console.log("Logeed iN and added token");
                    dispatch(setCurrentUser(user));
                    resolve();
                })
                .catch(err => reject(err));
        })
    }
}

function userRefresh(user) {
    return {
        type: UPDATE_USER_REFRESH,
        user
    }
}


export function updateRefresh(username) {
    return dispatch => {
        return new Promise((res, rej) => {
            return apiCall('get', "/user/" + username, '')
                .then((data) => {
                    dispatch(userRefresh(data));
                    res();
                }).catch((err) => {
                    rej(err);
                });
        })
    }
}

