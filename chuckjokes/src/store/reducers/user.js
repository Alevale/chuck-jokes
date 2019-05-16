import {login, getProfile, getUserCache, setUserCache} from '../services/users'
import {fetchJokes, buildFavoritesListFromServer} from '../reducers/jokes'
import {getToken, setToken} from '../services/localStorage'

const initState = {
    appUser: {},
    token: undefined,
    loading: true,
    finishLoading: false,
    loginFailed: false
}

export const LOGIN = 'LOGIN'
export const GOT_USER_FROM_TOKEN = 'GOT_USER_FROM_TOKEN'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const LOGIN_OK = 'LOGIN_OK'
export const GET_TOKEN_LOCALSTORAGE = 'GET_TOKEN_LOCALSTORAGE'
export const SET_TOKEN_LOCALSTORAGE = 'SET_TOKEN_LOCALSTORAGE'

export const logIn = (user) => ({ type: LOGIN, payload: user })
export const setUser = (user) => ({ type: GOT_USER_FROM_TOKEN, payload: user })
export const logInFailed = (err) => ({ type: LOGIN_FAILED, payload: err })
export const logInOk = (err) => ({ type: LOGIN_OK })
export const getTokenFromLocal = (token) => ({ type: GET_TOKEN_LOCALSTORAGE, payload: token })
export const setTokenLocalStorage = (token) => ({ type: SET_TOKEN_LOCALSTORAGE, payload: token })


export const saveStateInUserCache = () => {
    return (dispatch, getState) => {
        const token = getToken()

        if (token) {
            const state = getState()
            setUserCache(token, state)
        }
    }
}


export const getTokenLocally = () => {
    return (dispatch) => {
        const token = getToken()
        dispatch(getTokenFromLocal(token))
    }
}


export const getUser = (token) => {
    return (dispatch) => {
        return getProfile(token)
            .then((res) => {
                dispatch(setUser(res.user))
            })
    }
}

export const getUsersDataCached = (token) => {
    return (dispatch) => {
        return getUserCache(token)
            .then((res) => {
                dispatch(buildFavoritesListFromServer(res))
            })
    }
}

export const initializeApplication = () => {
    return (dispatch) => {
        const token = getToken()

        // NOTE: If there is a token, merge the favorites, and get the user 20190513:Alevale
        if (token) {
            dispatch(getUsersDataCached(token))
            dispatch(getUser(token))
        }

        dispatch(fetchJokes())
    }
}

export const loginUser = (username, password) => {
    return (dispatch) => {

        return login(username, password)
            .then((res) => {
                dispatch(setTokenLocalStorage(res.token))
                dispatch(logIn(res.user))
                dispatch(getUsersDataCached(res.token))
                dispatch(logInOk())
            })
            .catch((err) => {
                console.log(err)
                dispatch(logInFailed(err))
            })
    }
}

export default (state = initState, action) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, appUser: action.payload }
        case GOT_USER_FROM_TOKEN:
            return { ...state, appUser: action.payload }
        case LOGIN_FAILED:
            return { ...state, loginFailed: action.payload }
        case LOGIN_OK:
            return { ...state, loginFailed: false }
        case GET_TOKEN_LOCALSTORAGE:
            return { ...state, token: action.payload }
        case SET_TOKEN_LOCALSTORAGE:
            setToken(action.payload)
            return { ...state, token: action.payload }
        default:
            return state
    }
}
