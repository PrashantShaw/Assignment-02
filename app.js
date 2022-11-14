const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const Auth_config = require('./config/Auth_config')
const loginRoutes = require('./routes/loginRoutes')
const postsRoutes = require('./routes/postRoutes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/posts', (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: "User not Authorised." })
    }
    jwt.verify(token, Auth_config.secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: err.message })
        }
        console.log(decoded)
        req.user = decoded.data;
        next()
    })
})








app.use('/', loginRoutes)
app.use('/posts', postsRoutes)

app.get('/', (req, res) => {
    res.send("All Ok.")
})



module.exports = app