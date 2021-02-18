import React from 'react';
import { useHistory, useRouteMatch } from "react-router-dom"

const Footer = () => {
  const history = useHistory() 
  const match = useRouteMatch("/:page/:groupId")
  const params = match ? match.params : ""
  
  const routeTo = (path) => {
    history.push(`${path}/${params.groupId}`)
  }

  return (
    <footer className="d-flex justify-content-around align-items-center flex-wrap fixed-bottom">
      <div className="d-flex align-items-center flex-wrap cursor-pointer" onClick={() => params && routeTo("/editGroup")}>
        <i className={`material-icons ${useRouteMatch("/editGroup/:groupId") && "text-primary"}`}>brush</i>
      </div>
      <div className="d-flex align-items-center flex-wrap cursor-pointer" onClick={() => params && routeTo("/users")}>
        <i className={`material-icons ${useRouteMatch("/users/:groupId") && "text-primary"}`}>face</i>
      </div>
      <div className="d-flex align-items-center flex-wrap cursor-pointer" onClick={() => params && routeTo("/split")}>
        <i className={`material-icons ${useRouteMatch("/split/:groupId") && "text-primary"}`}>poll</i>
      </div>
      <div className="d-flex align-items-center flex-wrap cursor-pointer" onClick={() => params && routeTo("/summary")}>
        <i className={`material-icons ${useRouteMatch("/summary/:groupId") && "text-primary"}`}>assignment</i>
      </div>
    </footer>
  );
}

export default Footer;