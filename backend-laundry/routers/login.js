const express = require("express")
const login = express()
const md5 = require("md5")
login.use(express.json())
const jwt = require("jsonwebtoken")
const secretKey = "rramathegoat"

const models = require("../models/index")
const { request, response } = require("express")
const user = models.users

login.post("/", async (request, response) => {
    // tampung data login
    let newLogin = {
        username: request.body.username,
        password: md5(request.body.password)
    }

    let dataUser = await user.findOne({
        where: newLogin
    })

    if(dataUser){
        let payload = JSON.stringify(dataUser)
        let token = jwt.sign(payload, secretKey)
        return response.json({
            logged: true,
            token: token,
            user: dataUser
        })
    } else{
        return response.json({
            logged: false,
            message: `invalid username or password`
        })
    }
})

// fungsi auth digunakan untuk verifikasi token yg dikirimkan
const auth = (request, response, next) => {
    // mendapatkan data authorization
    let header = request.headers.authorization
    // header = Bearer blablablablabla

    // ambil data token
    let token = header && header.split(" ")[1]

    if(token == null){
        // jika token kosong
        return response.status(401).json({
            message: `Unauthorized`
        })
    } else{
        let jwtHeader = {
            algorithm: "HS256"
        }
        // verifikasi token yg diberikan
        jwt.verify(token, secretKey, jwtHeader, error => {
            if(error){
                return response.status(401).json({
                    message: `invalid token`
                })
            } else{
                next()
            }
        })
    }
}

module.exports = {
    login,
    auth
}