import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { authorization, baseUrl } from "../config.js";

class Member extends React.Component {
    constructor() {
        super();
        this.state = {
            masterPacks: [],
            search: "",
            id_member: "",
            nama: "",
            alamat: "",
            jenis_kelamin: "",
            telepon: "",
            action: "",
            role: "",
            members: [
                {
                    id_member: "1", nama: "Joey",
                    alamat: "Kauman", jenis_kelamin: "Pria",
                    telepon: "082331378431"
                },
                {
                    id_member: "2", nama: "Rachel",
                    alamat: "Dau", jenis_kelamin: "Perempuan",
                    telepon: "084993008748"
                },
                {
                    id_member: "3", nama: "Ross",
                    alamat: "Lowokwaru", jenis_kelamin: "Pria",
                    telepon: "08338475998"
                }
            ]
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        this.modalMember = new Modal(document.getElementById("modal_member"));
        this.modalMember.show() //menampilkan modal
        // reset state untuk form member
        this.setState({
            action: "tambah",
            id_member: Math.random(1, 10000),
            nama: "",
            alamat: "",
            jenis_kelamin: "Perempuan",
            telepon: ""
        })
    }

    simpanData(event) {
        event.preventDefault();
        // preventDefault -> mencegah aksi default dari form submit(reload)

        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/member`

            // menampung data isian dari user
            let data = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                jenis_kelamin: this.state.jenis_kelamin,
                telepon: this.state.telepon
            }


            // tambahkan ke state members (array)

            // let temp = this.state.members;
            // temp.push(data) // push -> digunakan untuk menambah data pada array
            // this.setState({ members: temp });

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // menghilangkan modal
            this.modalMember.hide()
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/member/` + this.state.id_member

            let data = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                jenis_kelamin: this.state.jenis_kelamin,
                telepon: this.state.telepon
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // let temp = this.state.members;
            // let index = temp.findIndex(
            //     member => member.id_member === this.state.id_member
            // )

            // temp[index].nama = this.state.nama;
            // temp[index].jenis_kelamin = this.state.jenis_kelamin;
            // temp[index].telepon = this.state.telepon;
            // temp[index].alamat = this.state.alamat;

            // this.setState({ members: temp });
            this.modalMember.hide()
        }

    }

    ubahData(id_member) {
        this.modalMember = new Modal(document.getElementById("modal_member"));
        this.modalMember.show()

        // mencari index posisi dari data member yang akan diubah
        let index = this.state.members.findIndex(
            member => member.id_member === id_member
        )

        this.setState({
            action: "ubah",
            id_member: id_member,
            nama: this.state.members[index].nama,
            alamat: this.state.members[index].alamat,
            jenis_kelamin: this.state.members[index].jenis_kelamin,
            telepon: this.state.members[index].telepon
        })
    }

    hapusData(id_member) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini?")) {
            let endpoint = `${baseUrl}/member/` + id_member

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // mencari posisi index dari data member yang akan dihapus
            // let temp = this.state.members;
            // let index = temp.findIndex(
            //     member => member.id_member === id_member
            // );

            // hapus data
            // temp.splice(index, 1);

            // this.setState({ members: temp });
        }
    }

    getData() {
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ members: response.data })
                this.setState({ masterPacks: response.data })
            })
            .catch(error => console.log(error))
    }

    showAddButton() {
        if (this.state.role === 'admin' || this.state.role === 'kasir') {
            return (
                <button id="button-add" className="btn btn-success my-2" onClick={() => this.tambahData()}>
                    <i class="fa-solid fa-plus me-2"></i>Add new member
                </button>
            )
        }
    }

    searching(ev) {
        let code = ev.keyCode;
        if (code === 13) {
            let data = this.state.masterPacks;
            let found = data.filter(it =>
                it.nama.toLowerCase().includes(this.state.search.toLowerCase()))
            this.setState({ members: found });
        }
    }

    componentDidMount() {
        // fungsi ini dijalankan setelah fungsi render berjalanan
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))

        // cara kedua
        this.setState({ role: user.role })

        // cara kedua
        if (user.role === 'admin' || user.role === 'kasir') {
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
                <h4 className="mb-2" id="title-member">
                    List member
                </h4>


                <div className="row mb-2">
                    <div className="col-4 align-self-center">
                        <div className="input-group">
                            <input className="form-control border-end-0 border" type="Search" id="example-search-input" placeholder="Search member"
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
                            {this.showAddButton()}
                        </div>
                    </div>
                </div>

                <div className="card">
                    {/* <div className="card-header bg-secondary">
                        <h4 className="text-white">
                            Members
                        </h4>
                    </div> */}

                    <div className="card-body">
                        {/* <div className="mb-2"> */}


                        {/* <input className="form-control" type="text" placeholder="Search member"
                            value={this.state.search}
                            onChange={ev => this.setState({ search: ev.target.value })}
                            onKeyUp={(ev) => this.searching(ev)}></input> */}
                        {/* </div> */}

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Telephone</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {this.state.members.map((member) => (
                                    <tr id="table-row">
                                        <td>{member.nama}</td>
                                        <td>{member.jenis_kelamin}</td>
                                        <td>{member.telepon}</td>
                                        <td>{member.alamat}</td>
                                        <td>
                                            <button id="button-edit" className={`btn btn-sm mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.ubahData(member.id_member)}>
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>

                                            <button id="button-delete" className={`btn btn-sm mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(member.id_member)}>
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* </table>
                            <table id="example" className="table table-striped" >

                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Gender</th>
                                        <th>Telephone</th>
                                        <th>Address</th>
                                        <th>action</th>
                                    </tr>
                                </thead>
                                {this.state.members.map(member => (
                                <tbody>
                                    <td>{member.nama}</td>
                                    <td>{member.jenis_kelamin}</td>
                                    <td>{member.telepon}</td>
                                    <td>{member.alamat}</td>
                                    <td>
                                        <button className={`btn btn-sm btn-warning mx-2 ${this.state.visible ? `` : `d-none`}`}
                                            onClick={() => this.ubahData(member.id_member)}>
                                            Edit
                                        </button>

                                        <button className={`btn btn-sm btn-danger mx-2 ${this.state.visible ? `` : `d-none`}`}
                                            onClick={() => this.hapusData(member.id_member)}>
                                            Delete
                                        </button>
                                    </td>
                                </tbody>
                                ))}
                            </table> */}



                        {/* <ul className="list-group">
                            {this.state.members.map(member => (
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-lg-2">
                                            <small className="text-secondary">Name</small>
                                            <br />
                                            <h6>{member.nama}</h6>
                                        </div>
                                        <div className="col-lg-2">
                                            <small className="text-secondary">Gender</small>
                                            <br />
                                            <h6>{member.jenis_kelamin}</h6>
                                        </div>
                                        <div className="col-lg-2">
                                            <small className="text-secondary">Telephone</small>
                                            <br />
                                            <h6>{member.telepon}</h6>
                                        </div>
                                        <div className="col-lg-4">
                                            <small className="text-secondary">Address</small>
                                            <br />
                                            <h6>{member.alamat}</h6>
                                        </div>
                                        <div className="col-lg-2 justify-content-center align-self-center">
                                            <button className={`btn btn-sm btn-warning mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.ubahData(member.id_member)}>
                                                Edit
                                            </button>

                                            <button className={`btn btn-sm btn-danger mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(member.id_member)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul> */}

                    </div>
                </div>

                {/* form modal add new member */}
                <div className="modal fade" id="modal_member">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content" id="bg-modal">
                            <div className="modal-body">
                                <h4 className="mb-3">
                                    Form Member
                                </h4>
                                <form onSubmit={ev => this.simpanData(ev)} >
                                    Name
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.nama} onChange={ev => this.setState({ nama: ev.target.value })}
                                        required />

                                    Gender
                                        <select class="form-select mb-2" aria-label="Default select example"
                                            value={this.state.jenis_kelamin} onChange={ev => this.setState({ role: ev.target.value })} required>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>

                                    Telephone
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.telepon} onChange={ev => this.setState({ telepon: ev.target.value })} required />

                                    Address
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.alamat} onChange={ev => this.setState({ alamat: ev.target.value })} required />

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

export default Member;