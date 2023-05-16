import React, {useState} from "react";
import Sidebar from "../../component/Sidebar/Sidebar";
import "./Admin.scss";
import { AdminMenuIcons } from "../../componentUtils/MenuIcons";
import { Route, Routes } from "react-router-dom";
import { DashboardComponent } from "../../component/Component";
import {
  CreateUserComponent,
  ManageUserComponent,
  ChangeUserPassComponent,
} from "../../component/AdminComponent/AdminComponent";

export default function Admin() {
  const [selectedRow, setSelectedRow] = useState(null)
  const urlWindow = window.location;
  const url =
    urlWindow.pathname.split("/")[1] + "/" + urlWindow.pathname.split("/")[2];
  console.log(window.location.href);

  return (
    <>
      <div className="admin-section">
        <div className="admin-sidebar">
          <Sidebar greeting={"Welcome Admin"} data={AdminMenuIcons} />
        </div>
        <div className="admin-container">
          <Routes>
            <Route
              path="/"
              element={<DashboardComponent title={"Your Dashboard"} />}
            ></Route>
            <Route
              path="/users/create"
              element={<CreateUserComponent />}
            ></Route>
            <Route
              path="/users/reset-password"
              element={<ChangeUserPassComponent selectedRow={selectedRow}/>}
            ></Route>
            <Route path="/users" element={<ManageUserComponent setSelectedRow={setSelectedRow}/>}></Route>
          </Routes>
        </div>
      </div>
    </>
  );
}
