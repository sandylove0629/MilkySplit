import React, { useEffect, useState } from 'react';
import SummaryCard from "../components/SummaryBlock"
import List from "../components/split/_list";
import Button from "../components/Button"
import Modal from "../components/Modal"
import { useParams, useHistory } from "react-router-dom"
import { getGroupApi } from "../api/axiosApi"
import Loading from '../components/Loading';

const Split = () => {
  const [splitList, setSplitList] = useState([]) // 分帳列表
  const [modalShow, setModalShow] = useState(false)
  const [groupInfo, setGroupInfo] = useState({})
  const params = useParams()
  const history = useHistory()

  useEffect(() => {
    getGroup()
  }, [])

  const getGroup = () => {
    const groupId = params.groupId
    getGroupApi(groupId)
      .then(res => {
        const fields = res.data.fields
        console.log(fields)
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
              total: fields.usersTotal[i],
              payPrice: fields.usersPayPrice[i],
              splitPrice:fields.usersSplitPrice[i]
            }
          ]
        }
        setSplitList(list)
      }) 
      .catch(err => {

      })
  }

  const toggleModal = (mShow) => {
    setModalShow(mShow)
  }

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
        groupInfo.id ? (
          <div className="w-100 h-100 overflow-scroll p-4 pb-100">
            { !splitList.length && SplitEmpty() }
            { splitList.length ? (
              <div>
                <div>
                  {/* 花費總額 */}
                  <SummaryCard amount={groupInfo.groupPayTotal}/>
                  {/* 明細 */}
                  <List list={splitList} type={1}/>
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

export default Split;