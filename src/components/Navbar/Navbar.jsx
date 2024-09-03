import React from 'react'
import './navbar.css'
const Navbar = (props) => {
  return (
    <nav className="navbar">
      <ul className="nav_list">
        {props.children}
      </ul>
    </nav>
  );
}

export default Navbar