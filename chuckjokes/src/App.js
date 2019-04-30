import React from 'react'
import chuck from './chuck.jpg'
import './App.css'


import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteOutlined from '@material-ui/icons/FavoriteBorder'
import Grid from '@material-ui/core/Grid'

import ChuckJoke from './components/ChuckJoke'


const styles = theme => ({
    root: {
        width: '80%',
        margin: '20px auto'
    },
    picture: {
        maxWidth: '80%',
        margin: '20px auto'
    },
    secondaryHeading: {
        color: theme.palette.text.secondary
    }
})

class ControlledExpansionPanels extends React.Component {
    state = {
        expanded: ['panel1', 'panel2'],
        jokes: [
            {
                'id': 292,
                'joke': 'If you were somehow able to land a punch on Chuck Norris your entire arm would shatter upon impact. This is only in theory, since, come on, who in their right mind would try this?',
                'categories': []
            },
            {
                'id': 453,
                'joke': 'Chuck Norris doesn\'t need garbage collection because he doesn\'t call .Dispose(), he calls .DropKick().',
                'categories': [
                    'nerdy'
                ]
            },
            {
                "id": 259,
                "joke": "When Chuck Norris does division, there are no remainders.",
                "categories": []
            },
            {
                "id": 586,
                "joke": "Chuck Norris already went to Moon and Mars, that's why there are no signs of life.",
                "categories": []
            },
            {
                "id": 456,
                "joke": "All browsers support the hex definitions #chuck and #norris for the colors black and blue.",
                "categories": [
                    "nerdy"
                ]
            }
        ],
        favoriteJokes: []
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
            favoriteJokes: favoriteJokes.concat(joke)
        })
    }

    removeFromFavorites = (joke) => () => {
        const { jokes, favoriteJokes } = this.state
        this.setState({
            favoriteJokes: favoriteJokes.filter((j) => j.id !== joke.id),
            jokes: jokes.concat(joke)
        })
    }

    render() {
        const { classes } = this.props
        const { expanded, jokes, favoriteJokes } = this.state
        return (
            <Grid container
                  direction="row"
                  justify="space-around"
                  alignItems="center"
                  spacing={ 24 }
                  className={ classes.root }>
                <div>
                    { /*<img src={ chuck } className={ classes.picture } alt="chuck" />*/ }
                    <ExpansionPanel expanded={ expanded.includes('panel1') } onChange={ this.togglePanels('panel1') }>
                        <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon/> }>
                            <Grid item xs={ 4 }>
                                Random
                            </Grid>
                            <Grid item className={ classes.secondaryHeading } xs={ 8 }>
                                List of random jokes about chuck
                            </Grid>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container
                                  direction="column"
                                  justify="space-between"
                                  alignItems="center"
                                  wrap="nowrap"
                                  spacing={ 16 }>
                                { jokes.map(joke => (
                                    <ChuckJoke joke={ joke.joke } isFavorite={ false }
                                               favoriteClicked={ this.addToFavorites(joke) }/>
                                )) }
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel expanded={ expanded.includes('panel2') } onChange={ this.togglePanels('panel2') }>
                        <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon/> }>
                            <Grid item xs={ 4 }>
                                Favorite
                            </Grid>
                            <Grid item className={ classes.secondaryHeading } xs={ 8 }>
                                Save here your favorite quotes
                            </Grid>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container
                                  direction="column"
                                  justify="space-between"
                                  alignItems="center"
                                  wrap="nowrap"
                                  spacing={ 16 }>
                            { favoriteJokes.length < 1 ?
                                <Grid item xs={ 12 }>
                                    Seems like you don't have any favorite joke, mark some in the random tab, or add some random one
                                </Grid>
                                :
                                favoriteJokes.map(joke => (
                                    <ChuckJoke joke={ joke.joke } isFavorite={ true }
                                               favoriteClicked={ this.removeFromFavorites(joke) }/>
                                ))
                            }
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
            </Grid>
        )
    }
}

ControlledExpansionPanels.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ControlledExpansionPanels)
