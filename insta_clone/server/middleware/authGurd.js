const jwt = require("jsonwebtoken")
const mongoose = require("mongoose");
const User = mongoose.model("users")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) return res.json({
        status: 401,
        error: "must be logged in"
    })

    const token = authorization.replace("Bearer ", "")

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.json({
            status: 401,
            error: "must be logged in"
        })

        const { _id } = payload

        User.findById(_id)
            .then((userdata) => {
                req.user = userdata;
                next();
            });
    })

}