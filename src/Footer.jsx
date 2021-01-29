import React from 'react';
import { useHistory, useLocation, useRouteMatch } from "react-router-dom"

const Footer = () => {
  const history = useHistory()
  const location = useLocation()
  const routeTo = (path) => {
    history.push(`${path}/134352`)
  }

  return (
    <footer className="d-flex justify-content-around align-content-center flex-wrap">
      <div className="d-flex align-content-center flex-wrap" onClick={() => routeTo("/editGroup")}>
        <i className={`material-icons ${useRouteMatch("/editGroup/:group_id") && "text-primary"}`}>brush</i>
      </div>
      <div className="d-flex align-content-center flex-wrap" onClick={() => routeTo("/users")}>
        <i className={`material-icons ${useRouteMatch("/users/:group_id") && "text-primary"}`}>face</i>
      </div>
      <div className="d-flex align-content-center flex-wrap" onClick={() => routeTo("/split")}>
        <i className={`material-icons ${useRouteMatch("/split/:group_id") && "text-primary"}`}>poll</i>
      </div>
      <div className="d-flex align-content-center flex-wrap" onClick={() => routeTo("/summary")}>
        <i className={`material-icons ${useRouteMatch("/summary/:group_id") && "text-primary"}`}>assignment</i>
      </div>
    </footer>
  );
}

export default Footer;