import React, { useState, useRef } from "react";
const Input = ({ option, value, error, handleChange }) => {
  const { title, placeholder, type, key, required } = option;
  const [focus, setFocus] = useState(false)
  const inputElement = useRef(null) 

  const inputChange = (e) => {
    if (type === "number") {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        handleChange(e.target.value, key)
      }
    }
    else handleChange(e.target.value, key)
  }

  return (
    <div className="mb-4">
      <div 
        className={`
          input-frame my-2 text-left border p-3 rounded 
          ${focus ? "focus" : ""}
        `}
        onClick={() => inputElement.current.focus()}
      >
        <div>
          <p className="pb-2">
            {required && <span className="text-danger">＊ </span>}{title}
          </p>
          <div className="d-flex">
            <input
              type={type && type !== "number" ? type : "text"}
              className="form-control border-0"
              placeholder={placeholder || ""}
              value={value ? value : ""}
              onChange={(e) => inputChange(e)}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              ref={inputElement}
            />
            {key === "serviceCharge" && <p>%</p>}
          </div>
        </div>
      </div>

      <p className="text-danger">
        <small>{error && `* ${error}`}</small>
      </p>
    </div>
  );
};

export default Input;