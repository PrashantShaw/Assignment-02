const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const usersModel = require('../models/userSchema')
const jwt = require('jsonwebtoken')
const Auth_config = require('../config/Auth_config')



// -------------------------------------------------------------------
router.post('/register',
    body('name').isAlpha(),
    body('email').isEmail(),
    body('password').isLength({ min: 1 }),
    async (req, res) => {
        try {
            // VALIDATING INPUT FIELDS
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const { name, email, password } = req.body
            // HASHING THE PASSWORD
            bcrypt.hash(password, 10, async (err, hashedPassword) => {
                if (err) {
                    return res.status(400).json({ error: err.message })
                }
                // CREATING USER
                const user = await usersModel.create({
                    name, email,
                    password: hashedPassword
                })
                // SENDING USER INFO AS RESPONSE
                return res.status(200).json({
                    status: 'Success',
                    data: user
                })

            })

        }
        catch (err) { res.status(400).json({ message: err.message }) }
    })


// ---------------------------------------------------------------------
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await usersModel.findOne({ email })
        // CHEICKING USER EXISTS OR NOT
        if (!user) {
            return res.status(404).json({ message: "Invalid email / password" })
        }
        // COMPARING WITH HASHED PASSWORD
        bcrypt.compare(password, user.password, async (err, result) => {
            if (err) {
                return res.status(404).json({ message: err.message })
            }
            if (result) {
                // GENERATING TOKEN
                const token = jwt.sign(
                    { data: user._id },
                    Auth_config.secret,
                    { expiresIn: '1h' }
                )
                // SENDING TOKEN AS RESPONSE TO USER
                res.status(200).json({
                    status: "Success",
                    token
                })
            }
        })
    }
    catch (err) { res.status(400).json({ message: err.message }) }
})



module.exports = router