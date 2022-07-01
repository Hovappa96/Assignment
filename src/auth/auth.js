const jwt = require("jsonwebtoken")


const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) {
            return res.status(404).send({ status: false, message: "token is required" })
        }

        let decodedToken = jwt.verify(token, "MySecreateCode", { ignoreExpiration: true })
        if (!decodedToken) {
            return res.status(400).send({ status: false, message: "Invalid token" })
        }

        let { userName, exp } = decodedToken

        if (!(userName === "Admin" || userName === "User")) {
            return res.status(403).send({ status: false, message: "Unauthorized Access" })
        }

        let iat = Math.floor(Date.now() / 1000)
        if (exp < iat) {
            return res.status(401).send({ status: false, message: "token is expired" })
        }

        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports = { authentication }