import {getJokes} from '../jokes'
import {joke1} from './examples'

describe('Joke Service', () => {
    it('fetches data from the server and converts it to json', done => {
        const mockSuccessResponse = {
            data: {
                value: { joke1 }
            }
        }
        const mockJsonPromise = Promise.resolve(mockSuccessResponse)
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise
        })
        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

        const jokes = getJokes(3)

        expect(global.fetch).toMatchSnapshot()

        process.nextTick(() => {
            expect(jokes).toMatchSnapshot()

            global.fetch.mockClear()
            done()
        })
    })

    it('fetches 10 jokes by default', done => {
        const mockSuccessResponse = {
            data: {
                value: { joke1 }
            }
        }
        const mockJsonPromise = Promise.resolve(mockSuccessResponse)
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise
        })
        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

        const jokes = getJokes()

        expect(global.fetch).toMatchSnapshot()

        process.nextTick(() => {
            expect(jokes).toMatchSnapshot()

            global.fetch.mockClear()
            done()
        })
    })

    it('fetches an unlimited amount of jokes', done => {
        const mockSuccessResponse = {
            data: {
                value: { joke1 }
            }
        }
        const mockJsonPromise = Promise.resolve(mockSuccessResponse)
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise
        })
        jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)

        const jokes = getJokes(999)

        expect(global.fetch).toMatchSnapshot()

        process.nextTick(() => {
            expect(jokes).toMatchSnapshot()

            global.fetch.mockClear()
            done()
        })
    })
})
