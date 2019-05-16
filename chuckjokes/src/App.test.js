jest.setTimeout(7000)

import puppeteer from 'puppeteer'

let browser
let page

describe('UI - Tests', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch()
        page = await browser.newPage()
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' })
        page.setViewport({ width: 1200, height: 2400 })
    })

    afterAll(() => {
        browser.close()
    })

    it('should have the main element on the page', async (done) => {
        const root = await page.$('#root')
        expect(root).toBeDefined()
        done()
    })

    it('should have an button to make favorite the jokes', async (done) => {
        const button = await page.$('[data-test="addjoke"]')
        expect(button).toBeDefined()
        done()
    })

    it('should make a joke favorite when clicked on it', async (done) => {
        await page.click('[data-test="addjoke"]')
        await page.waitFor('[data-test="removejoke"]')
        const favoriteJoke = await page.$('[data-test="removejoke"]')
        expect(favoriteJoke).not.toBe(null)
        done()
    })

    it('should show a button to add jokes every 5 seconds', async (done) => {
        await page.waitFor('[data-test="intervalSwitch"]')
        const intervalSwitch = await page.$('[data-test="intervalSwitch"]');
        expect(intervalSwitch).not.toBe(null)
        done()
    })

    it('should show a reload button when all the jokes have been favorited', async (done) => {
        while (await page.$('[data-test="addjoke"]')) {
            await page.click('[data-test="addjoke"]')
        }
        await page.waitFor('[data-test="reload"]')
        const reloadButton = await page.$('[data-test="reload"]')
        expect(reloadButton).not.toBe(null)
        done()
    })

    it('should have a login button', async (done) => {
        await page.waitFor('#root > div > header > div > div > button')
        const loginButton = await page.$('#root > div > header > div > div > button')
        expect(loginButton).not.toBe(null)
        done()
    })

    it('should open a dialog when clicking the login button', async (done) => {
        await page.waitFor('#root > div > header > div > div > button')
        await page.click('#root > div > header > div > div > button')
        await page.waitFor('#form-dialog-title > h2')
        const loginDialog = await page.$('#form-dialog-title > h2');
        expect(loginDialog).not.toBe(null)
        done()
    })

})
