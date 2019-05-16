const parseRequest = (res) => {
    if (res.status >= 400 && res.status < 600) {
        throw new Error('Bad response from server')
    }
    return res.json()
}

export const login = (username, password) => {
    if (!username || !password) {
        throw new Error('Missing username or password')
    }

    const url = 'http://localhost:3000/login'

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(parseRequest)
      .then(response => {
          return response
      })
      .catch(error => {
          console.error('Error:', error)
          return Promise.reject(error)
      })
}

export const getProfile = (token) => {
    if (token) {
        return fetch('http://localhost:3000/api/v1/users/myprofile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => result.json())
            .then(res => {
                return res
            })
    }
}

export const getUserCache = (token) => {
    if (token) {
        return fetch('http://localhost:3000/cache/get', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(result => result.json())
            .then(items => {
                return items
            })
    }
}

export const setUserCache = (token, state) => {
    if (token) {
        const url = 'http://localhost:3000/cache/set'

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(state),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    }
}
