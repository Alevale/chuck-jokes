export const getJokes = (amount) => {
    return fetch(`http://localhost:3000/api/v1/jokes/random/${amount || 10}`)
        .then(result => result.json())
        .then(items => {
            return items.data.value
        })
}
