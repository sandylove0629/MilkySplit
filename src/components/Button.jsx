import React from "react"

const Button = ({ name, type, event }) => {
  const buttonType = type ? `btn-${type}` : "btn-default"
  const clickButton = () => {
    event()
  }
  return (
    <button className={`btn-default ${buttonType}`} onClick={clickButton}>
      {name}
    </button>
  )
}
export default Button;