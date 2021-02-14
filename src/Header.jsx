import React, {useContext, useEffect} from 'react';
import { useHistory } from "react-router-dom"
import Context from "./Context"

const Header = () => {
  const history = useHistory()
  const { account: accountValue, setAccountValue, setGroupValue }  = useContext(Context)
  const doLogout = () => {
    localStorage.removeItem("split_account")
    localStorage.removeItem("split_group")
    setAccountValue("")
    history.push("/")
  }

  useEffect(() => {
    const sAccount = localStorage.getItem("split_account")
    const sGroup = localStorage.getItem("split_group")
    if (sAccount) {
      setAccountValue(JSON.parse(sAccount))
      setGroupValue(JSON.parse(sGroup))
    }
  }, [])

  return (
    <header className="d-flex justify-content-center align-content-center flex-wrap">
      <div className="absolute icon-back">
        <i className="material-icons">navigate_before</i>
      </div>
      <h1>不想努力分帳了</h1>
      {
        accountValue.id && (
          <div className="absolute icon-logout" onClick={doLogout}>
            <i className="material-icons">logout</i>
          </div>
        )
      }
      
    </header>
  );
}

export default Header;