import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = () =>{
  const auth = useContext(AuthContext);
  return(
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>All Users</NavLink>
      </li>
      {auth.isLoggedIn && (
      <li>
        <NavLink to="/u1/contacts">My Contacts</NavLink>
      </li>)}
      {auth.isLoggedIn && (
      <li>
        <NavLink to="/contacts/new">Add Contacts</NavLink>
      </li>)}
      {auth.isLoggedIn && (
      <li>
        <NavLink exact to="/favourites">Favourites</NavLink>
      </li>)}
      {!auth.isLoggedIn && (
      <li>
        <NavLink to="/auth">Authenticate</NavLink>
      </li>)}
      {auth.isLoggedIn && (
      <li>
       <button onClick={auth.logout}>LOGOUT</button>
      </li>)}
      
    </ul>

  );
}

export default NavLinks;