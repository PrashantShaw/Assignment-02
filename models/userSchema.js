const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true }
})

const usersModel = mongoose.model('users', userSchema)

module.exports = usersModel