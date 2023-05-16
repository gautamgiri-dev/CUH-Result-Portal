import React from "react";
import "./InputBox.scss";

export default function InputBox({
  title,
  placeholder,
  onChangehandler,
  data,
  selector,
  value,
  isSelect = false,
  type = false,
  extraProps,
}) {
  // console.log(data)
  return (
    <div className="InputBox__container">
      <label className="InputBox__label">{title}: </label>
      {!isSelect && (
        <>
          <input
            type={`${type ? type : "text"}`}
            placeholder={placeholder}
            onChange={onChangehandler}
            {...extraProps}
          />
        </>
      )}
      {isSelect && (
        <select defaultValue={""} required>
          <option disabled value="">
            {placeholder}
          </option>
          {data &&
            data.map((opt, index) => (
              <option key={index} value={opt.selector}>
                {opt.value}
              </option>
            ))}
        </select>
      )}
    </div>
  );
}
