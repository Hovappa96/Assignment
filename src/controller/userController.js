const userModel = require("../model/userModel")
const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")




const isValid = function (value) {
    if (typeof value === undefined || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === Number && value.trim().length === 0) return false
    return true
}

//function to validate request body
const isValidReqBody = function (data) {
    return Object.keys(data).length > 0
}


//function to validate user
const isValidUser = function (userName) {
    return ["Admin", "User", "Guest"].indexOf(userName) !== -1
}


//function to validate gender
const isValidGender = function (gender) {
    return ["Male", "Female", "Other"].indexOf(gender) !== -1
}

// 1.API
const createUser = async function (req, res) {
    try {
        let data = req.body

        //destructured to access fields
        let { userName, firstName, lastName, email, mobile, address, gender, password } = data

        //mandatory validation
        if (!isValidReqBody(data)) {
            return res.status(400).send({ status: false, message: "please pass data in request body" })
        }

        if (!isValidUser(userName)) {
            return res.status(400).send({ status: false, message: "userName does Not exist select from ['Admin','User','Guest']" })
        }

        if (!isValid(firstName)) {
            return res.status(400).send({ status: false, message: "firstName is required" })
        }

        if (!isValid(lastName)) {
            return res.status(400).send({ status: false, message: "lastName is required" })
        }

        if (!isValidGender(gender)) {
            return res.status(400).send({ status: false, message: "invalid gender select from ['Male','Female','Other']" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" })
        }

        if (!isValid(mobile)) {
            return res.status(400).send({ status: false, message: "mobile is required" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        if (!isValid(address.street)) {
            return res.status(400).send({ status: false, message: "street is required" })
        }

        if (!isValid(address.place)) {
            return res.status(400).send({ status: false, message: "place is required" })
        }

        if (!isValid(address.pincode)) {
            return res.status(400).send({ status: false, message: "pincode is required" })
        }



        //pattern validations
        if (!validator.isStrongPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).send({ status: false, message: "Not a valid email address" })
        }

        if (!(/^[789]\d{9}$/.test(mobile))) {
            return res.status(400).send({ status: false, message: "Not a valid mobile number" })
        }

        if (!(address.pincode.length == 6)) {
            return res.status(400).send({ status: false, message: "Not a valid pincode" })
        }



        //unique validations
        let checkEmail = await userModel.findOne({ email })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: "email address is already exist" })
        }

        let checkPhone = await userModel.findOne({ mobile })
        if (checkPhone) {
            return res.status(400).send({ status: false, message: "mobile number is already exist" })
        }



        // generate salt to hash password
        const salt = await bcrypt.genSalt(10)
        // now we set user password to hashed password
        encrypted = await bcrypt.hash(password, salt);



        let saveData = { userName, firstName, lastName, email, password: encrypted, mobile, gender, address }

        let document = await userModel.create(saveData)
        return res.status(201).send({ status: true, message: "Successfully Created", data: document })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}




const logIn = async function (req, res) {
    try {
        let data = req.body

        let { email, password } = data //destructured to access fields of data

        if (!isValidReqBody(data)) {
            return res.status(400).send({ status: false, message: "please pass data in request body" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }



        //pattern validations
        if (!validator.isStrongPassword(password)) {
            return res.status(400).send({ status: false, message: "Invalid password" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).send({ status: false, message: "Not a valid email address" })
        }

        let findUser = await userModel.findOne({ email })
        if (findUser) {
            let validatePassword = await bcrypt.compare(password, findUser.password)
            if (!validatePassword) {
                return res.status(400).send({ status: false, message: "Invalid password" })
            }
        }
        else {
            return res.status(404).send({ status: false, message: "User Not Found" })
        }


        //generating jwt
        let geneToken = jwt.sign({
            userId: findUser._id.toString(),
            userName: findUser.userName.toString()
        }, "MySecreateCode", { expiresIn: "30m" })

        return res.status(200).send({ status: true, message: "Suceess", data: geneToken })

    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}





const getUsers = async function (req, res) {
    try {
        let data = req.query

        let condition = { isDeleted: false }

        //To merge two object 
        let filter = Object.assign(data, condition)
        let findUser = await userModel.find(filter)
        
        if (!findUser) {
            return res.status(404).send({ status: false, message: "Data Not found" })
        }
        return res.status(200).send({ status: true, message: "Success", data: findUser })
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}
module.exports = { createUser, logIn, getUsers }