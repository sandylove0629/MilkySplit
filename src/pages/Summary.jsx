import React, { useContext, useEffect, useState } from 'react';
import List from "../components/summary/_list";
import { useParams } from "react-router-dom"
import { getGroupApi } from "../api/axiosApi"
import Loading from '../components/Loading';
import Context from "../Context"

const Split = () => {
  const [summaryList, setSummaryList] = useState([])
  const [splitList, setSplitList] = useState([]) // 分帳列表
  const [groupInfo, setGroupInfo] = useState({})
  const [loadingState, setLoadingState] = useState(true)
  const params = useParams()
  const { setHeaderTitle } = useContext(Context)

  useEffect(() => {
    setHeaderTitle("報告")
    getGroup()
    return () => setHeaderTitle()
  }, [])

  useEffect(() => {
    coculateSummary()
  }, [splitList])

  const getGroup = () => {
    const groupId = params.groupId
    getGroupApi(groupId)
      .then(async (res) => {
        const fields = res.data.fields
        // console.log(fields)
        setGroupInfo(fields)

        // 建立分帳列表
        let list = []
        for (let i = 0; i < fields.users.length; i++) {
          list = [
            ...list,
            {
              userId: fields.users[i],
              id: fields.users[i],
              name: fields.usersName[i],
              total: fields.usersTotal[i] >= 0 ? Math.ceil(fields.usersTotal[i]) : Math.floor(fields.usersTotal[i])
            }
          ]
        }
        setSplitList(list)
      }) 
      .catch(err => {

      })
  }

  const coculateSummary = () => {
    const sSplitList = splitList.sort((a, b) => b.total - a.total)
    const receiveUsers = sSplitList.filter(user => user.total > 0)
    const payUsers = sSplitList.filter(user => user.total < 0)
    let result = []
    for (let i = 0; i < receiveUsers.length; i++) {
      const receiveUser = receiveUsers[i]
      for (let j = 0; j < payUsers.length; j++) {
        const payUser = payUsers[j]
        const payUserTotal = Math.abs(payUser.total)
        if (!payUserTotal) continue // 算過了
        if (!receiveUser.total) continue // 算過了
        if (receiveUser.total > payUserTotal) {
          result = [
            ...result,
            {
              receiveUserId: receiveUser.id,
              receiveUser: receiveUser.name,
              payUser: payUser.name,
              money: payUserTotal
            }
          ]
          receiveUser.total = receiveUser.total - payUserTotal
          payUser.total = 0
        } 
        else if (receiveUser.total <= payUserTotal) {
          result = [
            ...result,
            {
              receiveUserId: receiveUser.id,
              receiveUser: receiveUser.name,
              payUser: payUser.name,
              money: receiveUser.total
            }
          ]
          receiveUser.total = payUserTotal - receiveUser.total
          payUser.total = receiveUser.total
        }
      }
    }
    setSummaryList(result)
    setLoadingState(false)
  }

  return (
    <div className={`w-100 overflow-hidden ${!splitList.length ? "d-flex justify-content-center" : ""}`}>
      {/* 列表 */}
      {
        groupInfo.id && !loadingState ? (
          <div className="w-100 h-100 overflow-scroll p-4 pb-100">
            { !splitList.length && SplitEmpty() }
            { splitList.length ? (
              <div>
                <div>
                  {/* 明細 */}
                  <List list={summaryList} type={1}/>
                </div>
              </div>
              ) : ""
            }
          </div>
        ) : (
          <Loading/>
        )
      }
    </div>
  );
}

const SplitEmpty = () => {
  return (
    <div className="d-flex h-100 justify-content-center align-items-center flex-wrap">
      <div className="text-center text-disabled">
        <i className="material-icons xs-90">pets</i>
        <br/>
        <h1>無任何資料</h1>
      </div>
    </div>
  )
}

export default Split;