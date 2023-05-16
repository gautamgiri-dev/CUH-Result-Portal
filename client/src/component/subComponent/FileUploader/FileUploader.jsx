import React from "react";
import "./FileUploader.scss";
import { useState, useRef } from "react";
export default function FileUploader({ onChange }) {
  const [files, setFiles] = useState(null);
  const inputRef = useRef();
  console.log("Files: ", files);
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

  return (
    <>
      <div className="dropzone" onDragOver={handleDragOver} onDrop={handleDrop}>
        <h1>{files ? files[0].name : "Drag and Drop Files to Upload"}</h1>
        {!files && <span>Or</span>}
        <input
          type="file"
          multiple
          // onChange={(event) => setFiles(event.target.files)}
          onChange={(e) => {
            setFiles(e.target.files);
            onChange(e);
          }}
          hidden
          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ref={inputRef}
        />
        <button onClick={() => inputRef.current.click()}>
          {files ? "Change File" : "Select Files"}
        </button>
      </div>
    </>
  );
}
