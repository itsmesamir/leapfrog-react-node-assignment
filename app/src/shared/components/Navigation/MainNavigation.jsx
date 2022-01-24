import React, {useState}from "react";
import { Link } from "react-router-dom";
import ReactDom from "react-dom";

import MainHeader from "./MainHeader";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

const MainNavigation = (props) => {  
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = () =>{
    setDrawerOpen(true);
  }
  const closeDrawer = () =>{
    setDrawerOpen(false);
  }
  return (
    <React.Fragment>
      {isDrawerOpen && <Backdrop onClick={closeDrawer}/>}
      <SideDrawer show = {isDrawerOpen}>
        <nav className="main-navigation__drawer-nav" onClick={closeDrawer}>
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader name="helo">
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">Your Contacts</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
