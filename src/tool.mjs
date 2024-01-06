import express, { response } from 'express'
import initApiRouter from './router/router.mjs';
import configSomeThing from './configsomething/configSomeThings.cjs';
const app = express();

configSomeThing(app)


initApiRouter(app)


app.get('/', (req, res) => {
    res.json('create server is sussecfully')
})

app.listen(6969, () => {
    console.log(`tool is listenning on port 6969`)
})