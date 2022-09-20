const { request, response } = require("express")
const express = require("express")
const app = express()
const md5 = require("md5")

app.use(express.json())

const models = require("../models/index")
const users = models.users

// endpoint untuk memanggil semua users
app.get("/", async (request, response) => {
    let dataUsers = await users.findAll()

    return response.json(dataUsers)
})

// endpoint tambah data users
app.post("/", (request, response) => {
    let newUsers = {
        nama: request.body.nama,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }

    users.create(newUsers)
    .then(result => {
        response.json({
            message: `Data users berhasil ditambahkan`
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
})

// endpoint update dataa users
app.put("/:id_user", (request, response) => {
    let updateUsers = {
        nama: request.body.nama,
        username: request.body.username,
        role: request.body.role
    }

    if(request.body.password){
        updateUsers.password = md5(request.body.password)
    }

    let parameter = {
        id_user: request.params.id_user
    }

    users.update(updateUsers, {where: parameter})
    .then(result => {
        return response.json({
            message: `Data user berhasil diupdate`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

// endpoint delete data user
app.delete("/:id_user", (request, response) => {
    let hapusUser = {
        id_user: request.params.id_user
    }

    users.destroy({where: hapusUser})
    .then(result => {
        response.json({
            message: `Data berhasil dihapus`
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
})

module.exports = app

