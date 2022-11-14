const express = require('express')
const mongoose = require('mongoose')
const { HOST, PORT, DB } = require('./config/DB_config')
const app = require('./app')



mongoose.connect(`mongodb://${HOST}:${PORT}/${DB}`, () => {
    console.log('connected to DB')
})





app.listen(3000, () => { console.log('server is running') })