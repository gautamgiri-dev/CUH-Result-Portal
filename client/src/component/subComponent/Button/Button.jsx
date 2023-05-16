import React from "react";
import "./Button.scss";
export default function Button({ btnStyle }) {
  return (
    <>
      <div className="button_container">
        <span className={`button ${btnStyle ? "btnStyle" : ""}`}>Button</span>
      </div>
    </>
  );
}
