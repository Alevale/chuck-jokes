import React from 'react'
import chuck from './chuck.jpg'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import uniqBy from 'lodash/uniqBy'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Switch from '@material-ui/core/Switch'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'

import './App.css'

import ChuckJoke from './components/ChuckJoke'
import Header from './components/Header'
import Pagination from './components/Pagination'

const saveTokenLocally = (token) => {
    if (!token) {
        throw new Error('Missing token')
    }
    localStorage.setItem('CHUCK_JOKE_token', token)
}

const getTokenLocally = () => {
    return localStorage.getItem('CHUCK_JOKE_token')
}

const parseRequest = (res) => {
    if (res.status >= 400 && res.status < 600) {
        throw new Error('Bad response from server')
    }
    return res.json()
}

const login = (username, password) => {
    if (!username || !password) {
        throw new Error('Missing username or password')
    }

    const url = 'http://localhost:3000/login'

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(parseRequest)
      .then(response => {
          return response
      })
      .catch(error => {
          console.error('Error:', error)
          return Promise.reject(error)
      })
}

const setUserCache = (token, state) => {
    if (token) {
        const url = 'http://localhost:3000/cache/set'

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(state),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    }
}

const getUserCache = (token) => {
    if (token) {
        return fetch('http://localhost:3000/cache/get', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => result.json())
            .then(items => {
                return items
            })
    }
}

const getProfile = (token) => {
    if (token) {
        return fetch('http://localhost:3000/api/v1/users/myprofile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => result.json())
            .then(res => {
                return res
            })
    }
}

const styles = theme => ({
    root: {
        width: '80%',
        margin: '75px auto'
    },
    grow: {
        flexGrow: 1,
    },
    secondaryHeading: {
        color: theme.palette.text.secondary
    }
})

class App extends React.Component {

    componentDidUpdate() {
        this.saveStateInServer()
    }

    componentDidMount() {
        const token = getTokenLocally()
        if (token) {
            this.buildFavoritesListFromServer(token)
            this.getUser(token)
        }
        fetch('http://localhost:3000/api/v1/jokes/random/10')
            .then(result => result.json())
            .then(items => {
                this.setState({
                    jokes: items.data.value,
                    loading: false
                })
            })
    }

    state = {
        appUser: {},
        expanded: ['panel1', 'panel2'],
        jokes: [],
        token: undefined,
        loading: true,
        finishLoading: false,
        favoriteJokes: [],
        page: 0,
    }

    buildFavoritesListFromServer = (token) => {
        return getUserCache(token)
            .then((items) => {
                if (items.result && items.result.favoriteJokes) {
                    // NOTE: Do this so that if there were favoriteJokes they are all added 20190506:Alevale
                    const favs = this.state.favoriteJokes.concat(items.result.favoriteJokes)
                    this.setState({
                        favoriteJokes: uniqBy(favs, 'id'),
                        finishLoading: true
                    })
                } else {
                    this.setState({
                        finishLoading: true
                    })
                }
            })
    }

    getUser = (token) => {
        return getProfile(token)
            .then((res) => {
                this.setState({
                    appUser: res.user
                })
            })
    }

    saveStateInServer = () => {
        const { finishLoading } = this.state
        if (finishLoading) {
            const token = getTokenLocally()
            setUserCache(token, this.state)
        }
    }

    loginUser = (username, password) => {
        return login(username, password)
            .then((res) => {
                saveTokenLocally(res.token)
                this.setState({
                    appUser: res.user
                })
                this.buildFavoritesListFromServer(res.token)
            })
            .catch((err) => {
                this.setState({
                    loginFailed: true
                })
            })
    }

    togglePanels = panel => () => {
        const { expanded } = this.state
        this.setState({
            expanded: expanded.includes(panel) ? expanded.filter((i) => i !== panel) : expanded.concat(panel)
        })
    }

    addToFavorites = (joke) => () => {
        const { jokes, favoriteJokes } = this.state
        this.setState({
            jokes: jokes.filter((j) => j.id !== joke.id),
            favoriteJokes: uniqBy(favoriteJokes.concat(joke), 'id')
        })
    }

    removeFromFavorites = (joke) => () => {
        const { jokes, favoriteJokes } = this.state
        this.setState({
            favoriteJokes: uniqBy(favoriteJokes.filter((j) => j.id !== joke.id), 'id'),
            jokes: uniqBy(jokes.concat(joke), 'id')
        })
    }

    add1RandomJoke = () => {
        return fetch('http://localhost:3000/api/v1/jokes/random/1')
            .then(result => result.json())
            .then(items => {
                const { favoriteJokes } = this.state
                this.setState({
                    favoriteJokes: uniqBy(favoriteJokes.concat(items.data.value[0]), 'id')
                })
            })
    }

    addJokesOnInterval = () => {
        const { interval } = this.state
        if (!interval) {
            this.add1RandomJoke()
            const tempInterval = setInterval(() => {
                const { favoriteJokes, interval } = this.state
                if (favoriteJokes.length < 10) {
                    this.add1RandomJoke()
                } else {
                    clearInterval(interval)
                }
            }, 5000)
            this.setState({
                interval: tempInterval
            })
            // NOTE: If there was already an interval remove it so it stops adding jokes 20190502:Alevale
        } else {
            clearInterval(interval)
            this.setState({
                interval: undefined
            })
        }
    }

    render() {
        const { classes } = this.props
        const { expanded, jokes, favoriteJokes, loading, page, appUser } = this.state
        return (
            <div>
                <Header appUser={appUser} logIn={ this.loginUser } />
                <Grid container
                      direction="row"
                      justify="space-around"
                      alignItems="center"
                      spacing={ 24 }
                      className={ classes.root }>
                    { loading ?
                        <img src={ chuck } className='spinner' alt="chuck"/>
                        :
                        <div>
                            <Grid container
                                  direction="column"
                                  justify="space-between"
                                  alignItems="center"
                                  wrap="nowrap"
                                  spacing={ 8 }>
                                <Grid item xs={ 12 }>
                                    Add a joke every 5 seconds until you have 10
                                    <Switch onChange={ this.addJokesOnInterval }
                                            disabled={ favoriteJokes.length >= 10 }/>
                                </Grid>
                            </Grid>
                            <ExpansionPanel expanded={ expanded.includes('panel1') }
                                            onChange={ this.togglePanels('panel1') }>
                                <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon/> }>
                                    <Grid item xs={ 4 }>
                                        Random jokes
                                    </Grid>
                                    <Grid item className={ classes.secondaryHeading } xs={ 8 }>
                                        List of random jokes about Chuck Norris
                                    </Grid>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container
                                          direction="column"
                                          justify="space-between"
                                          alignItems="center"
                                          wrap="nowrap"
                                          spacing={ 8 }>
                                        {
                                            jokes.map(joke => (
                                                <ChuckJoke joke={ joke.joke } isFavorite={ false } key={ joke.id }
                                                           favoriteClicked={ this.addToFavorites(joke) }/>
                                            ))
                                        }
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={ expanded.includes('panel2') }
                                            onChange={ this.togglePanels('panel2') }>
                                <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon/> }>
                                    <Grid item xs={ 4 }>
                                        Favorite jokes
                                    </Grid>
                                    <Grid item className={ classes.secondaryHeading } xs={ 8 }>
                                        Here you have your favorite jokes
                                    </Grid>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container
                                          direction="column"
                                          wrap="nowrap"
                                          spacing={ 8 }>
                                        {
                                            favoriteJokes.length < 1 ?
                                                <Grid item xs={ 12 }>
                                                    Seems like you don't have any favorite joke, mark some in the random
                                                    tab, or
                                                    add some random ones
                                                </Grid>
                                                :
                                                favoriteJokes.slice(page * 10, ((page + 1) * 10)).map(joke => (
                                                    <ChuckJoke joke={ joke.joke } isFavorite={ true } key={ joke.id }
                                                               favoriteClicked={ this.removeFromFavorites(joke) }/>
                                                ))
                                        }
                                        <Pagination pageUp={ () => {
                                            this.setState({ page: (page + 1) })
                                        } } pageDown={ () => {
                                            this.setState({ page: (page - 1) })
                                        } } page={ page } favoriteJokes={ favoriteJokes }/>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </div>
                    }
                </Grid>
            </div>
        )
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App)
