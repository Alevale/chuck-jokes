import React, {Component} from 'react'
import chuck from './chuck.jpg'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Refresh from '@material-ui/icons/Refresh'
import Snackbar from '@material-ui/core/Snackbar'

import './App.css'

import ChuckJoke from './components/ChuckJoke'
import AddJokesInterval from './components/AddJokesInterval'
import Header from './components/Header'
import Pagination from './components/Pagination'
import connect from 'react-redux/es/connect/connect'
import {logIn, getTokenLocally, initializeApplication, saveStateInUserCache} from './store/reducers/user'
import {fetchJokes, togglePanels} from './store/reducers/jokes'

const styles = theme => ({
    root: {
        width: '80%',
        margin: '75px auto'
    },
    grow: {
        flexGrow: 1
    },
    secondaryHeading: {
        color: theme.palette.text.secondary
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    }
})

class App extends Component {

    componentDidUpdate() {
        this.props.saveStateInUserCache()
    }

    componentDidMount() {
        this.props.initializeApplication()
    }

    render() {
        const { classes, favoriteJokes, jokes, loading, page, fetchJokes, togglePanels, expanded, loginFailed } = this.props
        return (
            <div>
                <Header/>
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
                            <Snackbar
                                anchorOrigin={ {
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                } }
                                open={ !!loginFailed }
                                autoHideDuration={ 6000 }
                                message={ <span id="message-id">Wrong username or password</span> }
                            />
                            <AddJokesInterval/>
                            <ExpansionPanel expanded={ expanded.includes('panel1') }
                                            onChange={ () => {
                                                togglePanels('panel1')
                                            } }>
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
                                            jokes.length < 1 ?
                                                <div>
                                                    <Grid item xs={ 12 }>
                                                        Just hit on the refresh button below to load more jokes
                                                    </Grid>
                                                    <Grid container justify="center" alignItems="center">
                                                        <IconButton aria-label="Reload" onClick={ fetchJokes }
                                                                    color="primary">
                                                            <Refresh data-test="reload"/>
                                                        </IconButton>
                                                    </Grid>
                                                </div>
                                                :
                                                jokes.map(joke => (
                                                    <ChuckJoke joke={ joke } isFavorite={ false } key={ joke.id }/>
                                                ))
                                        }
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={ expanded.includes('panel2') }
                                            onChange={ () => {
                                                togglePanels('panel2')
                                            } }>
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
                                                    <ChuckJoke joke={ joke } isFavorite={ true } key={ joke.id }/>
                                                ))
                                        }
                                        <Pagination/>
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

export default connect(
    (state) => ({
        favoriteJokes: state.joke.favoriteJokes,
        jokes: state.joke.jokes,
        page: state.joke.page,
        loading: state.joke.loading,
        expanded: state.joke.expanded,
        loginFailed: state.user.loginFailed
    }),
    { logIn, fetchJokes, getTokenLocally, initializeApplication, saveStateInUserCache, togglePanels }
)(withStyles(styles)(App))
