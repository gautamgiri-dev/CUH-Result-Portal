import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./FacultyLogin.scss";
import CUHLogo from "../../assets/cuh.png";

import InputBox from "../../component/subComponent/InputBox/InputBox";
import { SButton } from "../../component/subComponent/styledButton";
import { BsArrowLeft } from "react-icons/bs";
import { LOGIN_API } from "../../utils/urls";

import axios from "axios";

export default function FacultyLogin() {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const loginUser = () => {
    setLoading(true);
    axios
      .post(LOGIN_API, values, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const auth = response.data.user;
        if (!auth.role) {
          alert(response.data.message);
          setLoading(false);
          return;
        } else {
          localStorage.setItem("auth", JSON.stringify(auth));

          if (auth && auth.role.id === 1) {
            window.location.href = "./admin/users";
          }
          if (auth && auth.role.id === 3) {
            window.location.href = "./hods/dashboard";
          }
          console.log(auth);

          setLoading(false);
        }
      })
      .catch((error) => console.log("Error: ", error));
  };

  return (
    <>
      <section className="faculty-login">
        <div className="wrapper">
          <div className="login-left-container">
            <div className="login-greeting">
              <Link to="/" className="login_back_home">
                <BsArrowLeft />
                <span>Back to home</span>
              </Link>
              <h1>Welcome back</h1>
              <span>Please enter your details</span>
            </div>

            <div className="data">
              <InputBox
                title={"Email"}
                placeholder={"Enter email address"}
                onChangehandler={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
              />
              <InputBox
                title={"Password"}
                placeholder={"Enter password"}
                type="password"
                onChangehandler={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
              <SButton
                bgColor={"#1479ff"}
                hoverBg={"#539dff"}
                onClick={loginUser}
                disabled={loading}
              >
                {loading ? "Please wait..." : "Login"}
              </SButton>
            </div>
          </div>
          <div className="login-right-container">
            <img src={CUHLogo} alt="" />
            <span>Faculty Login Area</span>
          </div>
        </div>
      </section>
    </>
  );
}
