import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { authorization, baseUrl } from "../config";

class User extends React.Component {
    constructor() {
        super();
        this.state = {
            masterPacks: [],
            search: "",
            id_user: "",
            nama: "",
            username: "",
            password: "",
            role: "",
            action: "",
            fillPassword: true,
            users: [
                {
                    id_user: "1", nama: "phoebe", username: "phoebethegoat", password: "phoebe123", role: "admin"
                },
                {
                    id_user: "2", nama: "rick", username: "rickomorty", password: "rick123", role: "admin"
                },
                {
                    id_user: "3", nama: "keita", username: "nabykeita", password: "keita123", role: "admin"
                }
            ]
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        this.modalUser = new Modal(document.getElementById("modal_user"));
        this.modalUser.show()

        this.setState({
            action: "tambah",
            id_user: Math.random(1, 10000),
            nama: "",
            username: "",
            password: "",
            role: "",
            fillPassword: true
        })
    }

    simpanData(event) {
        event.preventDefault();

        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/users`

            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalUser.hide(0)
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/users/` + this.state.id_user

            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                role: this.state.role
            }

            if (this.state.fillPassword === true) {
                data.password = this.state.password
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalUser.hide()
        }
    }

    ubahData(id_user) {
        this.modalUser = new Modal(document.getElementById("modal_user"));
        this.modalUser.show()

        let index = this.state.users.findIndex(
            user => user.id_user === id_user
        )

        this.setState({
            action: "ubah",
            id_user: id_user,
            nama: this.state.users[index].nama,
            username: this.state.users[index].username,
            password: "",
            role: this.state.users[index].role,
            fillPassword: false
        })
    }

    hapusData(id_user) {
        if (window.confirm("Apakah anda yakin ingin menghapus data ini")) {
            let endpoint = `${baseUrl}/users/` + id_user

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    searching(ev) {
        let code = ev.keyCode;
        if (code === 13) {
            let data = this.state.masterPacks;
            let found = data.filter(it =>
                it.nama.toLowerCase().includes(this.state.search.toLowerCase()))
            this.setState({ users: found });
        }
    }

    getData() {
        let endpoint = `${baseUrl}/users`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ users: response.data })
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

    showPassword() {
        if (this.state.fillPassword === true) {
            return (
                <div>
                    Password
                    <input type="password" className="form-control mb-1" required
                        value={this.state.password} onChange={ev => this.setState({ password: ev.target.value })} />
                </div>
            )
        }
        else {
            return (
                <button className="btn btn-success mb-1" onClick={() => this.setState({ fillPassword: true })}>
                    Change Password
                </button>
            )
        }
    }

    render() {
        return (
            <div className="container">
                <h4 className="mb-2">
                    List user
                </h4>

                <div className="row mb-2">
                    <div className="col-4 align-self-center">
                        <div className="input-group">
                            <input className="form-control border-end-0 border" type="Search" id="example-search-input" placeholder="Search user"
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
                                <i class="fa-solid fa-plus me-2"></i>Add new user
                            </button>
                        </div>
                    </div>
                </div>


                <div className="card">
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.users.map(userr => (
                                    <tr id="table-row">
                                        <td>{userr.nama}</td>
                                        <td width="30%">{userr.username}</td>
                                        <td>{userr.role}</td>
                                        <td width="20%">
                                            <button id="button-edit" className={`btn btn-sm mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.ubahData(userr.id_user)}>
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>

                                            <button id="button-delete" className={`btn btn-sm mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(userr.id_user)}>
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>

                {/* form modal add new user */}
                <div className="modal fade" id="modal_user">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content" id="bg-modal">
                            <div className="modal-body">
                                <h4 className="mb-3">
                                    Form User
                                </h4>
                                <form onSubmit={ev => this.simpanData(ev)}>
                                    Name
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.nama} onChange={ev => this.setState({ nama: ev.target.value })} required/>

                                    Username
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} required/>

                                    {this.showPassword()}
                                    <br />

                                    Role
                                    <select class="form-select mb-2" aria-label="Default select example"
                                        value={this.state.role} onChange={ev => this.setState({ role: ev.target.value })} required>
                                        <option value="admin">Admin</option>
                                        <option value="kasir">Kasir</option>
                                        <option value="owner">Owner</option>
                                    </select>



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

export default User;