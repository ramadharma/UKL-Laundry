import axios from "axios";
import React from "react";
import { authorization, baseUrl } from "../config";
import logo from "../logo.png";

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: ""
        }
    }

    loginProcess(event) {
        event.preventDefault()

        let endpoint = `${baseUrl}/auth`

        let data = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post(endpoint, data, authorization)
            .then(result => {
                if (result.data.logged) {
                    // store token in local storage
                    localStorage.setItem("token", result.data.token)
                    localStorage.setItem("user", JSON.stringify(result.data.user))
                    window.alert("Login Success!")
                    window.location.href = "/"
                } else {
                    window.alert("Check ur username and password again!")
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <div id="body">
                <div id="tempat">
                    <center>
                        <div id="header">
                            <img id="logo-login" src={logo} width="60px" />
                            <h4 id="title-login">
                                You Never
                            </h4>
                            <h4 id="title-login">
                                Wash Alone
                            </h4>
                        </div>
                    </center>


                    <div id="login-card" className="card">
                        <div className="card-body">
                            <h5 className="text-center">LOGIN</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={ev => this.loginProcess(ev)}>

                                <input placeholder="Username" id="input-login" type="text" className="form-control mb-3" required value={this.state.username}
                                    onChange={ev => this.setState({ username: ev.target.value })} />


                                <input placeholder="Password" id="input-login" type="password" className="form-control mb-3" required value={this.state.password}
                                    onChange={ev => this.setState({ password: ev.target.value })} />

                                <button type="submit" className="btn btn-login btn-primary">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>


            </div>

            // <div className="container">

            // </div>
        )
    }
}

export default Login;