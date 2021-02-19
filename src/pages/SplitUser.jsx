import React, { useContext, useEffect, useState } from 'react';
import SummaryCard from "../components/SummaryBlock"
import List from "../components/splitUser/_list";
import { useParams } from "react-router-dom"
import { getUserApi } from "../api/axiosApi"
import Loading from '../components/Loading';
import Context from "../Context"

const SplitUser = () => {
  const [payList, setPayList] = useState([]) // 支付列表
  const [splitList, setSplitList] = useState([]) // 分帳列表
  const [userInfo, setUserInfo] = useState({})
  const params = useParams()
  const { setHeaderTitle } = useContext(Context)

  const getUser = async () => {
    const userId = params.userId
    getUserApi(userId)
      .then(res => {
        const fields = res.data.fields
        // console.log(fields)
        setUserInfo(fields)
        setHeaderTitle(fields.name)

        // 建立分帳列表
        let splitList = []
        if (fields.splitItems) {
          for (let i = 0; i < fields.splitItems.length; i++) {
            splitList = [
              ...splitList,
              {
                id: fields.splitItems[i],
                name: fields.splitItemsTitle[i],
                total: fields.splitItemAverage[i]
              }
            ]
          }
          setSplitList(splitList)
        }
        

        // 建立支付列表
        let payList = []
        if (fields.payItems) {
          for (let j = 0; j < fields.payItems.length; j++) {
            payList = [
              ...payList,
              {
                id: fields.payItems[j],
                name: fields.payItemsTitle[j],
                total: fields.payItemsTotal[j]
              }
            ]
          }
          setPayList(payList)
        }
      }) 
      .catch(err => {

      })
  }

  useEffect(() => {
    getUser()
    return () => {
      setHeaderTitle()
    }
  }, [])

  return (
    <div className={`w-100 overflow-hidden ${!splitList.length ? "d-flex justify-content-center" : ""}`}>
      {/* 列表 */}
      {
        userInfo.id ? (
          <div className="w-100 h-100 overflow-scroll p-4 pb-100">
            { (!splitList.length && !payList.length) && SplitEmpty() }
            { splitList.length || payList.length ? (
              <div>
                <div>
                  {/* 花費總額 */}
                  { !userInfo.total ? "" : <SummaryCard amount={parseFloat(userInfo.total.toFixed(2))}/>}
                  {/* 花費明細 */}
                  <List list={payList} type={1} amount={userInfo.payPrice}/>
                  {/* 受益明細 */}
                  <div className="mt-4">
                    <List list={splitList} type={2} amount={userInfo.splitPrice}/>
                  </div>
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

export default SplitUser;