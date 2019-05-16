import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import he from 'he'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteOutlined from '@material-ui/icons/FavoriteBorder'

import {removeJoke, addJoke} from '../store/reducers/jokes'

const ChuckJoke = ({ removeJoke, joke, isFavorite, addJoke }) => (
    <Grid container
          direction="row"
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
          spacing={ 8 }
          style={ { margin: 'auto' } }>
        <Grid item sm={ 1 } xs={ 2 } onClick={ () => {
            isFavorite ? removeJoke(joke) : addJoke(joke)
        } }>
            <IconButton aria-label="Add to favorites" color="secondary"
                        data-test={ isFavorite ? 'removejoke' : 'addjoke' }>
                { isFavorite ? <Favorite/> : <FavoriteOutlined/> }
            </IconButton>
        </Grid>
        <Grid item sm={ 11 } xs={ 10 }>
            { he.decode(joke.joke) }
        </Grid>
    </Grid>
)

ChuckJoke.propTypes = {
    joke: PropTypes.object.isRequired,
    isFavorite: PropTypes.bool.isRequired
}

export default connect(
    (state) => ({ jokes: state.joke.jokes }),
    { removeJoke, addJoke }
)(ChuckJoke)

