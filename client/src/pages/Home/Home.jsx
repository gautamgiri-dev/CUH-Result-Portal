import React, { useEffect } from "react";
import "./Home.scss";
import { Link } from "react-router-dom";
import CUHLogo from "../../assets/cuh.png";
import heroImage from "../../assets/hero-image.png";
import facultyIcon from "../../assets/faculty.png";
import studentIcon from "../../assets/student.png";

import { getEndpoint, PORTALDATA } from "../../utils/urls";
import axios from "axios";

export default function Home() {
  useEffect(() => {
    const portalData = () => {
      axios
        .get(getEndpoint(PORTALDATA))
        .then((response) => {
          if (response) {
            localStorage.setItem("portalData", JSON.stringify(response.data));
            console.log(response.data);
          }
        })
        .catch((error) => console.log("Error: ", error));
    };
    portalData();
  }, []);

  return (
    <>
      <div className="container">
        <nav className="navigation-bar">
          <div className="navigation-wrapper">
            <Link to="/">
              <img src={CUHLogo} alt="" className="nav-image" />
            </Link>
            <div className="navigation-brand">
              <h1>Student Result Portal</h1>
            </div>
          </div>
        </nav>

        <section className="dashboard-section">
          <div className="wrapper">
            <div className="left-container">
              <img src={heroImage} alt="hero image" />
            </div>
            <div className="right-container">
              <div className="right-container-wrapper">
                <Link to="/students">
                  <div className="student-area">
                    <img src={studentIcon} alt="student Icon" />
                    <span>Student Area</span>
                  </div>
                </Link>
                <Link to="/faculty-login">
                  <div className="faculty-area">
                    <img src={facultyIcon} alt="university faculty icon" />
                    <span>Faculty Login</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
