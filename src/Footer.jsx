import React from 'react';
import { useHistory, useRouteMatch } from "react-router-dom"

const Footer = () => {
  const history = useHistory() 
  const match = useRouteMatch("/:page/:groupId")
  const params = match ? match.params : { page: "" }
  
  const routeTo = (path) => {
    console.log(`${path}/${params.groupId}`)
    history.push(`${path}/${params.groupId}`)
  }

  return (
    <footer className={`fixed-bottom ${!params.page ? 'd-none' : ''}`}>
      {
        !params.page ? "" : (
          <div className="d-flex justify-content-around align-items-center flex-wrap">
            <div className="d-flex align-items-center flex-wrap cursor-pointer" onClick={() => params && routeTo("/editGroup")}>
              <i className={`material-icons ${params.page.toLowerCase().includes('editgroup') && "text-primary"}`}>brush</i>
            </div>
            <div className="d-flex align-items-center flex-wrap cursor-pointer" onClick={() => params && routeTo("/users")}>
              <i className={`material-icons ${params.page.toLowerCase().includes('users') && "text-primary"}`}>face</i>
            </div>
            <div className="d-flex align-items-center flex-wrap cursor-pointer" onClick={() => params && routeTo("/split")}>
              <i className={`material-icons ${params.page.toLowerCase().includes('split') && "text-primary"}`}>poll</i>
            </div>
            <div className="d-flex align-items-center flex-wrap cursor-pointer" onClick={() => params && routeTo("/summary")}>
              <i className={`material-icons ${params.page.toLowerCase().includes('summary') && "text-primary"}`}>assignment</i>
            </div>
          </div>
        )
      }
    </footer>
  );
}

export default Footer;