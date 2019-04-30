import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteOutlined from '@material-ui/icons/FavoriteBorder'

const ChuckJoke = ({ favoriteClicked, joke, isFavorite }) => (
    <Grid container
          direction="row"
          justify="space-between"
          alignItems="center"
          wrap="nowrap"
          spacing={ 16 }>
        <Grid item xs={ 1 } onClick={ favoriteClicked }>
            <IconButton aria-label="Add to favorites">
                { isFavorite ? <Favorite/> : <FavoriteOutlined/> }
            </IconButton>
        </Grid>
        <Grid item xs={ 11 }>
            { joke }
        </Grid>
    </Grid>
)

ChuckJoke.propTypes = {
    favoriteClicked: PropTypes.func.isRequired,
    joke: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired
}

export default ChuckJoke
