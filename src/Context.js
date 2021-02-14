import React, { createContext, useState } from "react"
import { loginApi, registerApi, createGroupApi, getGroupApi } from "./api/axiosApi";

const Context = createContext({
  // account
  account: {},
  /*
  {
    createdTime: "",
    id: "",
    fields: {
      account: "",
      id: "",
      name: "",
      groups: []
    }
  }
   */
  setAccountValue: () => {},
  fetchLogin: () => {},
  fetchRegister: () => {},
  // group
  group: "",
  setGroupValue: () => {},
  fetchCreateGroup: () => {},
  getGroup: () => {}
})

export const UserProvider = ({ children }) => {
  const [accountContextValue, setAccountContextValue] = useState({})
  const [groupContextValue, setGroupContextValue] = useState({})
  return (
    <Context.Provider
      value={{
        account: accountContextValue,
        group: groupContextValue,
        setAccountValue: account => {
          setAccountContextValue(account)
        },
        fetchLogin: account => {
          // 登入
          return new Promise ((resolve, reject) => {
            loginApi(account)
              .then((res) => {
                if (res.data.records.length) {
                  setAccountContextValue(res.data.records[0])
                  localStorage.setItem("split_account", JSON.stringify(res.data.records[0]))
                  resolve(res.data.records[0])
                  return
                }
                reject("no data")
              })
              .catch(err => {
                reject(err)
              })
          })
        },
        fetchRegister: body => {
          // 註冊
          return new Promise ((resolve, reject) => {
            registerApi(body)
              .then(res => {
                setAccountContextValue(res.data)
                localStorage.setItem("split_account", JSON.stringify(res.data))
                resolve(res)
              })
              .catch(err => {
                reject(err)
              })
          })
        },
        setGroupValue: group => {
          setGroupContextValue(group)
        },
        fetchCreateGroup: body => {
          // 新增 Group
          return new Promise ((resolve, reject) => {
            createGroupApi(body)
              .then(res => {
                setGroupContextValue(res.data)
                localStorage.setItem("split_group", JSON.stringify(res.data))
                resolve(res)
              })
              .catch(err => {
                reject(err)
              })
          })
        },
        getGroup: id => {
          return new Promise ((resolve, reject) => {
            getGroupApi(id)
              .then(res => {
                console.log(res)
                setGroupContextValue(res.data)
                localStorage.setItem("split_group", JSON.stringify(res.data))
                resolve(res.data)
              })
              .catch(err => {
                reject(err)
              })
          })
        }
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Context