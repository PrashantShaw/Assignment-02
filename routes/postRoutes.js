const express = require('express')
const router = express.Router()
// const { body, validationResult } = require('express-validator')
const postsModel = require('../models/postsSchema')


router.post("/",
    async (req, res) => {
        try {
            const { title, body, image } = req.body
            // CHECKING IF ANY FIELD IS MISSING
            if (!title || !body || !image) {
                return res.status(400).json(
                    { message: "All fields are required." })
            }
            // CREATING THE POST
            const createdPost = await postsModel.create({
                ...req.body,
                user: req.user
            })
            // SENDING RESPONSE
            res.status(200).json({
                status: "Post created",
                data: createdPost
            })
        }
        catch (err) { res.status(500).json({ message: err.message }) }
    })
// ------------------------------------------------------------------


router.put("/:postId",
    async (req, res) => {
        try {
            const postToEdit = await postsModel.findOne({ _id: req.params.postId })
            // CHECKING POST EXISTS OR NOT
            if (!postToEdit) {
                return res.status(400).json(
                    { message: "Post does not exist." })
            }
            // CHECKING IF USER IS AUTHORISED TO EDIT THIS POST
            if (req.user !== postToEdit.user.toString()) {
                return res.status(401).json(
                    { message: "This post belongs to someone else, it can not be edited." })
            }
            // UPDATING THE POST
            await postsModel.updateOne(
                { _id: req.params.postId }, { $set: req.body })
            // SEDNING RESPONSE
            res.status(200).json({
                status: "Success",
            })
        }
        catch (err) { res.status(500).json({ message: err.message }) }
    })
// ------------------------------------------------------------------


router.delete("/:postId",
    async (req, res) => {
        try {
            const postToDelete = await postsModel.findOne({ _id: req.params.postId })
            // CHECKING IF POST EXISTS OR NOT
            if (!postToDelete) {
                return res.status(400).json(
                    { message: "Post does not exist." })
            }
            // CHECKING IS USER AUTHORISE TO DELETE THIS POST
            if (req.user !== postToDelete.user.toString()) {
                return res.status(401).json(
                    { message: "This post belongs to someone else, it can not be deleted." })
            }
            // DELETEING THE POST
            await postsModel.deleteOne({ _id: req.params.postId })
            // SENDING RESPONSE
            res.status(200).json({
                status: "Successfully deleted",
            })
        }
        catch (err) { res.status(500).json({ message: err.message }) }
    })



module.exports = router