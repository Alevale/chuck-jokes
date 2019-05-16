import reducer, {buildFavoritesListFromServer} from '../jokes'
import {joke1, joke2} from './examples'

describe('Joke Reducer', () => {

    it('returns an initial state when passed undefined', () => {
        const result = reducer(undefined, { type: 'ANYTHING' })
        expect(result).toMatchSnapshot()
    })

    it('removes a panel when made to be toggled', () => {
        const startState = {
            expanded: [
                'panel1', 'panel2'
            ]
        }
        const action = { type: 'TOGGLE_PANEL', payload: 'panel1' }
        const result = reducer(startState, action)
        expect(result).toMatchSnapshot()
    })

    it('adds a favorite joke', () => {
        const startState = {
            jokes: [],
            favoriteJokes: []
        }
        const action = { type: 'ADD_FAVORITE_JOKE', payload: joke1 }
        const result = reducer(startState, action)
        expect(result).toMatchSnapshot()
    })

    it('adds a joke to the favorite list and removes it from the jokes list', () => {
        const startState = {
            jokes: [joke1],
            favoriteJokes: []
        }
        const action = { type: 'ADD_FAVORITE_JOKE', payload: joke1 }
        const result = reducer(startState, action)
        expect(result).toMatchSnapshot()
    })

    it('merges the local favorites with the user cached favorites', () => {
        const startState = {
            favoriteJokes: [joke1]
        }
        const userCache = {
            result: {
                joke: {
                    favoriteJokes: [joke2]
                }
            }
        }
        const dispatch = jest.fn()
        const getState = jest.fn()
        getState.mockReturnValueOnce({
            joke: startState
        })
        const result = buildFavoritesListFromServer(userCache)(dispatch, getState)
        expect(dispatch).toMatchSnapshot()
        expect(result).toMatchSnapshot()
    })

    it('merges the local favorites with the user cached favorites but does not create duplicates', () => {
        const startState = {
            favoriteJokes: [joke1]
        }
        const userCache = {
            result: {
                joke: {
                    favoriteJokes: [joke1]
                }
            }
        }
        const dispatch = jest.fn()
        const getState = jest.fn()
        getState.mockReturnValueOnce({
            joke: startState
        })
        const result = buildFavoritesListFromServer(userCache)(dispatch, getState)
        expect(dispatch).toMatchSnapshot()
        expect(result).toMatchSnapshot()
    })

})
