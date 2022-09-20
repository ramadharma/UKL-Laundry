import React from "react";
import axios from "axios";
import { authorization, baseUrl, formatNumber, formatDate } from "../config";
import ReactToPdf from "react-to-pdf";
import domToPdf from "dom-to-pdf";
import logo from "../logo.png";

export default class Transaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            masterPacks: [],
            search: "",
            transaksi: [
            ]
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    searching(ev) {
        let code = ev.keyCode;
        if (code === 13) {
            let data = this.state.masterPacks;
            let found = data.filter(it =>
                it.member.nama.toLowerCase().includes(this.state.search.toLowerCase()) || it.tgl.toLowerCase().includes(this.state.search.toLowerCase()))
            this.setState({ transaksi: found });
        }
    }

    getData() {
        let endpoint = `${baseUrl}/transaksi`

        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)
                    }

                    // tambahkan key "total"
                    dataTransaksi[i].total = total
                }

                this.setState({ transaksi: dataTransaksi })
                this.setState({ masterPacks: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getData()
    }

    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div id="badge-info" className="badge bg-info">
                    <a onClick={() => this.changeStatus(id_transaksi, 2)}>
                        Transaksi baru <i class="fa-solid fa-angles-right" />
                    </a>
                </div>
            )
        } else if (status === 2) {
            return (
                <div id="badge-warning" className="badge bg-warning">
                    <a onClick={() => this.changeStatus(id_transaksi, 3)}>
                        Sedang diproses <i class="fa-solid fa-angles-right" />
                    </a></div>
            )
        } else if (status === 3) {
            return (
                <div id="badge-secondary" className="badge bg-secondary">
                    <a onClick={() => this.changeStatus(id_transaksi, 4)}>
                        Siap diambil <i class="fa-solid fa-angles-right" />
                    </a></div>
            )
        } else if (status === 4) {
            return (
                <div id="badge-success" className="badge bg-success">Telah diambil</div>
            )
        }
    }

    changeStatus(id, status) {
        if (window.confirm(`Apakah anda yakin ingin mengganti status transaksi ini?`)) {
            let endpoint = `${baseUrl}/transaksi/status/${id}`
            let data = {
                status: status
            }

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(`Status telah diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    convertStatusBayar(id_transaksi, dibayar) {
        if (dibayar == 0) {
            return (
                <div id="badge-danger" className="badge bg-danger text-white">
                    <a onClick={() => this.changeStatusBayar(id_transaksi, 1)}>
                        Belum dibayar <i class="fa-solid fa-angles-right" />
                    </a>
                </div>
            )
        } else if (dibayar == 1) {
            return (
                <div id="badge-success" className="badge bg-success text-white">
                    Sudah dibayar
                </div>
            )
        }
    }

    changeStatusBayar(id, status) {
        if (window.confirm(`Apakah anda yakin mengubah status bayar?`)) {
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`

            axios.get(endpoint, authorization)
                .then(response => {
                    window.alert(`Status bayar berhasil diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    deleteTransaksi(id) {
        if (window.confirm(`Apakah anda yakin ingin menghapus transaksi ini?`)) {
            let endpoint = `${baseUrl}/transaksi/${id}`
            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    convertPdf() {
        // ambil element yang akan diconvert ke pdf
        let element = document.getElementById(`target`)
        let options = {
            filename: "Coba.pdf"
        }

        domToPdf(element, options, () => {
            window.alert("Pdf file will be downloaded soon")
        })
    }

    printStruk(id) {
        var element = document.getElementById(`struk${id}`);
        var option = {
            filename: `struk${id}.pdf`
        };

        domToPdf(element, option, function (pdf) {
            window.alert('Struk will be downloaded soon')
        })
    }

    render() {
        const target = React.createRef()
        const optionPDF = {
            orientation: `landscape`,
            unit: `cm`,
            format: [21, 29.7]
        }
        let cashier = JSON.parse(localStorage.getItem('user'))
        return (
            <div className="container">

                {/* <button className="btn btn-info mt-2 mb-2"
                    onClick={() => this.convertPdf()}>
                    Generate to Pdf
                </button> */}

                {/* <div id="target" className="card"> */}
                {/* <div className="card-header bg-secondary">
                        <h4 className="text-white">
                            Transactions
                        </h4>
                    </div> */}
                {/* <div className="card-body"> */}

                <div className="row mb-3">
                    <div className="col-8">
                        <h4 className="mb-2">
                            Transactions
                        </h4>
                    </div>
                    <div className="col-4">
                        <div className="input-group">
                            <input className="form-control border-end-0 border" type="Search" id="example-search-input" placeholder="Search transaction"
                                value={this.state.search}
                                onChange={ev => this.setState({ search: ev.target.value })}
                                onKeyUp={(ev) => this.searching(ev)} />
                            <span className="input-group-append">
                                <button className="btn btn-outline-secondary bg-white border-start-0 border-bottom-0 border ms-n5" type="button">
                                    <i className="fa fa-search"></i>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>




                <ul className="list-group">
                    {this.state.transaksi.map(trans => (
                        <div id="cardTrans" className="card mb-3">
                            <li className="list-group-item">
                                <div className="row my-2">
                                    {/* this is member area */}
                                    <div className="col-lg-3">
                                        <small className="text-secondary">Member</small>
                                        <br />
                                        <h6>{trans.member.nama}</h6>
                                    </div>

                                    {/* this is tgl transaksi area */}
                                    <div className="col-lg-3">
                                        <small className="text-secondary">Tgl Transaksi</small>
                                        <br />
                                        <h6>{formatDate(trans.tgl)}</h6>
                                    </div>

                                    {/* this is for batas waktu area */}
                                    <div className="col-lg-3">
                                        <small className="text-secondary">Batas waktu</small>
                                        <br />
                                        <h6>{formatDate(trans.batas_waktu)}</h6>
                                    </div>

                                    {/* this is for tanggal bayar area */}
                                    <div className="col-lg-3">
                                        <small className="text-secondary">Tgl Bayar</small>
                                        <br />
                                        <h6>{formatDate(trans.tgl_bayar)}</h6>
                                    </div>

                                    {/* this is for status area */}
                                    <div className="col-lg-3">
                                        <small className="text-secondary">Status</small>
                                        <br />
                                        <h6>{this.convertStatus(trans.id_transaksi, trans.status)}</h6>
                                    </div>

                                    {/* this is for status pembayaran */}
                                    <div className="col-lg-3">
                                        <small className="text-secondary">Status Bayar</small>
                                        <br />
                                        <h6>{this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}</h6>
                                    </div>

                                    {/* this is for total */}
                                    <div className="col-lg-3">
                                        <small className="text-secondary">Total</small>
                                        <br />
                                        <h6 id="total">Rp {formatNumber(trans.total)}</h6>
                                    </div>

                                    {/* this is for actions button */}
                                    <div className="col-lg-3 col-lg-2 align-self-center">
                                        {/* <small className="text-secondary">option</small><br /> */}
                                        <button className="btn btn-sm me-2" id="button-edit"
                                            onClick={() => this.printStruk(trans.id_transaksi)}>
                                            <i class="fa-solid fa-print"></i>
                                        </button>
                                        <button onClick={() => this.deleteTransaksi(trans.id_transaksi)} className="btn btn-sm " id="button-delete">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>

                                    {/* Bill area  */}
                                    <div style={{ display: 'none' }}>
                                        <div className="col-lg-12 p-3"
                                            id={`struk${trans.id_transaksi}`}>
                                            <center>
                                                <img src={logo} width="6%" />
                                            </center>
                                            <br />

                                            <h1 className="text-center">
                                                You Never Wash Alone
                                            </h1>

                                            <h2 className="text-center text-secondary">
                                                Jalan Digidaw G7/E17, Wembley
                                            </h2>

                                            <h3 className="text-center text-secondary">
                                                Cashier: {cashier.nama}
                                            </h3>

                                            <br />
                                            <div className="container">
                                                <h4>Member: {trans.member.nama}</h4>
                                                <h4>Tgl: {formatDate(trans.tgl)}</h4>
                                                <br />
                                                <div className="row mt-2"
                                                    style={{ borderBottom: '1px dotted black' }}>
                                                    <div className="col-4">
                                                        <h5>Paket</h5>
                                                    </div>
                                                    <div className="col-2">
                                                        <h5>Qty</h5>
                                                    </div>
                                                    <div className="col-3">
                                                        <h5>Harga per kg</h5>
                                                    </div>
                                                    <div className="col-3">
                                                        <h5>Total</h5>
                                                    </div>
                                                </div>

                                                {trans.detail_transaksi.map(item => (
                                                    <div className="row mt-2"
                                                        style={{ borderBottom: '1px dotted black' }}>
                                                        <div className="col-4">
                                                            <h5>{item.paket.jenis_paket}</h5>
                                                        </div>
                                                        <div className="col-2">
                                                            <h5>{item.qty}</h5>
                                                        </div>
                                                        <div className="col-3">
                                                            <h5>Rp {formatNumber(item.paket.harga)}</h5>
                                                        </div>
                                                        <div className="col-3">
                                                            <h5>Rp {formatNumber(item.paket.harga * item.qty)}</h5>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="row mt-2">
                                                    <div className="col-lg-9"></div>
                                                    <div className="col-lg-3">
                                                        <h5>Rp {formatNumber(trans.total)}</h5>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <hr id="hr" />

                                {/* // area detail transaksi */}
                                <small className="text-secondary">Detail Transaksi</small>
                                {trans.detail_transaksi.map(detail => (
                                    <div className="row">
                                        {/* this is for name package area */}
                                        <div className="col-lg-3">
                                            <h6>{detail.paket.jenis_paket}</h6>
                                        </div>
                                        {/* this is for qty area */}
                                        <div className="col-lg-3">
                                            <h6>Qty: {detail.qty}</h6>
                                        </div>
                                        {/* this is for price area */}
                                        <div className="col-lg-3">
                                            <h6>Rp {formatNumber(detail.paket.harga)}</h6>
                                        </div>
                                        {/* this is for total price area */}
                                        <div className="col-lg-3">
                                            <h6>Rp {formatNumber(detail.paket.harga * detail.qty)}</h6>
                                        </div>
                                    </div>
                                ))}
                            </li>
                        </div>

                    ))}
                </ul>

                {/* <table className="table">
                            <thead>
                                <tr>    
                                    <th scope="col">Member</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Deadline</th>
                                    <th scope="col">Checkout</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Payment</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.transaksi.map(tran => (
                                    <tr id="table-row">
                                        <td>
                                            {tran.member.nama}<br/> 
                                            <h6>Detail transaksi</h6>
                                            </td>
                                        <td>{formatDate(tran.tgl)}</td>
                                        <td>{formatDate(tran.batas_waktu)}</td>
                                        <td>{formatDate(tran.tgl_bayar)}</td>
                                        <td>{this.convertStatus(tran.id_transaksi, tran.status)}</td>
                                        <td>{this.convertStatus(tran.id_transaksi, tran.dibayar)}</td>
                                        <td>Rp {formatNumber(tran.total)}</td>
                                        <td>
                                        <button onClick={() => this.deleteTransaksi(tran.id_transaksi)} className="btn btn-sm btn-danger">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                    
                                ))}
                            </tbody>
                        </table> */}


                {/* </div> */}
                {/* </div> */}
            </div>
        )
    }
}