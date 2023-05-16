import React from "react";
import "./Sidebar.scss";
import CUHLogo from "../../assets/cuh.png";
import Sidebar_menu from "../subComponent/sidebar_menu/sidebarMenu";
import Button from "../subComponent/Button/Button";
import { LogOutButton, SButton } from "../subComponent/styledButton";

export default function Sidebar({ greeting, data }) {
  console.log(data);
  return (
    <section className="sidebar-section">
      <div className="sidebar-wrapper">
        <div className="sidebar-header">
          <img src={CUHLogo} alt="cuh logo" />
          <span>{greeting}</span>
        </div>
        <div className="sidebar-action">
          {data &&
            data.map((x, index) => {
              return (
                <Sidebar_menu
                  key={index}
                  icon={x.icon}
                  title={x.title}
                  link={x.link}
                />
              );
            })}
          <div className="btn-logout">
            <LogOutButton
              onClick={(e) => {
                localStorage.removeItem("auth");
                window.location.href = "/";
              }}
            >
              Log Out
            </LogOutButton>
          </div>
        </div>
      </div>
    </section>
  );
}
