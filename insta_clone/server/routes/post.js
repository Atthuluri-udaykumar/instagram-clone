const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")
const Post = mongoose.model("posts")
const authGurd = require("../middleware/authGurd")


router.get("/getallposts", authGurd, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.status(200).json({ post: posts })
        }).catch(err => console.log(err))
})

router.post("/createpost", authGurd, (req, res) => {
    const { title, body, photo } = req.body
    if (!title || !body) return res.json({
        status: 422,
        error: "user must fill all fields"
    })
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    })
    post.save().then((result) => {
        res.json({
            status: 200,
            msg: "data saved",
            posts: result
        })
    }).catch(err => res.status(400).json({ msg: err }))
})

router.get("/mypost", authGurd, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(result => res.json({ posts: result }))
        .catch(err => console.log(err))
})

router.put("/like", authGurd, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.user._id } }, { new: true })
        .exec((err, result) => {
            if (err) {
                res.status(422).json({ error: err })
            } else {
                res.status(200).json({ result })
            }
        })
})

router.put("/unlike", authGurd, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.user._id } }, { new: true })
        .exec((err, result) => {
            if (err) {
                res.status(422).json({ error: err })
            } else {
                res.status(200).json({ result })
            }
        })
})

router.put("/comment", authGurd, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                res.status(422).json({ error: err })
            } else {
                res.status(200).json({ result })
            }
        })
})

router.delete("/delete/:postId", authGurd, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                res.json({ err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove().then(result => res.json({ result }))
                    .catch(err => res.json({ err }))
            }
        })
})


module.exports = router
