import reducer, {loginUser} from '../user'

import {login} from '../../services/users'

jest.mock('../../services/users', () => ({
    login: jest.fn()
}))
login.mockImplementation(() => Promise.resolve({ token: 'token', user: 'user' }))

describe('User Reducer', () => {

    it('returns an initial state when passed undefined', () => {
        const result = reducer(undefined, { type: 'ANYTHING' })
        expect(result).toMatchSnapshot()
    })

    it('it calls the login function and initiaties the application', async (done) => {
        const dispatch = jest.fn()
        await loginUser('a', 'a')(dispatch)
        expect(dispatch).toHaveBeenCalledTimes(4)
        expect(dispatch).toMatchSnapshot()
        done()
    })

})
