const express = require("express")
const cors = require("cors")
const app = express()

// memanggil library cors
app.use(cors())

// memanggil router member
const member = require("./routers/member")
app.use("/member", member)

// memanggil router paket
const paket = require("./routers/paket")
app.use("/paket", paket)

// memanggil router users
const users = require("./routers/users")
app.use("/users", users)

// memanggil router transaksi
const transaksi = require("./routers/transaksi")
app.use("/transaksi",transaksi)

// memanggil router login
const {login} = require("./routers/login")
app.use("/auth", login)

app.listen(8000,() => {
    console.log(`Server run on port 8000`);
})