const express = require("express")
const router = express.Router()

const { sighInValidation, sighUpValidation } = require("../helpers/helper")
const mongoose = require("mongoose")
const User = mongoose.model("users")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const authGuard = require("../middleware/authGurd")

const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport")
const crypto = require("crypto")

let transporter = nodemailer.createTransport(sendgridTransport(
    {
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    }
))

router.get("/", authGuard, (req, res) => {
    res.send("hello")
})

router.post("/signup", async (req, res) => {
    const { error } = sighUpValidation(req.body)
    if (error) return res.json({
        status: 400,
        error: error.details[0].message
    });

    const { name, email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (foundUser) return res.json({
        status: 422,
        error: "email already exist!!"
    })

    var salt = await bcrypt.genSaltSync(10);
    var hashPassword = await bcrypt.hashSync(password, salt, (err) => {
        if (err) {
            console.log(err);
        }
    });

    let newUser = new User({
        name,
        email,
        password: hashPassword
    })

    newUser.save()
        .then(user => {
            transporter.sendMail({
                from: "udaychowdary303@gmail.com",
                to: user.email,
                subject: "signup success",
                html: `<h1>wellcome to my instagram ${user.name}</h1>`
            }).then(() => console.log("msg sent"))
                .catch(err => console.log(err))
            res.json({ status: 200, msg: "user data saved" })
        })
        .catch(err => res.json({ status: 400, error: err }))
})

router.post("/signin", async (req, res) => {
    const { error } = sighInValidation(req.body)
    if (error) return res.json({
        status: 400,
        error: error.details[0].message
    });
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) return res.json({
        status: 400,
        error: "invalid email or password"
    })

    const mached = await bcrypt.compareSync(password, user.password)
    if (!mached) {
        return res.json({
            status: 400,
            error: "invalid email or password"
        })
    } else {
        user.password = undefined;
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        res.status(200).json({ msg: "user logedin", token, user })
    }
})

router.post("/reset", (req, res) => {
    crypto.randomBytes(32, (err, Buffer) => {
        if (err) {
            console.log(err);
        }
        const token = Buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.json({ status: 400, error: "user dont exist whith that mail" })
                } else {
                    user.resetToken = token;
                    user.expireToken = Date.now() + 3600000;
                    user.save()
                        .then(result => {
                            transporter.sendMail({
                                from: "udaychowdary303@gmail.com",
                                to: user.email,
                                subject: "password reset",
                                html: `
                            <p>you requested for password reset</p>
                            <h4>click in this to password reset <a href="http://localhost:3000/reset/${token}">link</a></h4>
                            `
                            }).then(() => console.log("msg sent"))
                            res.json({ msg: "check your email" })
                        })

                }
            }).catch(err => console.log(err))
    })
})

router.post("/newPassword", (req, res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                res.json({
                    status: 400,
                    error: "try again some time session is expired"
                })
            }
            var salt = bcrypt.genSaltSync(10);
            var hashPassword = bcrypt.hashSync(newPassword, salt, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            user.password = hashPassword;
            user.resetToken = undefined;
            user.expireToken = undefined;
            user.save().then(() => res.json({ status: 200, msg: "password reset successfully " }))
                .catch(err => res.json({ status: 400, error: "enter valid password" }))
        }).catch(err => res.json({ status: 400, error: err }))
})

module.exports = router