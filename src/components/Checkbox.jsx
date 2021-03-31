import React from "react";
const Checkbox = ({ option, value, handleCheck }) => {
  const { title, key } = option;

  return (
    <div className="mb-3">
      <label className="checkbox-block">
        <p className="text-12">{title}</p>
        <input type="checkbox" checked="checked" 
          checked={value}
          onChange={(e) => handleCheck(e.target.checked, key)}/>
        <span className="checkmark"></span>
      </label>
    </div>
  );
};

export default Checkbox;