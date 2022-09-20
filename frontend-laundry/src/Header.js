import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
    return(
        <nav>
            <NavLink exact activeClassName="active" to="#">
                Home
            </NavLink>
            <NavLink exact activeClassName="active" path>
                Member
            </NavLink>
            <NavLink exact activeClassName="active" to="/pages/Paket">
                Paket
            </NavLink>
            <NavLink exact activeClassName="active" to="/pages/User">
                User
            </NavLink>
        </nav>
    )
}

export default Header;