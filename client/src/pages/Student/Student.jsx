import React, { useEffect, useState } from "react";
import "./Student.scss";

import InputBox from "../../component/subComponent/InputBox/InputBox";
import { SButton } from "../../component/subComponent/styledButton";
import { Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import axios from "axios";
import { RESULTAPI, getEndpoint, BASE_URL } from "../../utils/urls";

export default function Student() {
  const [data, setData] = useState({
    roll: null,
    session: null,
    semester: null,
    programme: null,
    department: null,
  });
  console.log(data);

  const [formData, setFormData] = useState({});

  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);

  const [result, setResult] = useState({});

  useEffect(() => {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem("portalData"));
    setFormData(dataFromLocalStorage);
    console.log(formData);
  }, []);

  const handleSchoolChange = (e) => {
    const schoolId = parseInt(e.target.value);

    const departmentList = formData.departments.filter(
      (department) => department.school === schoolId
    );
    setDepartments(departmentList);
  };

  const handleDepartmentChange = (e) => {
    const deptId = parseInt(e.target.value);

    const programmeList = formData.programmes.filter(
      (programme) => programme.department === deptId
    );
    setProgrammes(programmeList);
    setData({ ...data, department: deptId });
  };

  const getResult = () => {
    const isEmpty = Object.values(data).some((x) => x == null || x == "");

    if (!isEmpty) {
      axios
        .post("http://127.0.0.1:5000/api/v1/students/get-result", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          setResult(response.data);
          if (response.data.result)
            window.open(
              new URL(response.data.result, BASE_URL).href,
              "_blank",
              "noreferrer"
            );
          setTimeout(() => setResult(null), 3e3);
        })
        .catch((error) => console.log("Error: ", error));
    } else {
      setResult({
        result: false,
        message: "Please fill all required data columns.",
      });
      setTimeout(() => setResult(null), 3e3);
    }
  };

  return (
    <>
      <section className="student-section">
        <div className="header">
          <span>Student Area</span>
          <ul>
            <li>
              {/* <MdHome/> */}
              <Link to="/">Home</Link>
            </li>
          </ul>
        </div>
        <main>
          <span>Enter your details</span>
          <div className="content-area">
            {/* <InputBox
              title="Name"
              placeholder={"Enter your name"}
              onChangehandler={(e) =>
                setData({ ...data, student_name: e.target.value })
              }
            /> */}
            <InputBox
              title={"Roll No"}
              placeholder="Enter your roll no"
              onChangehandler={(e) =>
                setData({ ...data, roll: parseInt(e.target.value) })
              }
            />
            <div className="InputBox__container">
              <label className="InputBox__label">Session : </label>
              <select
                defaultValue={""}
                required
                onChange={(e) =>
                  setData({ ...data, session: parseInt(e.target.value) })
                }
              >
                <option disabled value="">
                  Select Session
                </option>
                {formData.sessions &&
                  formData.sessions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.session}
                    </option>
                  ))}
              </select>
            </div>
            <InputBox
              placeholder={"Enter Semester"}
              type={"number"}
              title={"Semester"}
              extraProps={{ min: 1 }}
              onChangehandler={(e) =>
                setData({ ...data, semester: parseInt(e.target.value) })
              }
            />
            <div className="InputBox__container">
              <label className="InputBox__label">School : </label>
              <select defaultValue={""} required onChange={handleSchoolChange}>
                <option disabled value="">
                  Select School
                </option>
                {formData.schools &&
                  formData.schools.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="InputBox__container">
              <label className="InputBox__label">Department : </label>
              <select
                defaultValue={""}
                onChange={handleDepartmentChange}
                required
              >
                <option disabled value="">
                  Select Department
                </option>
                {departments &&
                  departments.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="InputBox__container">
              <label className="InputBox__label">Programme : </label>
              <select
                defaultValue={""}
                onChange={(e) =>
                  setData({ ...data, programme: parseInt(e.target.value) })
                }
                required
              >
                <option disabled value="">
                  Select Programme
                </option>
                {programmes &&
                  programmes.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <SButton
              bgColor={"#1479ff"}
              hoverBg={"#539dff"}
              onClick={getResult}
            >
              Get Result
            </SButton>
          </div>
          {result && (
            <div
              style={{
                color: result.result ? "green" : "red",
                marginTop: "5px",
              }}
            >
              {result.message}
            </div>
          )}
        </main>
      </section>
    </>
  );
}
