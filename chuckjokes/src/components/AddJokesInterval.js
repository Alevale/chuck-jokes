import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid/Grid'
import Switch from '@material-ui/core/Switch/Switch'

import {addFavoriteJokeOnIntervals} from '../store/reducers/jokes'

const styles = {
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
}

const AddJokesInterval = ({ favoriteJokes, addFavoriteJokeOnIntervals }) => {
    return (
        <Grid container
              direction="column"
              justify="space-between"
              alignItems="center"
              wrap="nowrap"
              spacing={ 8 }>
            <Grid item xs={ 12 }>
                Add a joke every 5 seconds until you have 10
                <Switch onChange={ addFavoriteJokeOnIntervals }
                        data-test="intervalSwitch"
                        disabled={ favoriteJokes.length >= 10 }/>
            </Grid>
        </Grid>

    )
}

AddJokesInterval.propTypes = {
    classes: PropTypes.object.isRequired,
    addFavoriteJokeOnIntervals: PropTypes.func.isRequired,
}

export default connect(
    (state) => ({
        favoriteJokes: state.joke.favoriteJokes
    }),
    { addFavoriteJokeOnIntervals }
)(withStyles(styles)(AddJokesInterval))
