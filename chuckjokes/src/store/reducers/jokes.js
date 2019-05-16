import {getJokes} from '../services/jokes'
import uniqBy from 'lodash/uniqBy'

const initState = {
    expanded: ['panel1', 'panel2'],
    jokes: [],
    loading: true,
    intervalActive: undefined,
    favoriteJokes: [],
    page: 0,
}

export const LOAD_JOKES = 'LOAD_JOKES'
export const ADD_FAVORITE_JOKE = 'ADD_FAVORITE_JOKE'
export const REPLACE_FAVORITE_JOKE = 'REPLACE_FAVORITE_JOKE'
export const TOGGLE_PANEL = 'TOGGLE_PANEL'
export const REMOVE_FAVORITE_JOKE = 'REMOVE_FAVORITE_JOKE'
export const SET_ACTIVE_INTEVAL = 'SET_ACTIVE_INTEVAL'
export const REMOVE_ACTIVE_INTEVAL = 'REMOVE_ACTIVE_INTEVAL'
export const PAGE_UP = 'PAGE_UP'
export const PAGE_DOWN = 'PAGE_DOWN'

export const loadJokes = (jokes) => ({ type: LOAD_JOKES , payload: jokes })
export const addJoke = (joke) => ({ type: ADD_FAVORITE_JOKE , payload: joke })
export const replaceFavoriteJokes = (jokes) => ({ type: REPLACE_FAVORITE_JOKE , payload: jokes })
export const removeJoke = (joke) => ({ type: REMOVE_FAVORITE_JOKE, payload: joke })
export const togglePanels = (panel) => ({ type: TOGGLE_PANEL, payload: panel })
export const setActiveInterval = (interval) => ({ type: SET_ACTIVE_INTEVAL, payload: interval })
export const removeActiveInterval = () => ({ type: REMOVE_ACTIVE_INTEVAL })
export const pageUp = (page) => ({ type: PAGE_UP , payload: page })
export const pageDown = (page) => ({ type: PAGE_DOWN , payload: page })

export const fetchJokes = () => {
    return (dispatch) => {
        getJokes()
            .then(jokes => dispatch(loadJokes(jokes)))
    }
}

export const buildFavoritesListFromServer = (userItems) => {
    return (dispatch, getState) => {
        const {favoriteJokes} = getState().joke
        if (userItems.result && userItems.result.joke && userItems.result.joke.favoriteJokes) {
            // NOTE: Do this so that if there were favoriteJokes they are all added 20190506:Alevale
            const favs = favoriteJokes.concat(userItems.result.joke.favoriteJokes)
            dispatch(replaceFavoriteJokes(uniqBy(favs, 'id')))
        }
    }
}

export const addFavoriteJokeOnIntervals = () => {
    return (dispatch, getState) => {
        const { intervalActive } = getState().joke
        if (!intervalActive) {
            const tempInterval = setInterval(() => {
                const { intervalActive, favoriteJokes } = getState().joke
                if (favoriteJokes.length >= 10) {
                    clearInterval(intervalActive)
                } else {
                    getJokes(1)
                        .then(joke => dispatch(addJoke(joke)))
                }
            }, 5000)
            dispatch(setActiveInterval(tempInterval))
            getJokes(1)
                .then(joke => dispatch(addJoke(joke)))
        } else {
            clearInterval(intervalActive)
            dispatch(removeActiveInterval())
        }
    }
}

const addToFavorites = (state, joke) => {
    const { jokes, favoriteJokes } = state
    return {
        ...state,
        jokes: jokes.filter((j) => j.id !== joke.id),
        favoriteJokes: uniqBy(favoriteJokes.concat(joke), 'id')
    }
}

const removeFromFavorites = (state, joke) => {
    const { jokes, favoriteJokes } = state
    return {
        ...state,
        favoriteJokes: uniqBy(favoriteJokes.filter((j) => j.id !== joke.id), 'id'),
        jokes: uniqBy(jokes.concat(joke), 'id')
    }
}

const togglePanel = (state, panel) => {
    const { expanded } = state
    return {
        ...state,
        expanded: expanded.includes(panel) ? expanded.filter((i) => i !== panel) : expanded.concat(panel)
    }
}

export default (state = initState, action) => {
    switch (action.type) {
        case LOAD_JOKES:
            return { ...state, jokes: action.payload, loading: false }
        case ADD_FAVORITE_JOKE:
            return addToFavorites(state, action.payload)
        case TOGGLE_PANEL:
            return togglePanel(state, action.payload)
        case REPLACE_FAVORITE_JOKE:
            return {...state, favoriteJokes: action.payload}
        case REMOVE_FAVORITE_JOKE:
            return removeFromFavorites(state, action.payload)
        case SET_ACTIVE_INTEVAL:
            return {...state, intervalActive: action.payload}
        case REMOVE_ACTIVE_INTEVAL:
            return {...state, intervalActive: undefined}
        case PAGE_UP:
            return { ...state, page: state.page + 1 }
        case PAGE_DOWN:
            return { ...state, page: state.page - 1 }
        default:
            return state
    }
}
