import React, { useState, useRef, ElementConfig } from "react";
import RSelect, { components } from 'react-select';
const Select = (props) => {
  const { option, value, error, handleSelect, list } = props
  const { title, placeholder, key, required, isMulti } = option;
  const [focus, setFocus] = useState(false)
  const inputElement = useRef(null) 

  // Style
  const customStyles = {
    valueContainer: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      fontSize: "18px"
    }),
    multiValue: (provided) => ({
      ...provided,
      borderRadius: "20px",
      padding: "5px 10px"
    }),
    multiValueRemove: () => ({
      backgroundColor: "inherit",
      padding: "0 5px"
    }),
    indicatorsContainer: () => ({
      '> div': {
        color: 'rgba(55, 55, 55, .3)',
        display: 'flex',
        alignItems: 'center'
      },
      '> div:last-child': {
        color: '#9E8470',
        display: 'flex',
        alignItems: 'center'
      },
      display: 'flex'
    }),
    indicatorSeparator: () => ({
      backgroundColor: "white"
    }),
    placeholder: () => ({
      color: '#E5E5E5'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#9E8470' : 'white',
      ':active': {
        backgroundColor:
          !state.isDisabled && (state.isSelected ? '#9E8470' : 'rgba(158, 132, 112, .3)'),
      }
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      boxShadow: 'none',
      display: 'flex'
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }

  // Dropdown
  const DropdownIndicator = (
    props: ElementConfig<typeof components.DropdownIndicator>
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <i className="material-icons">list</i>
      </components.DropdownIndicator>
    );
  };

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
          <RSelect
            components={{ DropdownIndicator }}
            styles={customStyles}
            onFocus={() => setFocus(true)}
            onBlur={() =>  setFocus(false)}
            value={value}
            onChange={(e) => handleSelect(e, key)}
            options={list}
            ref={inputElement}
            placeholder={placeholder ? placeholder : ""}
            noOptionsMessage={() => "查無資料"}
            isMulti={isMulti}
            defaultValue={value ? value : null}
          >
          </RSelect>
        </div>
      </div>
      <p className="text-danger">
        <small>{error && `* ${error}`}</small>
      </p>
    </div>
  );
};

export default Select;