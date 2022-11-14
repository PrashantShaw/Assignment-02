const express = require('express')
const router = express.Router()
// const { body, validationResult } = require('express-validator')
const postsModel = require('../models/postsSchema')


router.post("/",
    // body('title').isAlpha(),
    // body('body').isAlpha(),
    // body('image').isAlpha(),
    async (req, res) => {
        try {
            // const errors = validationResult(req)
            // if (!errors.isEmpty()) {
            // }
            const { title, body, image } = req.body
            if (!title || !body || !image) {
                return res.status(400).json({ message: "All fields are required." })
            }
            const createdPost = await postsModel.create({
                ...req.body,
                user: req.user
            })
            res.status(200).json({
                status: "Post created",
                data: createdPost
            })
        }
        catch (err) { res.status(404).json({ message: err.message }) }
    })

module.exports = router