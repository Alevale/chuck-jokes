import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import LoginDialog from './LoginDialog'
import {logIn} from '../store/reducers/user'

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

const Header = ({ classes, appUser, logIn }) => {
    return (
        <AppBar>
            <Toolbar>
                <Typography variant="h6" color="inherit" className={ classes.grow }>
                    Jokes for Chuck Norris
                </Typography>
                { appUser.email || <LoginDialog/> }
            </Toolbar>
        </AppBar>
    )
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    logIn: PropTypes.func.isRequired,
    appUser: PropTypes.object.isRequired
}

export default connect(
    (state) => ({ appUser: state.user.appUser }),
    { logIn }
)(withStyles(styles)(Header))
