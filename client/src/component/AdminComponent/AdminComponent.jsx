import React, { useEffect, useState } from "react";
import "./AdminComponent.scss";

import axios from "axios";
import { REGISTER_API, LOGIN_API, ALLUSERADMIN } from "../../utils/urls";

import { HeaderComponent, IconButton } from "../Component";
import InputBox from "../subComponent/InputBox/InputBox";
import DataTable from "react-data-table-component";

import { RiLockPasswordFill } from "react-icons/ri";
import { MdPersonAdd, MdPersonRemoveAlt1, MdSearch } from "react-icons/md";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { MdHome } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { Link } from "react-router-dom";

export function CreateUserComponent() {
  const roles = [
    {
      id: 1,
      name: "Admin",
    },
    {
      id: 2,
      name: "R&S",
    },
    {
      id: 3,
      name: "HOD",
    },
  ];

  const Department = [
    {
      id: 1,
      name: "Department of Computer Science & Engineering",
    },
  ];
  const [values, setValues] = useState({
    eid: "",
    name: "",
    role: null,
    department: null,
    email: "",
    phone: "",
  });
  console.log(values);
  const registerUser = () => {
    axios
      .post(REGISTER_API, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Response: ", response);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };
  return (
    <>
      <HeaderComponent title={"User Creation"} />
      <div className="create__user">
        <div className="create__user_wrapper">
          <h1>Registration</h1>
          <Link to="/admin/users">
            <MdHome className="home_icon" />
          </Link>
          <div className="user_input_box">
            <InputBox
              title={"Employee Identification"}
              onChangehandler={(e) =>
                setValues({ ...values, eid: e.target.value })
              }
            />
            <InputBox
              title={"Employee Name"}
              onChangehandler={(e) =>
                setValues({ ...values, name: e.target.value })
              }
            />

            <div className="InputBox__container">
              <label className="InputBox__label">Role : </label>
              <select
                defaultValue={""}
                required
                onChange={(e) => setValues({ ...values, role: e.target.value })}
              >
                <option disabled value="">
                  Select Role
                </option>
                {roles &&
                  roles.map((opt, index) => (
                    <option key={index} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="InputBox__container">
              <label className="InputBox__label">Department : </label>
              <select
                defaultValue={""}
                required
                onChange={(e) =>
                  setValues({ ...values, department: e.target.value })
                }
              >
                <option disabled value="">
                  Select Department
                </option>
                {Department &&
                  Department.map((opt, index) => (
                    <option key={index} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
              </select>
            </div>
            <InputBox
              title={"Email"}
              type="email"
              onChangehandler={(e) =>
                setValues({ ...values, email: e.target.value })
              }
            />
            <InputBox
              title={"Phone"}
              type="tel"
              onChangehandler={(e) =>
                setValues({ ...values, phone: e.target.value })
              }
            />
          </div>
          <div className="user_register_btn">
            <button onClick={registerUser}>Register</button>
          </div>
        </div>
      </div>
    </>
  );
}

export function ManageUserComponent({ setSelectedRow }) {
  const [users, setUsers] = useState({});
  const [records, setRecords] = useState({});

  // const [selectedRow, setSelectedRow] = useState(null);
  const columns = [
    {
      name: "Sl no",
      selector: (row) => row.id,
      sortable: true,
      cell: (row, index) => <div>{index + 1}</div>,
      width: "100px",
    },
    {
      name: "EID",
      selector: (row) => row.eid,
      sortable: true,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department.name,
      sortable: true,
      width: "400px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      width: "auto",
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      width: "auto",
    },
    {
      name: "Password",
      selector: (row) => row.password,
      // cell: CustomCell,
    },
  ];

  useEffect(() => {
    axios
      .get(ALLUSERADMIN)
      .then((res) => {
        const x = localStorage.setItem(
          "users_data",
          JSON.stringify(res.data.users)
        );
      })
      .catch((error) => console.log(error));
    setUsers(JSON.parse(localStorage.getItem("users_data")));
    setRecords(JSON.parse(localStorage.getItem("users_data")));
  }, []);
  // console.log(users)

  const handleFilter = (e) => {
    const newData = users.filter((row) => {
      const searchTerm = e.target.value.toLowerCase();
      return Object.values(row).some(
        (val) => val && val.toString().toLowerCase().includes(searchTerm)
      );
    });
    setRecords(newData);
  };

  function CustomCell({ row }) {
    const [isTextVisible, setIsTextVisible] = useState(false);

    const handleIconClick = () => {
      setIsTextVisible(!isTextVisible);
    };

    return (
      <div>
        <span onClick={handleIconClick}>
          {isTextVisible ? <IoMdEye /> : <IoMdEyeOff />}
        </span>
        {isTextVisible && <div>{row}</div>}
      </div>
    );
  }

  return (
    <>
      <HeaderComponent title={"Manage Users"} />
      <div className="manage_user">
        <div className="manage_user_tools">
          <Link to="./create">
            <IconButton icon={<MdPersonAdd />} text="Create User" />
          </Link>
          <IconButton icon={<MdPersonRemoveAlt1 />} text="Deactivate User" />
          <IconButton icon={<RxUpdate />} text="Modify Details" />
          <Link to="./reset-password">
            <IconButton icon={<RiLockPasswordFill />} text="Change Password" />
          </Link>
        </div>
        <div className="admin_data_table">
          <div className="filters">
            <div className="filter">
              <label htmlFor="">Search: </label>
              <input type="text" onChange={handleFilter} />
              <MdSearch />
            </div>
          </div>
          <DataTable
            noDataComponent={"No User found!"}
            responsive={true}
            data={records}
            columns={columns}
            selectableRows={true}
            selectableRowsSingle={true}
            onSelectedRowsChange={(e) =>
              setSelectedRow(e.selectedCount && e.selectedRows[0])
            }
          />
        </div>
      </div>
    </>
  );
}

export function ChangeUserPassComponent({ selectedRow }) {
  console.log(selectedRow);
  return (
    <>
      <HeaderComponent title={"Reset User Password"} />
      <div className="create__user">
        <div className="create__user_wrapper">
          <h1>Reset Password</h1>
          <Link to="/admin/users">
            <MdHome className="home_icon" />
          </Link>
          <div className="user_input_box">
            <div className="reset_pass_box">
              <label htmlFor="">Name: </label>
              <span>{selectedRow.name}</span>
            </div>
            <div className="reset_pass_box">
              <label htmlFor="">Email: </label>
              <span>{selectedRow.email}</span>
            </div>
          </div>
          <div className="reset_pass_consent">
            <label htmlFor="">
              <input type="checkbox" />
              <span>Confirm, you want to reset password ?</span>
            </label>
          </div>
          <div className="user_register_btn">
            <button>Reset Password</button>
          </div>
        </div>
      </div>
    </>
  );
}
