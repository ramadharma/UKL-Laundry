import React from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { authorization, baseUrl } from "../config";

export default class FormTransaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            id_member: "",
            tgl: "",
            batas_waktu: "",
            tgl_bayar: "",
            dibayar: 0,
            id_user: "",
            detail_transaksi: [],
            members: [],
            pakets: [],
            id_paket: "",
            qty: 0,
            jenis_paket: "",
            harga: 0
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getMember() {
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ members: response.data })
            })
            .catch(error => console.log(error))
    }

    getPaket() {
        let endpoint = `${baseUrl}/paket`

        axios.get(endpoint, authorization)
            .then((response) => {
                this.setState({ pakets: response.data })
            })
            .catch((error) => console.log(error))
    }

    tambahPaket(e) {
        e.preventDefault()

        // untuk menyimpan data paket yang dipilih beserta jumlahnya didalam array detail transaksi
        let idPaket = this.state.id_paket
        let selectedPaket = this.state.pakets.find(
            paket => paket.id_paket == idPaket
        )

        let newPaket = {
            id_paket: this.state.id_paket,
            qty: this.state.qty,
            jenis_paket: selectedPaket.jenis_paket,
            harga: selectedPaket.harga
        }

        // ambil array detail transaksi
        let temp = this.state.detail_transaksi
        temp.push(newPaket)
        this.setState({ detail_transaksi: temp })
        this.modal.hide()
    }

    addPaket() {
        // menampilkan form untuk memilih paket
        this.modal = new Modal(document.getElementById("modal_paket"))
        this.modal.show()

        // mengosongkan formnya
        this.setState({ id_paket: "", qty: 0, jenis_paket: "", harga: 0 })
    }

    deleteData(id_paket) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            // mencari posisi index dari data yang akan dihapus
            let temp = this.state.detail_transaksi
            let index = temp.findIndex(detail => detail.id_paket === id_paket)

            // menghapus data pada array
            temp.splice(index, 1)
            this.setState({ details: temp })
        }
    }

    simpanTransaksi() {
        if (document.getElementById("memberr").value == "") {
            alert("missing member");
            return;
        }
        if (document.getElementById("tgl").value == "") {
            alert("missing tanggal transaksi");
            return;
        }
        if (document.getElementById("batas_waktu").value == "") {
            alert("missing batas waktu");
            return;
        }
        //   if (document.getElementById("tgl_bayar").value == "") {
        //     alert("missing tanggal transaksi");
        //     return;
        //   }
        if (document.getElementById("status").value == "") {
            alert("missing status");
            return;
        }
        if (this.state.detail_transaksi.length == 0) {
            alert("Missing Paket");
            return;
        }
        if (this.state.detail_transaksi.length == 0) {
            alert("Missing Paket");
            return;
        }

        let endpoint = `${baseUrl}/transaksi`
        let user = JSON.parse(localStorage.getItem("user"))
        let newData = {
            id_member: this.state.id_member,
            tgl: this.state.tgl,
            batas_waktu: this.state.batas_waktu,
            tgl_bayar: this.state.tgl_bayar,
            dibayar: this.state.dibayar,
            id_user: user.id_user,
            detail_transaksi: this.state.detail_transaksi
        }

        axios.post(endpoint, newData, authorization)
            .then(response => {
                window.alert(response.data.message)
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getMember()
        this.getPaket()

        let user = JSON.parse(localStorage.getItem("user"))
        if (user.role !== 'admin' && user.role !== 'kasir') {
            window.alert(`Maaf anda bukan admin atau kasir!`)
            window.location.href = "/"
        }
    }

    render() {
        return (
            <div className="container">
                <div className="card" id="bg-modal">
                    <div className="card-body">
                        <h4 className="mb-3">
                            Transaction form
                        </h4>
                        Member
                        <select id="memberr" className="form-control mb-3" value={this.state.id_member} onChange={ev => this.setState({ id_member: ev.target.value })}>
                            {this.state.members.map(member => (
                                <option value={member.id_member}>
                                    {member.nama}
                                </option>
                            ))}
                        </select>

                        Tanggal Transaksi
                        <input id="tgl" type="date" className="form-control mb-3" value={this.state.tgl} onChange={ev => this.setState({ tgl: ev.target.value })} />

                        Batas waktu
                        <input id="batas_waktu" type="date" className="form-control mb-3" value={this.state.batas_waktu} onChange={ev => this.setState({ batas_waktu: ev.target.value })} />

                        Tanggal Bayar
                        <input id="tgl_bayar" type="date" className="form-control mb-3" value={this.state.tgl_bayar} onChange={ev => this.setState({ tgl_bayar: ev.target.value })} />

                        Status Bayar
                        <select id="status" className="form-control mb-3" value={this.state.dibayar} onChange={ev => this.setState({ dibayar: ev.target.value })}>
                            <option value={1}>Sudah dibayar</option>
                            <option value={0}>Belum dibayar</option>
                        </select>

                        <button className="btn" id="button-add" onClick={() => this.addPaket()}>
                        <i class="fa-solid fa-plus me-2"></i>Tambah paket
                        </button>

                        <h5 className="mt-3">Detail Transaksi</h5>
                        {this.state.detail_transaksi.map((detail) => (
                            <div className="row mb-2">
                                {/* area nama paket */}
                                <div className="col-lg-3">
                                    {detail.jenis_paket}
                                </div>

                                {/* area qty */}
                                <div className="col-lg-2">
                                    Qty: {detail.qty}
                                </div>

                                {/* area harga paket */}
                                <div className="col-lg-3">
                                    Rp {detail.harga}
                                </div>

                                {/* area harga total */}
                                <div className="col-lg-3">
                                    Rp {detail.harga * detail.qty}
                                </div>

                                <div className="col-lg-1">
                                    <button className="btn btn-sm btn-danger"
                                        onClick={() => this.deleteData(detail.id_paket)}>
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* modal untuk pilihan paket */}
                        <div className="modal fade" id="modal_paket">
                            <div className="modal-dialog modal-md">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h4>
                                            Pilih paket
                                        </h4>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={(e) => this.tambahPaket(e)}>
                                            Pilih paket
                                            <select className="form-control mb-2" value={this.state.id_paket}
                                                onChange={(e) => this.setState({ id_paket: e.target.value })}>
                                                <option value="">Pilih paket</option>
                                                {this.state.pakets.map((paket) => (
                                                    <option value={paket.id_paket}>
                                                        {paket.jenis_paket}
                                                    </option>
                                                ))}
                                            </select>
                                            Qty
                                            <input type="number" className="form-control mb-2" value={this.state.qty}
                                                onChange={(e) => this.setState({ qty: e.target.value })} />
                                            <button type="submit" className="btn btn-success">Tambah</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* button save transaksi */}
                        <button type="submit" className="btn btn-primary" onClick={() => this.simpanTransaksi()}>
                            Simpan transaksi
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}