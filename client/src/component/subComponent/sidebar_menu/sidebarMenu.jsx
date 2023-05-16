import React from "react";
import { Link } from "react-router-dom";
import "./sidebarMenu.scss";

export default function Sidebar_menu({ icon, title, link }) {
  return (
    <>
      <Link className="sidebar_menu_a" to={link}>
        <div className="menu__container">
          <div className="menu__icon">{icon}</div>
          <span>{title}</span>
        </div>
      </Link>
    </>
  );
}
