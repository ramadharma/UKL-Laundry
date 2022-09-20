import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./logo.png"

function Logout() {
    // remove data token dan user dari local storage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
}

export default function Navbar(props) {
    return (
        <div>
            <nav className="navbar navbar-expand-lg mb-3">
                <div className="container">
                    {/* brand */}
                    <a id="brand" href="/" className="navbar-brand"><img id="logo" className="me-2" src={logo}/>
                    YNWA</a>

                    {/* button toggler */}
                    <button className="navbar-toggler"
                        data-bs-toggle="collapse" data-bs-target="#myNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* define menus */}
                    <center>
                        <div className="collapse navbar-light navbar-collapse" id="myNav">
                          <ul className="navbar-nav justify-content-center m-1">
                            <li className="nav-item me-3">
                                    <NavLink to="/" className="nav-link" >
                                        Dashboard
                                    </NavLink>
                                </li>

                                <li className="nav-item me-3">
                                    <NavLink to="/Member" className="nav-link" >
                                        Member
                                    </NavLink>
                                </li>

                                <li className="nav-item me-3">
                                    <NavLink to="/User" className="nav-link" >
                                        User
                                    </NavLink>
                                </li>

                                <li className="nav-item me-3">
                                    <NavLink to="/Paket" className="nav-link" >
                                        Package
                                    </NavLink>
                                </li>

                                <li className="nav-item me-3">
                                    <NavLink to="/Transaksi" className="nav-link" >
                                        Transaction
                                    </NavLink>
                                </li>

                                <li className="nav-item" id="tambah-transaksi">
                                    <button id="text-button-new" className="btn btn-primary">
                                        <NavLink to="/FormTransaksi" className="nav-link" >
                                        <i class="fa-solid fa-plus fa-sm me-2" id="icon-newtrans" /><span id="span">New Transaction</span>
                                    </NavLink></button>
                                </li>
                            </ul>

                        </div>
                    </center>

                    <div className="inline">
                        <Link
                            to="/Login" className="nav-link"
                            onClick={() => Logout()} >
                            <i id="logout" class="fa-solid fa-arrow-right-from-bracket"/>
                        </Link>
                    </div>
                </div>
            </nav>
            {props.children}
        </div>
    )
}
