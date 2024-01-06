import express from 'express'

import Controler from '../controler/controler.mjs'
const router = express.Router()

const initApiRouter = (app) => {
    router.get('/', Controler.getHomePage)
    router.get('/getCaptChaPage', Controler.getHomePage)
    router.post('/inputCaptcha', Controler.inputCaptcha)
    router.get('/done', (req, res) => { res.send('done') })
    // router.post('/postData', Controler.postData)
    return app.use('/', router)
}

export default initApiRouter