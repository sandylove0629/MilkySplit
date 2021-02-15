import React, { useContext, useEffect, useState } from 'react';
import Alert from "../components/Alert"
import List from "../components/users/_list";
import Button from "../components/Button"
import Modal from "../components/Modal"
import { useParams, useHistory } from "react-router-dom"
import { getUsersApi, deleteUsersApi } from "../api/axiosApi"
import Loading from '../components/Loading';
import Context from "../Context"

const Split = () => {
  const [splitList, setSplitList] = useState([]) // 分帳列表
  const [modalShow, setModalShow] = useState(false)
  const [loadingState, setLoadingState] = useState(true)
  const params = useParams()
  const history = useHistory()
  const { setHeaderTitle } = useContext(Context)
  const [showAlert, setShowAlert] = useState({
    type: "",
    text: ""
  })

  useEffect(() => {
    setHeaderTitle("夥伴")
    getUsers()
    return () => setHeaderTitle()
  }, [])

  let users = []
  const [userList, setUserList] = useState([])
  const getUsers = () => {
    const sGroupId = localStorage.getItem("split_group")
    if (sGroupId) {
      const id = JSON.parse(sGroupId).fields.id
      getUsersApi(id)
        .then(res => {
          console.log(res.data)
          res.data.records.map((user) => {
            users = [
              ...users,
              {
                ...user.fields,
                id: user.id
              }
            ]
          })
          // set default
          setUserList(users)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          setLoadingState(false)
        })
    }
    
  }

  const deleteUsers = () => {
    toggleModal(false)
    let params = userList.map(user => {
      return `records[]=${user.id}`
    }).join('&')

    setLoadingState(true)
    deleteUsersApi(params)
      .then(res => {
        // set default
        setShowAlert({type: "success", text: "刪除成功"})
        setUserList([])
        setTimeout(() => {
          setShowAlert({type: "", text: ""})
          getUsers()
        }, 3000)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoadingState(false)
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
        onClick={ () => history.push(`/createUser/${params.groupId}`)  }
      >
        <i className="material-icons">add</i>
      </div>
      {/* 列表 */}
      {
        !loadingState ? (
          <div className="w-100 h-100 overflow-scroll p-4 pb-100">
            { !userList.length && SplitEmpty() }
            { userList.length ? (
              <div>
                <div>
                  {/* 明細 */}
                  <List list={userList}/>
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
      <Modal event={toggleModal} mShow={modalShow} options={{persistent: false}} confirm={deleteUsers}>
        <p>確定清空資料 ?</p>
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
    <div className="d-flex h-100 justify-content-center align-content-center flex-wrap">
      <div className="text-center text-disabled">
        <i className="material-icons xs-90">pets</i>
        <br/>
        <h1>請新增夥伴</h1>
      </div>
    </div>
  )
}

export default Split;