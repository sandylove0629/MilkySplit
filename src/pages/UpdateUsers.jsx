import React, { useEffect, useState } from 'react';
import Input from "../components/Input"
import Button from "../components/Button"
import { updateUserApi, getUserApi, deleteUsersApi } from "../api/axiosApi" 
import { randomNum } from "../assets/js/random"
import { useHistory, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from "../components/Loading"
import Modal from "../components/Modal"


const UpdateUsers = () => {
  const params = useParams()
  const history = useHistory()
  const [showAlert, setShowAlert] = useState({
    type: "",
    text: ""
  })
  const [loadingState, setLoadingState] = useState(true)
  const [userInfo, setUserInfo] = useState({
    name: "",
    payItems: [],
    splitItems: []
  })
  const [error, setError] = useState({
    name: false
  })

  const handleChange = (value, key) => {
    setUserInfo({
      ...userInfo,
      [key]: value
    });
    setError({
      ...error,
      [key]: false
    })
  };

  // check inputs
  const checkForm = async () => {
    // 一般 / 帳單 皆檢查
    let isError = false
    const text = {
      name: "姓名"
    }
    let newErr = {...error}
    for (let key in userInfo) {
      if (!userInfo[key]) {
        isError = true
        newErr = {
          ...newErr,
          [key]: `${text[key]}為空`
        }
      }
      console.log(newErr)
    }

    setError(newErr)
    return isError
  }

  const checkInputs = async () => {
    const isError = await checkForm()
    const {name, ...others} = userInfo
    if (isError) return
    
    let fields = {
      name,
      id: `U${randomNum()}`,
      group: [params.groupId]
    }

    console.log(fields)

    setLoadingState(true)
    updateUserApi(params.userId, {fields})
      .then((res) => {
        console.log(res)
        setShowAlert({type: "success", text: "編輯成功"})
        setTimeout(() => {
          setShowAlert({type: "", text: ""})
          setLoadingState(false)
          history.push(`/users/${params.groupId}`)
        }, 3000)
      })
      .catch((err) => {
        console.log(err)
        setShowAlert({type: "danger", text: "編輯失敗，請稍後再試"})
        setTimeout(() => {
          setShowAlert({type: "", text: ""})
          setLoadingState(false)
        }, 3000)
      })
  }

  const getUser = async () => {
    const userId = params.userId
    getUserApi(userId)
      .then(res => {
        const fields = res.data.fields
        const { name, payItems = [], splitItems = [] } = fields
        console.log(fields)
        setUserInfo({name, payItems, splitItems})
      })
      .catch(err => {

      })
      .finally(() => {
        setLoadingState(false)
      })
  }

  useEffect(() => {
    getUser()
  }, [])

  const [modalShow, setModalShow] = useState(false)
  const toggleModal = (mShow) => {
    setModalShow(mShow)
  }

  const deleteUsers = () => {
    toggleModal(false)
    setLoadingState(true)
    deleteUsersApi(`records[]=${params.userId}`)
      .then(res => {
        // set default
        setShowAlert({type: "success", text: "刪除成功"})
        setTimeout(() => {
          history.push(`/users/${params.groupId}`)
        }, 3000)
      })
      .catch(err => {
        console.log(err)
        setShowAlert({type: "danger", text: "刪除失敗，請稍後再試"})
        setLoadingState(false)
      })
  }

  return (
    <div className="w-100">
      {
        !loadingState ? (
          <div className="w-100 h-100 overflow-scroll p-4 pb-100">
            {/* Form */}
            <div className="card-list w-100 p-4">
              <div className="text-center py-3">
                <i className="material-icons" style={{fontSize: "80px"}}>face</i>
              </div>
              <Input
                option={{ title: "姓名", key: "name", placeholder: "", required: true }}
                value={userInfo.name}
                handleChange={handleChange}
                error={error.name}
              ></Input>
              <hr className="mt-5 mb-5 filled"/>
              <div className="text-center mb-4">
                <Button name="編輯夥伴" type="primary" event={checkInputs}></Button>
              </div>
            </div>
            {
              !userInfo.payItems.length && !userInfo.splitItems.length ? (
                <div className="text-center pt-4">
                  <Button name="刪除夥伴" type="danger" event={() => toggleModal(!modalShow)}></Button>
                </div>
              ) : '' 
            }
          </div>
          
        ) : (
          <Loading/>
        )
      }
      {/* Modal */}
      <Modal event={toggleModal} mShow={modalShow} options={{persistent: false}} confirm={deleteUsers}>
        <p>確定刪除夥伴 ?</p>
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

export default UpdateUsers;