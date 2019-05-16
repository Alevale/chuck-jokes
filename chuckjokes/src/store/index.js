import {createStore, applyMiddleware, combineReducers} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import jokesReducer from './reducers/jokes'
import userReducer from './reducers/user'

const reducer = combineReducers({
    joke: jokesReducer,
    user: userReducer,
})

const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)

export default store
