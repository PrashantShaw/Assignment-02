const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'users' }
})

const postsModel = mongoose.model('posts', postSchema)

module.exports = postsModel