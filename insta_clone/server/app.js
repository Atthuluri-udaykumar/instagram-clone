const express = require('express')
const app = express()

const mongoose = require("mongoose")
const cors = require('cors')
// configurationsa:--
require('dotenv').config();
// db connection:--
mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) {
        console.log("db connected successfully!!");
    } else {
        console.log("err" + err);
    }
})

// routers:--
require("./models/user");
require("./models/post")
app.use(cors())
app.use(express.json())
app.use("/user", require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))



const port = process.env.PORT || 2020

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

