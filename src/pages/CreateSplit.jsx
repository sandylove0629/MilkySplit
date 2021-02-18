import React, { useEffect, useState } from 'react';
import Input from "../components/Input"
import Select from "../components/Select"
import Checkbox from "../components/Checkbox"
import Button from "../components/Button"
import { getUsersApi, createSplitApi } from "../api/axiosApi" 
import { randomNum } from "../assets/js/random"
import { useHistory, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import Loading from "../components/Loading"

const CreateSplit = () => {
  const params = useParams()
  const history = useHistory()
  const [tab, setTab] = useState("single")
  const [showAlert, setShowAlert] = useState({
    type: "",
    text: ""
  })
  const [loadingState, setLoadingState] = useState(false)
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
    serviceCharge: false,
    itemList: []
  })

  // Select
  const styles = {
    control: css => ({ ...css, paddingLeft: '1rem' })
  }

  const handleChange = (value, key, index) => {
    if (typeof index !== "undefined") {
      let newItemList = [...itemList]
      let newItemListError = [...error.itemList]
      newItemList[index][key] = value
      newItemListError[index][key] = false
      setItemList(newItemList)
      setError({
        ...error,
        itemList: newItemListError
      })
      return
    }
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
    if (typeof index !== "undefined") {
      let newItemList = [...itemList]
      let newItemListError = [...error.itemList]
      newItemList[index][key] = value
      newItemListError[index][key] = false
      setItemList(newItemList)
      setError({
        ...error,
        itemList: newItemListError
      })
      return
    }
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

  // add item
  const [itemList, setItemList] = useState([])
  const addItem = () => {
    setItemList([
      ...itemList,
      {
        title: "",
        splitPeople: userList,
        price: ""
      }
    ])

    const itemListError = error.itemList
    setError({
      ...error,
      itemList: [
        ...itemListError,
        {
          title: false,
          splitPeople: false,
          price: false
        }
      ]
    })
  }
  const removeItem = (index) => {
    let newItemList = itemList.splice(index, 1)
    setItemList(newItemList)
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
    // 帳單模式
    if (tab === 'multiple') {
      const errorItemList = [...error.itemList]
      itemList.forEach((item, iIndex) => {
        for (let iKey in item) {
          if (iKey === 'title' || iKey === 'price') {
            if (!item[iKey]) {
              isError = true
              errorItemList[iIndex][iKey] = `${text[iKey]}為空`
              newErr ={
                ...newErr,
                itemList: errorItemList
              }
            }
          }
          if (iKey === 'splitPeople') {
            if (!item[iKey].length) {
              isError = true
              errorItemList[iIndex][iKey] = `${text[iKey]}為空`
              newErr = {
                ...newErr,
                itemList: errorItemList
              }
            }
          }
        }
      })
    }

    setError(newErr)
    return isError
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
    records = itemList.map(item => {
      const {splitPeople, price, ...content} = item
      return ({
        fields: {
          ...content,
          id: `O${randomNum()}`,
          group: [params.groupId],
          price: parseInt(price, 10),
          splitPeople: splitPeople.map(person => person.value),
          memo: fields.memo,
          payPerson: [payPerson.value],
          serviceCharge: hasServiceCharge ? Math.floor(serviceCharge) / 100 : 0
        }
      })
    }) || []

    records.splice(0, 0, {fields: fields})
    console.log(records)

    setLoadingState(true)
    createSplitApi({records: records})
      .then((res) => {
        console.log(res)
        setShowAlert({type: "success", text: "新增成功"})
        setTimeout(() => {
          setShowAlert({type: "", text: ""})
          setLoadingState(false)
          history.push(`/split/${params.groupId}`)
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

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="w-100">
      {
        !loadingState ? (
          <div className="w-100 h-100 overflow-scroll p-4 pb-100">
            {/* tab */}
            <div className="d-flex tab-block mb-4">
              <div 
                className={`flex-grow-1 text-center ${tab === 'single' ? 'active': ''}`}
                onClick={() => setTab('single')}
              >單項模式</div>
              <div 
                className={`flex-grow-1 text-center ${tab === 'multiple' ? 'active': ''}`}
                onClick={() => setTab('multiple')}
              >帳單模式</div>
            </div>
            {/* Form */}
            {
              tab === "multiple" ? (
                // 帳單模式
                <div className="card-list w-100 p-4">
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
                  <hr className="my-4 filled"/>
                  {/* 第一個必填 */}
                  <Input
                    option={{ title: "項目名稱", key: "title", placeholder: "ex: 炙燒鮭魚壽司", required: true }}
                    value={splitInfo.title}
                    handleChange={handleChange}
                    error={error.title}
                  ></Input>
                  <Input
                    option={{ title: "價格 (不含服務費)", key: "price", placeholder: "", type: "number", required: true }}
                    value={splitInfo.price}
                    handleChange={handleChange}
                    error={error.price}
                  ></Input>
                  <Select
                    list={userList}
                    option={{ title: "分帳夥伴", key: "splitPeople", placeholder: "分錢的夥伴", isMulti: true, required: true }}
                    value={splitInfo.splitPeople}
                    handleSelect={handleSelect}
                    error={error.splitPeople}
                  ></Select>
                  {/* item list */}
                  {
                    !itemList.length ? "" : itemList.map((item, index) => (
                      <div key={`item-${index}`}>
                        <hr className="my-4 filled"/>
                        {/* 移除 */}
                        <div className="d-flex justify-content-end text-danger">
                          <div className="px-2" onClick={() => removeItem(index)}>
                            <i className="material-icons text-18">delete</i>
                          </div>
                        </div>
                        <Input
                          option={{ title: "項目名稱", key: "title", placeholder: "ex: 炙燒鮭魚壽司", required: true }}
                          value={item.title}
                          handleChange={(val, key) => handleChange(val, key, index)}
                          error={error.itemList[index].title}
                        ></Input>
                        <Input
                          option={{ title: "價格 (不含服務費)", key: "price", placeholder: "", type: "number", required: true }}
                          value={item.price}
                          handleChange={(val, key) => handleChange(val, key, index)}
                          error={error.itemList[index].price}
                        ></Input>
                        <Select
                          list={userList}
                          option={{ title: "分帳夥伴", key: "splitPeople", placeholder: "分錢的夥伴", isMulti: true, required: true }}
                          value={item.splitPeople}
                          handleSelect={(val, key) => handleSelect(val, key, index)}
                          error={error.itemList[index].splitPeople}
                        ></Select>
                      </div>
                    ))
                  }

                  <div>
                    <hr className="mt-5 mb-5 filled"/>
                    {/* 新增項目按鈕 */}
                    <div 
                      className="absolute rounded-circle text-white icon-add-item
                      d-flex flex-wrap justify-content-center align-items-center"
                      onClick={addItem}
                    >
                      <i className="material-icons">add</i>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <Button name="新增帳單" type="primary" event={checkInputs}></Button>
                  </div>
                </div>
              ) : (
                // 單項模式
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
                    <Button name="新增項目" type="primary" event={checkInputs}></Button>
                  </div>
                </div>
              )
            }
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