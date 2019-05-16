export const setToken = (token) => {
    if (!token) {
        throw new Error('Missing token')
    }
    localStorage.setItem('CHUCK_JOKE_token', token)
}

export const getToken = () => {
    return localStorage.getItem('CHUCK_JOKE_token')
}


