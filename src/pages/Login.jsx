import React, { useState, useContext, useEffect } from 'react';
import Context from "../Context";
import { randomId, randomNum } from "../assets/js/random"
import { useHistory } from 'react-router-dom';
import Input from "../components/Input"
import Button from "../components/Button"
import Logo from "../assets/image/logo.png"
import Loading from "../components/Loading"

const Login = () => {
  const [loadingState, setLoadingState] = useState(false)
  const history = useHistory();
  const [account, setAccount] = useState("sandylove0629")
  const [error, setError] = useState({
    account: ""
  })
  const { 
    fetchLogin, 
    fetchRegister, 
    fetchCreateGroup,
    setAccountValue, 
    setGroupValue, 
    account: accountValue,
    group,
    getGroup
  } = useContext(Context)

  useEffect(() => {
    const sAccount = localStorage.getItem("split_account")
    const sGroup = localStorage.getItem("split_group")
    if (sAccount) {
      setAccountValue(JSON.parse(sAccount))
      setGroupValue(JSON.parse(sGroup))
      // 跳頁
      routeSplitPage()
    }
  }, [])

  const doLogin = () => {
    // 登入
    const isAccount = account.trim()
    if (!isAccount) {
      setError({account: "請輸入帳號名稱"})
      return
    }
    setLoadingState(true)
    fetchLogin(account)
      .then(res => {
        console.log(res)
        // 取得 group
        console.log(res)
        const groupId = res.fields.groups[0]
        getGroupInfo(groupId)
      })
      .catch(err => {
        if (err === "no data") doRegister() // 註冊
        else {
          setLoadingState(true)
          // error modal
        }
        console.log(err)
      })
    
  }

  const doRegister = () => {
    // 註冊
    const accountBody = {
      fields: {
        id: randomId(),
        name: account,
        account
      }
    }
    fetchRegister(accountBody)
      .then(res => {
        console.log(res)
        doCreateGroup(res.data.id)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const doCreateGroup = (accountId) => {
    // 建立群組
    const id = `M${randomNum()}`
    const groupBody = {
      fields: {
        id,
        name: id,
        owner: [accountId]
      }
    }
    fetchCreateGroup(groupBody)
      .then(res => {
        console.log(res)
        // 跳頁
        routeSplitPage()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getGroupInfo = (id) => {
    getGroup(id)
      .then(res => {
        console.log(res)
        // 跳頁
        routeSplitPage()
      })
      .catch(err => {
        console.log(err)
      })
  }

  const routeSplitPage = () => {
    const sGroup = localStorage.getItem("split_group")
    const id = sGroup ? JSON.parse(sGroup).id : group.id
    history.push(`split/${id}`)
  }

  return (
    <div className="w-100 p-4">
      {
        loadingState ? (<Loading></Loading>) : (
          <div className="card-list h-100 d-flex justify-content-center align-items-center flex-column">
            <div className="w-100 p-4 d-flex flex-column align-items-center">
              <div style={{maxWidth: "120px", marginBottom: "-.5rem"}}>
                <img className="w-100" src={Logo} alt=""/>
              </div>
              <Input
                option={{ title: "帳號", key: "account" }}
                value={account}
                handleChange={value => setAccount(value)}
              ></Input>
            </div>
            <div className="w-100">
              <hr className="my-4 filled"/>
              <div className="text-center">
                <Button name="登入 / 註冊" type="primary" event={doLogin}></Button>
              </div>
            </div>
            {/* {accountValue && accountValue.id}
            <br/>
            {group && group.id} */}
          </div>
        )
      }
    </div>
    
  );
}

export default Login;