const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const route = require("./routes/route")
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost:27017/assignment", { useNewUrlParser: true })
    .then(() => { console.log("MongoDB Connected to 27017") })
    .catch((err) => { console.log(err) })


app.use("/", route)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => { console.log(`Express App Running On ${PORT}`) })