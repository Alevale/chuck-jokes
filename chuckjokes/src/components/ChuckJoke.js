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
          spacing={ 8 }
          style={{ margin: 'auto' }}>
        <Grid item sm={ 1 } xs={ 2 } onClick={ favoriteClicked }>
            <IconButton aria-label="Add to favorites" color="secondary">
                { isFavorite ? <Favorite/> : <FavoriteOutlined/> }
            </IconButton>
        </Grid>
        <Grid item sm={ 11 } xs={ 10 } dangerouslySetInnerHTML={{__html: joke}}>
        </Grid>
    </Grid>
)

ChuckJoke.propTypes = {
    favoriteClicked: PropTypes.func.isRequired,
    joke: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool.isRequired
}

export default ChuckJoke
