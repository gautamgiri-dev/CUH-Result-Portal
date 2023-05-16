import React, { useEffect, useState } from "react";
import "./Hods.scss";

import { Routes, Route } from "react-router-dom";

import Sidebar from "../../component/Sidebar/Sidebar";
import Marquee from "../../component/subComponent/MarqueText/MarqueText";

import MarksTable from "../../component/subComponent/MarksTable/MarksTable";
import FileUploader from "../../component/subComponent/FileUploader/FileUploader";
import InputBox from "../../component/subComponent/InputBox/InputBox";
import DataTable from "react-data-table-component";
import { HodMenuIcons } from "../../componentUtils/MenuIcons";
import { DashboardComponent } from "../../component/Component";
import { HeaderComponent } from "../../component/Component";
import axios from "axios";
import { getEndpoint } from "../../utils/urls";
import { MdSearch, MdDelete } from "react-icons/md";

function UploadComponent() {
  const [sampleDataQuery, setSampleDataQuery] = useState({
    session: null,
    semester: "",
    programme: null,
  });

  //   name: str
  // • hod: int
  // • programme: int
  // • session: int
  // • semester: int
  // • uploadedOn: str [dd-mm-yyy]
  // • file: csv
  const [uploadData, setUploadData] = useState({
    name: "",
    hod: "",
    programme: "",
    session: null,
    semester: null,
    uploadedOn: new Date().toJSON().slice(0, 10).split("-").reverse().join("-"),
    files: null,
  });

  const [formData, setFormData] = useState({});
  const [authData, setAuthData] = useState({});
  const [programmes, setProgrammes] = useState([]);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFormData(JSON.parse(localStorage.getItem("portalData")));
    setAuthData(JSON.parse(localStorage.getItem("auth")));
  }, []);

  const programmePopulate = (e) => {
    const deptId = authData.department.id;

    const programmeList = formData.programmes.filter(
      (programme) => programme.department === deptId
    );
    setProgrammes(programmeList);
    setUploadData({ ...uploadData, session: e.target.value });
  };

  const handleDownloadFormat = (e) => {
    e.preventDefault();
    const baseUrl = getEndpoint("hods/download-format");

    if (!(uploadData.session && uploadData.programme && uploadData.semester)) {
      alert("Kindly fill session, programme and semester to download format!");
      return;
    }

    const url =
      baseUrl +
      "?" +
      new URLSearchParams({
        session: uploadData.session,
        programme: uploadData.programme,
        semester: uploadData.semester,
      }).toString();
    console.log(url);
    window.open(url, "_blank", "noreferrer");
  };

  const handleMarksUpload = (e) => {
    e.preventDefault();
    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("session", uploadData.session);
    uploadFormData.append("programme", uploadData.programme);
    uploadFormData.append("semester", uploadData.semester);
    uploadFormData.append("name", uploadData.name);
    uploadFormData.append("uploadedOn", uploadData.uploadedOn);

    uploadFormData.append("hod", authData.id);

    uploadFormData.append("file", uploadData.files[0]);

    axios
      .post(getEndpoint("hods/upload-internal-awards"), uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        alert(resp.data.message);
        setUploading(false);
      });
  };

  console.log("Session:", formData);
  console.log("AuthData:", authData);
  console.log("Programmes:", programmes);
  console.log("Query: ", sampleDataQuery);
  console.log("UploadData: ", uploadData);
  // console.log(authData.department.id)

  return (
    <div className="hod__upload">
      <HeaderComponent title="Upload Internal Awards" />
      <div className="hod_upload_container">
        <div className="hod__upload_area">
          <h1 className="hod__upload_area_header">
            Student Internal Awards Upload
          </h1>
          <div className="upload-form">
            <div className="file_options">
              <label htmlFor="">Session</label>
              <select required onChange={programmePopulate}>
                <option value="">Select session</option>
                {formData.sessions &&
                  formData.sessions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.session}
                    </option>
                  ))}
              </select>
            </div>
            <div className="file_options">
              <label htmlFor="">Programme</label>
              <select
                onChange={(e) =>
                  setUploadData({
                    ...uploadData,
                    programme: parseInt(e.target.value),
                  })
                }
                required
              >
                <option value="">Select Programme</option>
                {programmes &&
                  programmes.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="file_options">
              <label htmlFor="">Semester</label>
              <input
                type="number"
                placeholder="Enter the semester (eg. 3 or 4)"
                onChange={(e) =>
                  setUploadData({
                    ...uploadData,
                    semester: parseInt(e.target.value),
                  })
                }
                min={1}
              />
            </div>
            <div className="download-format-button">
              <a onClick={handleDownloadFormat} className="download-format-btn">
                Download Format
              </a>
            </div>
            <div className="file_options">
              <label htmlFor="">Remarks</label>
              <input
                type="text"
                placeholder="Please add remarks for upload"
                onChange={(e) =>
                  setUploadData({
                    ...uploadData,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div></div>
          </div>
          <div className="upload_box">
            {/* <span>Upload file: </span> */}
            <FileUploader
              onChange={(event) =>
                setUploadData({ ...uploadData, files: event.target.files })
              }
            />
          </div>
          <div onClick={handleMarksUpload} className="upload-btn-container">
            <div className="btn-upload" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </div>
          </div>
        </div>
        {/* <div className="hod_file_sample" style={{ display: "none" }}>
          <div className="sample_fail_container">
            <h1>Get Sample</h1>
            <span>
              Download sample file in order to install the data required by the
              server to process
            </span>
            <div className="file_options">
              <label htmlFor="">Session</label>
              <select
                onChange={(e) => {
                  programmePopulate();
                  setSampleDataQuery({
                    ...sampleDataQuery,
                    session: parseInt(e.target.value),
                  });
                }}
              >
                <option value="">Select session</option>
                {formData.sessions &&
                  formData.sessions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.session}
                    </option>
                  ))}
              </select>
            </div>
            <div className="file_options">
              <label htmlFor="">Programme: </label>
              <select
                required
                onChange={(e) =>
                  setSampleDataQuery({
                    ...sampleDataQuery,
                    programme: parseInt(e.target.value),
                  })
                }
              >
                <option value="">Select Programme</option>
                {programmes &&
                  programmes.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="file_options">
              <label htmlFor="">Semester: </label>
              <input
                type="number"
                placeholder="Enter the semester (eg. 3 or 4)"
                onChange={(e) =>
                  setSampleDataQuery({
                    ...sampleDataQuery,
                    semester: e.target.value,
                  })
                }
              />
            </div>
            <button onClick={downloadSample}>Download</button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

function ViewComponent() {
  return (
    <>
      <HeaderComponent title={"Students Internal Award History"} />
      <div className="hod__view_main">
        <div className="hod_recent_table">
          <MarksTable />
        </div>
      </div>
    </>
  );
}

function CourseComponent() {
  //   Route: /hods/create-subjects
  // ▪ Method: POST
  // ▪ Content-Type: application/json
  // ▪ Payload:
  // • session: int
  // • semester: int
  // • names: str
  // • codes: str
  // • department: int
  // • programme: int
  const [courseData, setCourseData] = useState({
    session: null,
    semester: null,
    department: null,
    programme: null,
    names: [],
    codes: [],
  });

  const [formData, setFormData] = useState({});

  const [nameState, setNameState] = useState("");
  const [codeState, setCodeState] = useState("");

  const [dummyNames, setDummyNames] = useState([]);

  const [authData, setAuthData] = useState({});
  const [programmes, setProgrammes] = useState([]);

  const [programmeState, setProgrammeState] = useState("");

  const [loading, setLoading] = useState(false);

  const columns = [
    {
      name: "S.No.",
      cell: (_, index) => <div>{index + 1}</div>,
      width: "100px",
    },
    {
      name: "Programme Name",
      selector: (row) => row.programme,
      sortable: true,
    },
    {
      name: "Course Name",
      selector: (row) => row.course_name,
      sortable: true,
    },
    {
      name: "Course Code",
      selector: (row) => row.course_code,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <>
          <MdDelete
            size={20}
            color={"#DB4437"}
            style={{ marginRight: "5px" }}
            onClick={(e) => handleDelete(e, row, index)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    setFormData(JSON.parse(localStorage.getItem("portalData")));
    setAuthData(JSON.parse(localStorage.getItem("auth")));
  }, []);

  const programmePopulate = () => {
    const deptId = JSON.parse(localStorage.getItem("auth")).department.id;

    console.log("department Id", deptId);

    const programmeList = formData.programmes.filter(
      (programme) => programme.department === deptId
    );
    setProgrammes(programmeList);
    // setCourseData((prevCourseData) => {
    //   prevCourseData["department"] = deptId;
    //   return prevCourseData;
    // });
  };

  const handleFilter = (e) => {
    const newData = users.filter((row) => {
      const searchTerm = e.target.value.toLowerCase();
      return Object.values(row).some(
        (val) => val && val.toString().toLowerCase().includes(searchTerm)
      );
    });
    setRecords(newData);
  };

  const handleDelete = (e, row, index) => {
    const data = courseData;

    data.names = data.names.filter((_, i) => i !== index);
    data.codes = data.codes.filter((_, i) => i !== index);

    setCourseData(data);
    setDummyNames(data.names);
  };

  const createSubject = () => {
    if (courseData.names && courseData.codes) {
      setLoading(true);
      const data = courseData;
      data["department"] = authData.department.id;
      // console.log(data);
      // console.log(authData.department);
      axios
        .post(getEndpoint("hods/create-subjects"), data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          alert(response.data.message);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    } else {
      alert("Kindly fill details to upload!");
    }
  };

  const addCourse = () => {
    if (!(courseData.session && courseData.programme && courseData.semester)) {
      alert("Please select session, semester and programme to add a course");
      return;
    }

    if (!(nameState && codeState)) {
      alert("Kindly fill the course name and course code!");
      return;
    }

    if (
      [
        { a: courseData.names, v: nameState },
        { a: courseData.codes, v: codeState },
      ].some(({ a, v }) =>
        a.some((x) => x.toString().toLowerCase() === v.toString().toLowerCase())
      )
    ) {
      alert("Duplicate entry found!");
      return;
    }
    setCourseData((prevCourseData) => {
      return {
        ...prevCourseData,
        names: [...prevCourseData.names, nameState],
        codes: [...prevCourseData.codes, codeState],
      };
    });

    setNameState("");
    setCodeState("");
    setDummyNames((prevNames) => [...prevNames, nameState]);
  };

  return (
    <>
      <HeaderComponent title={"Manage Department Courses"} />
      <div className="programme_section">
        <div className="programme_entry_section">
          <span></span>
          <div className="file_options">
            <label htmlFor="">Session: </label>
            <select
              disabled={courseData.session}
              required
              onChange={(e) => {
                programmePopulate();
                setCourseData({
                  ...courseData,
                  session: e.target.value,
                });
              }}
            >
              <option value="">Select session</option>
              {formData.sessions &&
                formData.sessions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.session}
                  </option>
                ))}
            </select>
          </div>

          <div className="file_options">
            <label htmlFor="">Semester: </label>
            <input
              type="number"
              disabled={courseData.semester}
              placeholder="Enter the semester (eg. 3 or 4)"
              onChange={(e) =>
                setCourseData({
                  ...courseData,
                  semester: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="file_options">
            <label htmlFor="">Programme: </label>
            <select
              required
              disabled={courseData.programme}
              onChange={(e) => {
                setCourseData({
                  ...courseData,
                  programme: parseInt(e.target.value),
                });
                setProgrammeState(
                  programmes.filter(
                    (x) => x.id.toString() === e.target.value
                  )[0].name
                );
              }}
            >
              <option value="">Select Programme</option>
              {programmes &&
                programmes.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
            </select>
          </div>
          <InputComponent
            title="Course Name"
            placeholder={"Enter course name"}
            value={nameState}
            onChange={(e) => {
              setNameState(e.target.value);
            }}
          />
          <InputComponent
            title="Course Code"
            placeholder={"Enter course code"}
            value={codeState}
            onChange={(e) => {
              setCodeState(e.target.value);
            }}
          />

          <div className="programme_action_button">
            {/* <ButtonComponent title={"Fetch"} /> */}
            <ButtonComponent title={"Add Course"} onClickHandler={addCourse} />
            <ButtonComponent
              title={"Clear All"}
              onClickHandler={(e) => window.location.reload()}
            />
          </div>
        </div>
        <div className="programme_display-section">
          <div className="filters">
            <div className="filter">
              <label htmlFor="">Search: </label>
              <input type="text" onChange={handleFilter} />
              <MdSearch />
            </div>
          </div>
          <DataTable
            title="Courses"
            noDataComponent={"No courses found!"}
            columns={columns}
            data={
              dummyNames &&
              dummyNames.map((_, index) => {
                return {
                  programme: programmeState,
                  course_name: courseData.names[index],
                  course_code: courseData.codes[index],
                };
              })
            }
            responsive={true}
          />
        </div>
        <ButtonComponent
          styleQ={{ float: "right" }}
          title={loading ? "Uploading..." : "Upload"}
          disabled={loading}
          onClickHandler={createSubject}
        />
      </div>
    </>
  );
}

function InputComponent({ title, placeholder, inputType, onChange, value }) {
  return (
    <>
      <div className="inputComponent">
        <label>{title} :</label>
        <input
          type={`${inputType ? inputType : "text"}`}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
    </>
  );
}

function SelectComponent({ title, placeholder, options }) {
  console.log(options);
  return (
    <div className="selectComponent">
      <label>{title}: </label>
      <select defaultValue="">
        <option value="" disabled={true}>
          Select {placeholder}
        </option>
        {options.map((opt, index) => {
          return (
            <option key={index} value="">
              {opt}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function ButtonComponent({ title, styleQ, isIcon, onClickHandler, disabled }) {
  return (
    <>
      <button
        className="buttonComponent"
        style={styleQ}
        onClick={onClickHandler}
        disabled={disabled}
      >
        {isIcon ? isIcon : ""}
        {title}
      </button>
    </>
  );
}

export default function Hod() {
  const urlWindow = window.location;
  const url =
    urlWindow.pathname.split("/")[1] + "/" + urlWindow.pathname.split("/")[2];
  console.log(window.location.href);

  return (
    <div className="hod-section">
      <Sidebar greeting={"Welcome Hod"} data={HodMenuIcons} />
      <div className="hod-area">
        <Routes>
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="/upload" element={<UploadComponent />} />
          <Route path="/view" element={<ViewComponent />} />
          <Route path="/courses" element={<CourseComponent />} />
        </Routes>
      </div>
    </div>
  );
}
