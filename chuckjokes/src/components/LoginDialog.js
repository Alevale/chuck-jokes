import React, {Component} from 'react'
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { loginUser } from '../store/reducers/user'

class LoginDialog extends Component {
    state = {
        open: false,
        username: '',
        password: ''
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value })
    }

    handleLogin = () => {
        this.close()
        this.props.loginUser(this.state.username, this.state.password)
    }

    open = () => {
        this.setState({ open: true })
    }

    close = () => {
        this.setState({ open: false })
    }

    render() {
        const { open } = this.state
        return (
            <div>
                <Button color="inherit" onClick={ this.open }>
                    Log in
                </Button>
                <Dialog
                    open={ open }
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Log in</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please log in with your account in order to save in our server your favorite jokes.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            onChange={ this.handleChange('username') }
                            fullWidth
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            onChange={ this.handleChange('password') }
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={ this.close } color="primary">
                            Cancel
                        </Button>
                        <Button onClick={ this.handleLogin } color="primary">
                            Log in
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


export default connect(
    (state) => ({ appUser: state.user.appUser }),
    { loginUser }
)(LoginDialog)
