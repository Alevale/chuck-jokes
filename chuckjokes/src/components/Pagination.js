import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ChevronRight from '@material-ui/icons/ChevronRight'
import ChevronLeft from '@material-ui/icons/ChevronLeft'

import {pageUp, pageDown} from '../store/reducers/jokes'

const Pagination = ({ page, favoriteJokes, pageUp, pageDown }) => (
    <Grid item xs={ 12 }>
        <Grid container
              direction="row"
              justify="space-between"
              alignItems="center"
              wrap="nowrap"
              spacing={ 8 }>
            <Grid item sm={ 1 }>
                <IconButton aria-label="Go Back" onClick={ pageDown } disabled={ page === 0 } color="secondary">
                    <ChevronLeft/>
                </IconButton>
            </Grid>
            <Grid item sm={ 1 }>
                { page + 1 }
            </Grid>
            <Grid item sm={ 1 }>
                <IconButton aria-label="Go Forward" onClick={ pageUp }
                            disabled={ favoriteJokes.length / 10 < (page + 1) } color="secondary">
                    <ChevronRight/>
                </IconButton>
            </Grid>
        </Grid>
    </Grid>
)

Pagination.propTypes = {
    favoriteJokes: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    pageUp: PropTypes.func.isRequired,
    pageDown: PropTypes.func.isRequired
}

export default connect(
    (state) => ({page: state.joke.page, favoriteJokes: state.joke.favoriteJokes}),
    {pageUp, pageDown}
)(Pagination)

