import React from "react";
import axios from "axios";
import { baseUrl, formatNumber, authorization } from "../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import foto1 from "../foto1.jpg"
import foto2 from "../foto2.jpg"
import foto3 from "../foto3.jpg"

export default class Dashboard extends React.Component {
    constructor() {
        super()
        this.state = {
            jmlMember: 0,
            jmlPaket: 0,
            jmlTransaksi: 0,
            income: 0
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getSummary() {
        // get jumlah member
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ jmlMember: response.data.length })
            })
            .catch(error => console.log(error))

        // get jumlah paket
        endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ jmlPaket: response.data.length })
            })
            .catch(error => console.log(error))

        // get jumlah transaksi
        endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                let income = 0
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)
                    }

                    income += total
                }
                this.setState({
                    jmlTransaksi: response.data.length,
                    income: income
                })
            })
            .catch(error => console.log(error))


    }

    componentDidMount() {
        this.getSummary()
    }


    render() {
        let user = JSON.parse(localStorage.getItem('user'))
        return (
            <div className="container">
                <div id="hero" className="row my-5">
                    <div className="col-lg-6 justify-content-center align-self-center">
                        <h2 className="mb-3 ">
                            Welcome to dashboard,
                            <div id="badge-secondary" className="badge mx-2">
                            {user.nama}
                                </div> 
                            ! 
                            <br /> You Never Wash Alone
                        </h2>
                    </div>
                    <div className="col-lg-6">
                        <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img src={foto1} class="d-block w-100" alt="..."/>
                                </div>
                                <div class="carousel-item">
                                    <img src={foto2} class="d-block w-100" alt="..."/>
                                </div>
                                <div class="carousel-item">
                                    <img src={foto3} class="d-block w-100" alt="..."/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <h2 className="mb-3">
                    Welcome to dashboard, {user.nama}!
                </h2> */}
                <div className="row">
                    <div className="col-lg-3 col-md-6">
                        <div className="card m-1 text-dark" id="member">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-lg-3">
                                        <i class="fa-solid fa-user p-2 fa-lg" id="icon-member"></i>
                                    </div>
                                    <div className="col-lg-9 justify-content-center align-self-center">
                                        <h2 id="jumlah">{this.state.jmlMember}</h2>
                                    </div>
                                </div>
                                <h6 id="label">TOTAL MEMBER</h6>
                                {/* <hr />
                                <text className="text-sm">
                                    more details <i class="fa-solid fa-sm fa-angle-right"></i>
                                </text> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card m-1 text-dark" id="paket">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-lg-3">
                                        <i class="fa-solid fa-box-open p-2 fa-lg" id="icon-paket"></i>
                                    </div>
                                    <div className="col-lg-9 justify-content-center align-self-center">
                                        <h2 id="jumlah">{this.state.jmlPaket}</h2>
                                    </div>
                                </div>
                                <h6 id="label">TOTAL PACKAGE</h6>
                                {/* <hr />
                                <text className="text-sm">
                                    more details <i class="fa-solid fa-sm fa-angle-right"></i>
                                </text> */}

                                {/* <h4 className="card-title">Total Package</h4>
                                <h2>{this.state.jmlPaket}</h2>
                                <h6>packages in londree</h6> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card m-1 text-dark" id="transaksi">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-lg-3">
                                        <i class="fa-solid fa-basket-shopping p-2 fa-lg" id="icon-transaksi"></i>
                                    </div>
                                    <div className="col-lg-9 justify-content-center align-self-center">
                                        <h2 id="jumlah">{this.state.jmlTransaksi}</h2>
                                    </div>
                                </div>
                                <h6 id="label">TOTAL TRANSACTION</h6>
                                {/* <hr />
                                <text className="text-sm">
                                    more details <i class="fa-solid fa-sm fa-angle-right"></i>
                                </text> */}

                                {/* <h4 className="card-title">Total Transaction</h4>
                                <h2>{this.state.jmlTransaksi}</h2>
                                <h6>transactions in londree</h6> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <div className="card m-1 text-dark" id="income">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-lg-3">
                                        <i class="fa-solid fa-dollar-sign p-2 fa-lg" id="icon-income"></i>
                                    </div>
                                    <div className="col-lg-9 justify-content-center align-self-center">
                                        <h2 id="jumlah">{formatNumber(this.state.income)}</h2>
                                    </div>
                                </div>
                                <h6 id="label">TOTAL INCOME</h6>
                                {/* <hr />
                                <text className="text-sm">
                                    more details <i class="fa-solid fa-sm fa-angle-right"></i>
                                </text> */}

                                {/* <h4 className="card-title">Total Transaction</h4>
                                <h2>{this.state.jmlTransaksi}</h2>
                                <h6>transactions in londree</h6> */}
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-lg-6">
                        <div className="card bg-primary m-1 text-white">
                            <div className="card-body">
                                <h4 className="card-title">Income</h4>
                                <h2>Rp {formatNumber(this.state.income)}</h2>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}