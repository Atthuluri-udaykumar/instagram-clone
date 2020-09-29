const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")
const User = mongoose.model("users")
const Post = mongoose.model("posts")
const authGurd = require("../middleware/authGurd")

router.get("/user/:id", authGurd, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.json({ status: 404, msg: err })
                    }
                    res.json({ user, posts })
                })
        }).catch(err => res.json({
            status: 404,
            msg: "user not found"
        }))
})

module.exports = router

