const { request, response } = require("express")
const express = require("express")
const app = express()

// membaca request dari body dengan tipe json 
app.use(express.json())

// memanggil models
const models = require("../models/index")

// memanggil model paket
const paket = models.paket

// panggil fungsi auth -> validasi token
const {auth} = require("./login")

// fungsi auth dijadikan middleware
// app.use(auth)


// endpoint untuk memanggil semua paket
app.get("/", async (request, response) => {
    let dataPaket = await paket.findAll()

    return response.json(dataPaket)
})

// endpoint tambah data paket
app.post("/", (request, response) => {
    let newPaket = {
        jenis_paket: request.body.jenis_paket,
        harga: request.body.harga
    }

    paket.create(newPaket)
    .then(result => {
        response.json({
            message: `Data paket berhasil ditambahkan`,
            data: result
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
})

// endpoint update paket
app.put("/:id_paket", (request, response) => {
    let updatePaket = {
        jenis_paket: request.body.jenis_paket,
        harga: request.body.harga
    }

    let parameter = {
        id_paket: request.params.id_paket
    }

    paket.update(updatePaket, {where: parameter})
    .then(result => {
        return response.json({
            message: `Data berhasil diubah`,
            data: result
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

// endpoint delete paket
app.delete("/:id_paket", (request, response) => {
    let hapusPaket = {
        id_paket: request.params.id_paket
    }

    paket.destroy({where: hapusPaket})
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