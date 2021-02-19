import React, { useEffect, useState } from 'react';
import Input from "../components/Input"
import Select from "../components/Select"
import Checkbox from "../components/Checkbox"
import Button from "../components/Button"
import { getUsersApi, updateSplitApi, getSplitApi, deleteSplitsApi } from "../api/axiosApi" 
import { randomNum } from "../assets/js/random"
import { useHistory, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from "../components/Loading"
import Modal from "../components/Modal"

const UpdateSplit = () => {
  const params = useParams()
  const history = useHistory()
  const [tab, setTab] = useState("single")
  const [showAlert, setShowAlert] = useState({
    type: "",
    text: ""
  })
  const [loadingState, setLoadingState] = useState(true)
  const [splitInfo, setSplitInfo] = useState({
    title: "",
    memo: "",
    payPerson: [],
    splitPeople: [],
    price: "",
    hasServiceCharge: false,
    serviceCharge: 10
  })
  const [error, setError] = useState({
    title: false,
    payPerson: false,
    splitPeople: false,
    price: false,
    serviceCharge: false
  })

  // Select
  const styles = {
    control: css => ({ ...css, paddingLeft: '1rem' })
  }

  const handleChange = (value, key) => {
    setSplitInfo({
      ...splitInfo,
      [key]: value
    });
    setError({
      ...error,
      [key]: false
    })
  };
  const handleSelect = (value, key, index) => {
    setSplitInfo({
      ...splitInfo,
      [key]: value
    })
    setError({
      ...error,
      [key]: false
    })
    console.log(splitInfo)
  }
  const handleCheck = (value, key) => {
    console.log(value)
    setSplitInfo({
      ...splitInfo,
      [key]: value
    })
  }

  // users
  let users = []
  const [userList, setUserList] = useState([])
  const getUsers = () => {
    const sGroupId = localStorage.getItem("split_group")
    if (sGroupId) {
      const id = JSON.parse(sGroupId).fields.id
      getUsersApi(id)
        .then(res => {
          res.data.records.map((user) => {
            users = [
              ...users,
              {
                value: user.id,
                label: user.fields.name
              }
            ]
          })
          // set default
          setUserList(users)
          setSplitInfo({
            ...splitInfo,
            splitPeople: users
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
    
  }

  // check inputs
  const checkForm = async () => {
    // 一般 / 帳單 皆檢查
    let isError = false
    const text = {
      title: "項目名稱", 
      payPerson: "付款人", 
      splitPeople: "分帳夥伴", 
      price: "價格 (不含服務費)",
      serviceCharge: "服務費比例"
    }
    let newErr = {...error}
    for (let key in splitInfo) {
      if (key === 'title' || key === 'price') {
        if (!splitInfo[key]) {
          isError = true
          newErr = {
            ...newErr,
            [key]: `${text[key]}為空`
          }
        }
        if (key === 'price' && parseInt(splitInfo[key], 10) < 0) {
          isError = true
          newErr = {
            ...newErr,
            [key]: `請輸入正確${text[key]}`
          }
        }
      }
      console.log(key, key === 'hasServiceCharge', !splitInfo.serviceCharge)
      if (key === 'hasServiceCharge') {
        if (!splitInfo.serviceCharge) {
          isError = true
          newErr = {
            ...newErr,
            serviceCharge: `${text['serviceCharge']}為空`
          }
        }
        if (parseInt(splitInfo.serviceCharge, 10) < 0) {
          isError = true
          newErr = {
            ...newErr,
            serviceCharge: `請輸入正確${text['serviceCharge']}`
          }
        }
      }
      if (key === 'payPerson') {
        if (!splitInfo[key].value) {
          isError = true
          newErr = {
            ...newErr,
            [key]: `${text[key]}為空`
          }
        }
      }
      if (key === 'splitPeople') {
        if (!splitInfo[key].length) {
          isError = true
          newErr = {
            ...newErr,
            [key]: `${text[key]}為空`
          }
        }
      }
      console.log(newErr)
    }

    setError(newErr)
    return isError
  }
  
  const getSplit = () => {
    const id = params.splitId
    getSplitApi(id)
      .then(res => {
        console.log(res.data.fields)
        const fields = res.data.fields
        setSplitInfo({
          title: fields.title,
          memo: fields.memo || "",
          payPerson: userList.find(user => user.value === fields.payPerson[0]),
          splitPeople: fields.splitPeople.map(splitUser => {
            return userList.find(user => user.value === splitUser)
          }),
          price: fields.price,
          hasServiceCharge: fields.serviceCharge ? true : false,
          serviceCharge: fields.serviceCharge * 100
        })
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setTimeout(() => {
          setLoadingState(false)
        }, 1000)
      })
  }

  const checkInputs = async () => {
    const isError = await checkForm()
    if (isError) return
    
    let records = []
    let {payPerson, splitPeople, serviceCharge, hasServiceCharge, price, ...fields} = splitInfo
    fields = {
      ...fields,
      id: `O${randomNum()}`,
      price: parseInt(price, 10),
      group: [params.groupId],
      payPerson: [payPerson.value],
      splitPeople: splitPeople.map(person => person.value),
      serviceCharge: hasServiceCharge ? Math.floor(serviceCharge) / 100   : 0
    }

    records.splice(0, 0, {fields: fields})
    console.log(records)

    setLoadingState(true)
    updateSplitApi(params.splitId, {fields})
      .then((res) => {
        console.log(res)
        setShowAlert({type: "success", text: "編輯成功"})
        setTimeout(() => {
          setShowAlert({type: "", text: ""})
          setLoadingState(false)
          history.push(`/split/${params.groupId}`)
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

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    getSplit()
  }, [userList])

  const [modalShow, setModalShow] = useState(false)
  const toggleModal = (mShow) => {
    setModalShow(mShow)
  }
  const deleteSplits = () => {
    toggleModal(false)
    setLoadingState(true)
    deleteSplitsApi(`records[]=${params.splitId}`)
      .then(res => {
        // set default
        setShowAlert({type: "success", text: "刪除成功"})
        setTimeout(() => {
          history.push(`/split/${params.groupId}`)
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
              <Input
                option={{ title: "項目名稱", key: "title", placeholder: "ex: 炙燒鮭魚壽司", required: true }}
                value={splitInfo.title}
                handleChange={handleChange}
                error={error.title}
              ></Input>
              <Input
                option={{ title: "項目備註", key: "memo", placeholder: "ex: 藏壽司" }}
                value={splitInfo.memo}
                handleChange={handleChange}
                error={error.memo}
              ></Input>
              <Select
                list={userList}
                option={{ title: "付款人", key: "payPerson", placeholder: "付錢的人", required: true }}
                value={splitInfo.payPerson}
                handleSelect={handleSelect}
                error={error.payPerson}
              ></Select>
              <Select
                list={userList}
                option={{ title: "分帳夥伴", key: "splitPeople", placeholder: "分錢的夥伴", isMulti: true, required: true }}
                value={splitInfo.splitPeople}
                handleSelect={handleSelect}
                error={error.splitPeople}
              ></Select>
              <Input
                option={{ title: "價格 (不含服務費)", key: "price", placeholder: "", type: "number", required: true }}
                value={splitInfo.price}
                handleChange={handleChange}
                error={error.price}
              ></Input>
              <div>
                <Checkbox
                  option={{ title: "服務費", key: "hasServiceCharge", placeholder: "", type: "number", required: true }}
                  value={splitInfo.hasServiceCharge}
                  handleCheck={handleCheck}
                ></Checkbox>
                {
                  splitInfo.hasServiceCharge && (
                    <Input
                      option={{ title: "服務費比例", key: "serviceCharge" }}
                      value={splitInfo.serviceCharge}
                      handleChange={handleChange}
                      error={error.serviceCharge}
                    ></Input>
                  )
                }
              </div>
              <hr className="mt-5 mb-5 filled"/>
              <div className="text-center mb-4">
                <Button name="編輯項目" type="primary" event={checkInputs}></Button>
              </div>
            </div>
            <div className="text-center pt-4">
              <Button name="刪除項目" type="danger" event={() => toggleModal(!modalShow)}></Button>
            </div>
          </div>
          
        ) : (
          <Loading/>
        )
      }
      {/* Modal */}
      <Modal event={toggleModal} mShow={modalShow} options={{persistent: false}} confirm={deleteSplits}>
        <p>確定刪除項目 ?</p>
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

export default UpdateSplit;