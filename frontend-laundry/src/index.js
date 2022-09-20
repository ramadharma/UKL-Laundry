import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import App from './App';

// import Member from './pages/Member';

// import Paket from './pages/Paket';

// import User from './pages/User';

import Login from './pages/Login';

import Transaksi from './pages/Transaksi';

import FormTransaksi from './pages/FormTransaksi';

import App from './App';

import reportWebVitals from './reportWebVitals';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

import "@fortawesome/fontawesome-free/css/all.min.css";

// import 'mdb-react-ui-kit/dist/css/mdb.min.css'

// import "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.1/css/bootstrap.min.css";
// import "https://cdn.datatables.net/1.11.5/css/dataTables.bootstrap5.min.css"

ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* <Login /> */}
    {/* <FormTransaksi />
    <Transaksi /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
