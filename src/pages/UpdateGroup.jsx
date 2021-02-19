import React, { useState, useEffect, useContext } from 'react';
import Input from "../components/Input"
import Button from "../components/Button"
import { updateGroupApi, getGroupApi } from "../api/axiosApi" 
import { useHistory, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from "../components/Loading"
import Context from "../Context"

const CreateSplit = () => {
  const params = useParams()
  const history = useHistory()
  const [showAlert, setShowAlert] = useState({
    type: "",
    text: ""
  })
  const [loadingState, setLoadingState] = useState(false)
  const [groupInfo, setGroupInfo] = useState({
    name: ""
  })
  const [error, setError] = useState({
    name: false
  })

  const handleChange = (value, key) => {
    setGroupInfo({
      ...groupInfo,
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
    for (let key in groupInfo) {
      if (!groupInfo[key]) {
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
    let fields = {
      name: groupInfo.name
    }
    updateGroupApi(params.groupId, {fields})
      .then((res) => {
        setShowAlert({type: "success", text: "編輯成功"})
        setTimeout(() => {
          setShowAlert({type: "", text: ""})
          setLoadingState(false)
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

  const { setHeaderTitle } = useContext(Context)
  useEffect(() => {
    setHeaderTitle("編輯名稱")
    getGroup()
    return () => setHeaderTitle()
  }, [])

  const getGroup = () => {
    const groupId = params.groupId
    getGroupApi(groupId)
      .then(res => {
        const fields = res.data.fields
        setGroupInfo({name: fields.name || '不想努力分帳了'})
      }) 
      .catch(err => {

      })
  }

  return (
    <div className="w-100">
      {
        !loadingState ? (
          <div className="w-100 h-100 overflow-scroll p-4 pb-100">
            {/* Form */}
            <div className="card-list w-100 p-4">
              <Input
                option={{ title: "分帳名稱", key: "name", placeholder: "", required: true }}
                value={groupInfo.name}
                handleChange={handleChange}
                error={error.name}
              ></Input>
              <hr className="mt-5 mb-5 filled"/>
              <div className="text-center mb-4">
                <Button name="編輯名稱" type="primary" event={checkInputs}></Button>
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