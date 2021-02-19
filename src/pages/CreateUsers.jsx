import React, { useState } from 'react';
import Input from "../components/Input"
import Button from "../components/Button"
import { createUserApi } from "../api/axiosApi" 
import { randomNum } from "../assets/js/random"
import { useHistory, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from "../components/Loading"

const CreateSplit = () => {
  const params = useParams()
  const history = useHistory()
  const [showAlert, setShowAlert] = useState({
    type: "",
    text: ""
  })
  const [loadingState, setLoadingState] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: ""
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
    if (isError) return
    
    let fields = {
      ...userInfo,
      id: `U${randomNum()}`,
      group: [params.groupId]
    }

    console.log(fields)

    setLoadingState(true)
    createUserApi({fields})
      .then((res) => {
        console.log(res)
        setShowAlert({type: "success", text: "新增成功"})
        setTimeout(() => {
          setShowAlert({type: "", text: ""})
          setLoadingState(false)
          history.push(`/users/${params.groupId}`)
        }, 3000)
      })
      .catch((err) => {
        console.log(err)
        setShowAlert({type: "danger", text: "新增失敗，請稍後再試"})
        setTimeout(() => {
          setShowAlert({type: "", text: ""})
          setLoadingState(false)
        }, 3000)
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
                <Button name="新增夥伴" type="primary" event={checkInputs}></Button>
              </div>
            </div>
          
          </div>
          
        ) : (
          <Loading/>
        )
      }
      {/* Alert */}
      {
        !showAlert.text ? "" : (
          <Alert type={showAlert.type} text={showAlert.text}></Alert>
        )
      }
    </div>
  );
}

export default CreateSplit;