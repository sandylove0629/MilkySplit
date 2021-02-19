import React, { useEffect, useState, useContext } from 'react';
import Alert from "../components/Alert"
import SummaryCard from "../components/SummaryBlock"
import List from "../components/split/_list";
import Button from "../components/Button"
import Modal from "../components/Modal"
import { useParams, useHistory } from "react-router-dom"
import { getGroupApi, deleteSplitsApi } from "../api/axiosApi"
import Loading from '../components/Loading';
import Context from "../Context"

const Split = () => {
  const [tab, setTab] = useState("user")
  const [splitList, setSplitList] = useState([]) // 分帳列表
  const [splitItemList, setSplitItemList] = useState([]) // 分帳項目列表
  const [modalShow, setModalShow] = useState(false)
  const [groupInfo, setGroupInfo] = useState({})
  const [loadingState, setLoadingState] = useState(false)
  const params = useParams()
  const history = useHistory()
  const [showAlert, setShowAlert] = useState({
    type: "",
    text: ""
  })
  const { setHeaderTitle } = useContext(Context)

  useEffect(() => {
    getGroup()
    const sTab = window.localStorage.getItem("split_tab")
    if (sTab) setTab(sTab)
    return () => setHeaderTitle()
  }, [])

  useEffect(() => {
    window.localStorage.setItem("split_tab", tab)
  }, [tab])

  const getGroup = () => {
    const groupId = params.groupId
    getGroupApi(groupId)
      .then(res => {
        const fields = res.data.fields
        console.log(fields)
        setGroupInfo(fields)
        setHeaderTitle(fields.name || '不想努力分帳了')

        // 建立分帳列表
        let list = []
        let itemList = []
        console.log(fields.users)
        for (let i = 0; i < fields.users.length; i++) {
          list = [
            ...list,
            {
              userId: fields.users[i],
              id: fields.users[i],
              name: fields.usersName[i],
              total: fields.usersTotal[i] || 0,
              payPrice: fields.usersPayPrice[i] || 0,
              splitPrice: fields.usersSplitPrice[i] || 0
            }
          ]
        }
        if (fields.splits) {
          for (let j = 0; j < fields.splits.length; j++) {
            itemList = [
              ...itemList,
              {
                id: fields.splits[j] || "",
                name: fields.splitsTitle[j] || "",
                total: fields.splitsTotal[j] || 0
              }
            ]
          }
        }
        setSplitList(list)
        setSplitItemList(itemList)
      }) 
      .catch(err => {

      })
  }

  const toggleModal = (mShow) => {
    setModalShow(mShow)
  }

  const [usersModalShow, setUsersModalShow] = useState(false)
  const toggleUsersModal = (mShow) => {
    setUsersModalShow(mShow)
  }

  const checkUsers = () => {
    console.log(splitList.length)
    if (!splitList.length) {
      setUsersModalShow(true)
      return
    }
    history.push(`/createSplit/${params.groupId}`)
  }

  // 區分 array
  const chunkArray = (myArray, chunk_size) => {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
  }

  const checkSplitTimes = () => {
    toggleModal(false)
    const newSplit = chunkArray(groupInfo.splits, 10)
    for (let i = 0; i < newSplit.length; i++) {
      deleteSplits(newSplit[i])
    }
  }

  const deleteSplits = (splits) => {
    let params = splits.map(split => {
      return `records[]=${split}`
    }).join('&')

    setLoadingState(true)
    deleteSplitsApi(params)
      .then(res => {
        // set default
        setShowAlert({type: "success", text: "刪除成功"})
        setSplitList(splitList.map(split => (
          {
            ...split, 
            total: 0,
            payPrice: 0,
            splitPrice: 0
          }
        )))
        setGroupInfo({
          ...groupInfo,
          groupPayTotal: 0
        })
        setTimeout(() => {
          setShowAlert({type: "", text: ""})
          getGroup()
        }, 3000)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoadingState(false)
      })
  }

  return (
    <div className={`w-100 overflow-hidden ${!splitList.length ? "d-flex justify-content-center" : ""}`}>
      {/* 新增按鈕 */}
      <div 
        className="absolute rounded-circle text-white icon-add
        d-flex flex-wrap justify-content-center align-items-center"
        onClick={ () => checkUsers() }
      >
        <i className="material-icons">add</i>
      </div>
      {/* 列表 */}
      {
        groupInfo.id && !loadingState ? (
          <div className="w-100 h-100 overflow-scroll p-4 pb-100">
            { !splitList.length && SplitEmpty() }
            { splitList.length ? (
              <div>
                {/* tab */}
                <div className="d-flex tab-block mb-4">
                  <div 
                    className={`cursor-pointer flex-grow-1 text-center ${tab === 'user' ? 'active': ''}`}
                    onClick={() => setTab('user')}
                  >依人員</div>
                  <div 
                    className={`cursor-pointer flex-grow-1 text-center ${tab === 'item' ? 'active': ''}`}
                    onClick={() => setTab('item')}
                  >依項目</div>
                </div>
                <div>
                  {/* 花費總額 */}
                  { !groupInfo.groupPayTotal ? "" : <SummaryCard amount={parseFloat(groupInfo.groupPayTotal.toFixed(2))}/>}
                  {/* 明細 */}
                  {
                    tab === 'user' ? (
                      <List list={splitList} type={1}/>
                    ) : (
                      <div>
                      {
                        splitItemList.length ? (
                          <List list={splitItemList} type={2}/>
                        ) : (
                          <div className="pt-5 mt-5">  
                            {SplitEmpty()}
                          </div>
                        )
                      }
                      </div>                      
                    )
                  }
                  
                </div>
                {
                  !splitItemList.length ? "" : (
                    <div className="text-center pt-4">
                      <Button name="清空資料" type="danger" event={() => toggleModal(!modalShow)}></Button>
                    </div>
                  )
                }
                
              </div>
              ) : ""
            }
          </div>
        ) : (
          <Loading/>
        )
      }
      {/* Modal */}
      <Modal event={toggleModal} 
        mShow={modalShow} 
        options={{persistent: false}}
        confirm={() => checkSplitTimes()}
      >
        <p>確定清空資料 ?</p>
      </Modal>
      <Modal event={toggleUsersModal} 
        mShow={usersModalShow} 
        options={{persistent: false}} 
        confirm={() => history.push(`/users/${params.groupId}`)}
      >
        <p>請先加入夥伴</p>
      </Modal>
      {/* Alert */}
      {
        !showAlert.text ? "" : (
          <Alert type={showAlert.type} text={showAlert.text}></Alert>
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