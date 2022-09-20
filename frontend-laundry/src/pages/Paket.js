import { Modal } from "bootstrap";
import React from "react";
import axios from "axios";
import { authorization, baseUrl, formatNumber } from "../config";

class Paket extends React.Component {
    constructor() {
        super();
        this.state = {
            masterPacks: [],
            search: "",
            id_paket: "",
            jenis_paket: "",
            harga: "",
            action: "",
            pakets: [
                {
                    id_paket: "1", jenis_paket: "Baju", harga: 5000
                },
                {
                    id_paket: "2", jenis_paket: "Sprei", harga: 7000
                },
                {
                    id_paket: "3", jenis_paket: "Selimut", harga: 7000
                }
            ]
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        this.modalPaket = new Modal(document.getElementById("modal_paket"));
        this.modalPaket.show() // menampilkan modal
        // reset state untuk form Paket
        this.setState({
            action: "tambah",
            id_paket: 0,
            jenis_paket: "",
            harga: 0
        })
    }

    simpanData(event) {
        event.preventDefault();

        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/paket`
            // tampung data
            let data = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }

            // // tambah ke state pakets
            // let temp = this.state.pakets;
            // temp.push(data); // menambah data pada array
            // this.setState({ pakets: temp });

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalPaket.hide();
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/paket/` + this.state.id_paket

            let data = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.pakets;
            // let index = temp.findIndex(
            //     paket => paket.id_paket === this.state.id_paket
            // )

            // temp[index].jenis_paket = this.state.jenis_paket;
            // temp[index].harga = this.state.harga;

            // this.setState({ pakets: temp });
            this.modalPaket.hide();
        }
    }

    ubahData(id_paket) {
        this.modalPaket = new Modal(document.getElementById("modal_paket"));
        this.modalPaket.show();

        let index = this.state.pakets.findIndex(
            paket => paket.id_paket === id_paket
        );

        this.setState({
            action: "ubah",
            id_paket: id_paket,
            jenis_paket: this.state.pakets[index].jenis_paket,
            harga: this.state.pakets[index].harga
        })
    }

    hapusData(id_paket) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            let endpoint = `${baseUrl}/paket/` + id_paket

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // mencari posisi index
            let temp = this.state.pakets;
            let index = temp.findIndex(
                paket => [paket.id_paket === id_paket]
            )

            // hapus data
            temp.splice(index, 1)

            this.setState({ pakets: temp })
        }
    }

    searching(ev) {
        let code = ev.keyCode;
        if (code === 13) {
            let data = this.state.masterPacks;
            let found = data.filter(it =>
                it.jenis_paket.toLowerCase().includes(this.state.search.toLowerCase()))
            this.setState({ pakets: found });
        }
    }

    getData() {
        let endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ pakets: response.data })
                this.setState({ masterPacks: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        if (user.role === 'admin') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }

    render() {
        return (
            <div className="container">

                <h4 className="mb-2">
                    Menu package
                </h4>

                <div className="row mb-2">
                    <div className="col-4 align-self-center">
                        <div className="input-group">
                            <input className="form-control border-end-0 border" type="Search" id="example-search-input" placeholder="Search package"
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
                    <div className="col-5"></div>
                    <div className="col-3 align-self-center">
                        <div className="float-end">
                            <button id="button-add" className={`btn btn-success my-2 ${this.state.visible ? `` : `d-none`}`}
                                onClick={() => this.tambahData()}>
                                <i class="fa-solid fa-plus me-2"></i>Add new paket
                            </button>
                        </div>
                    </div>
                </div>



                <div className="row">
                    {this.state.pakets.map(pakett => (
                        <div className="col-lg-3">
                            <div id="card-paket" className="card my-2">
                                <div className="card-body">
                                    <h4>{pakett.jenis_paket}</h4>
                                    <h6>Rp {formatNumber(pakett.harga)} /kg</h6>
                                    {/* <div className="row"> */}
                                    <button id="button-edit" className={`btn btn-sm me-3 ${this.state.visible ? `` : `d-none`}`}
                                        onClick={() => this.ubahData(pakett.id_paket)}>
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>

                                    <button id="button-delete" className={`btn btn-sm ${this.state.visible ? `` : `d-none`}`}
                                        onClick={() => this.hapusData(pakett.id_paket)}>
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>

                    ))}
                </div>

                {/* Form modal add new paket */}
                <div className="modal fade" id="modal_paket">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content" id="bg-modal">
                            <div className="modal-body">
                                <h4 className="mb-3">
                                    Form Package
                                </h4>
                                <form onSubmit={ev => this.simpanData(ev)}>
                                    Package Type
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.jenis_paket} onChange={ev => this.setState({ jenis_paket: ev.target.value })} required />

                                    Harga
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.harga} onChange={ev => this.setState({ harga: ev.target.value })} required />

                                    <button className="btn btn-primary" type="submit">
                                        Save
                                    </button>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Paket;