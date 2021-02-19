import React, {useContext, useEffect} from 'react';
import { useHistory, useRouteMatch } from "react-router-dom"
import Context from "./Context"

const Header = () => {
  
  const history = useHistory()
  const { account: accountValue, setAccountValue, setGroupValue, headerTitle }  = useContext(Context)
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

  const notShowBack = ['users', 'split', 'summary', 'editGroup']
  let match = useRouteMatch("/:page/:groupId")
  const mPage = match ? match.params.page : ""
  const isMain = notShowBack.find(page => mPage === page) ? false : true
  
  return (
    <header className="d-flex justify-content-center align-items-center flex-wrap">
      {
        isMain && match && (
          <div className="absolute icon-back cursor-pointer" onClick={() => history.goBack()}>
            <i className="material-icons">navigate_before</i>
          </div>
        )
      }
      <h1>{headerTitle ? headerTitle : "不想努力分帳了"}</h1>
      {
        accountValue.id && (
          <div className="absolute icon-logout cursor-pointer" onClick={doLogout}>
            <i className="material-icons">logout</i>
          </div>
        )
      }
      
    </header>
  );
}

export default Header;