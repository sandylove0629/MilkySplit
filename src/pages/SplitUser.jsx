import React, { useContext, useEffect, useState } from 'react';
import SummaryCard from "../components/SummaryBlock"
import List from "../components/splitUser/_list";
import Button from "../components/Button"
import Modal from "../components/Modal"
import { useParams, useHistory } from "react-router-dom"
import { getUserApi } from "../api/axiosApi"
import Loading from '../components/Loading';
import Context from "../Context"

const SplitUser = () => {
  const [payList, setPayList] = useState([]) // 支付列表
  const [splitList, setSplitList] = useState([]) // 分帳列表
  const [modalShow, setModalShow] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const params = useParams()
  const history = useHistory()
  const { setHeaderTitle } = useContext(Context)

  const getUser = async () => {
    const userId = params.userId
    getUserApi(userId)
      .then(res => {
        const fields = res.data.fields
        console.log(fields)
        setUserInfo(fields)
        setHeaderTitle(fields.name)

        // 建立分帳列表
        let splitList = []
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

        // 建立支付列表
        let payList = []
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
      }) 
      .catch(err => {

      })
  }

  const toggleModal = (mShow) => {
    setModalShow(mShow)
  }

  useEffect(() => {
    getUser()
    return () => {
      setHeaderTitle()
    }
  }, [])

  return (
    <div className={`w-100 overflow-hidden ${!splitList.length ? "d-flex justify-content-center" : ""}`}>
      {/* 新增按鈕 */}
      <div 
        className="absolute rounded-circle text-white icon-add
        d-flex flex-wrap justify-content-center align-content-center"
        onClick={ () => history.push(`/createSplit/${params.groupId}`)  }
      >
        <i className="material-icons">add</i>
      </div>
      {/* 列表 */}
      {
        userInfo.id ? (
          <div className="w-100 h-100 overflow-scroll p-4 pb-100">
            { !splitList.length && !payList.length && SplitEmpty() }
            { splitList.length || splitList.length ? (
              <div>
                <div>
                  {/* 花費總額 */}
                  <SummaryCard amount={userInfo.total}/>
                  {/* 支付明細 */}
                  <List list={payList} type={1} amount={userInfo.payPrice}/>
                  {/* 分帳明細 */}
                  <div className="mt-4">
                    <List list={splitList} type={2} amount={userInfo.splitPrice}/>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <Button name="清空資料" type="danger" event={() => toggleModal(!modalShow)}></Button>
                </div>
              </div>
              ) : ""
            }
          </div>
        ) : (
          <Loading/>
        )
      }
      {/* Modal */}
      <Modal event={toggleModal} mShow={modalShow} options={{persistent: false}}>
        <p>確定清空資料 ?</p>
      </Modal>
    </div>
  );
}

const SplitEmpty = () => {
  return (
    <div className="d-flex h-100 justify-content-center align-content-center flex-wrap">
      <div className="text-center text-disabled">
        <i className="material-icons xs-90">pets</i>
        <br/>
        <h1>無任何資料</h1>
      </div>
    </div>
  )
}

export default SplitUser;