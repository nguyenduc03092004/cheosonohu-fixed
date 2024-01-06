const express = require('express')
const path = require('path')
const configSomeThing = (app) => {
    app.set('view engine', 'ejs');
    let myPath = path.join(__dirname, 'views').replaceAll('\\', '/').replace('/configsomething', '')
    app.set('views', myPath);
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
}
module.exports = configSomeThing