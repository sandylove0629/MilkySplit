import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { useParams } from 'react-router-dom';
import { getUserApi, getPaymentMethodApi } from '../api/axiosApi';

const PaymentMethod = () => {
  const params = useParams()
  const test = `<p>hello</p>`
  const [loadingState, setLoadingState] = useState(true)
  const [splitInfo, setSplitInfo] = useState({})
  const [paymentMethodList, setPaymentMethodList] = useState([])

  // 解析 base64
  const init  = () => {
    if (params.codeId) {
      const info = JSON.parse(atob(params.codeId))
      console.log(info)
      setSplitInfo(info)
      getUser(info.receiveUserId)
    }    
  }

  const getUser = (userId) => {
    getUserApi(userId)
      .then(async (res) => {
        const fields = res.data.fields
        console.log(fields.paymentMethod)
        const pMethod = fields.paymentMethod
        if (pMethod) {
          let list = []
          for (let i = 0; i < pMethod.length; i++) {
            await getPaymentMethod(pMethod[i])
              .then(method => {
                console.log(method)
                list.push(method)
                console.log(paymentMethodList)
              })
          }
          setPaymentMethodList(list)
        }
        setLoadingState(false)
      }) 
      .catch(err => {

      })
  }

  const getPaymentMethod = (paymentMethodId) => {
    return new Promise ((resolve, reject) => {
      getPaymentMethodApi(paymentMethodId)
        .then(res => {
          const fields = res.data.fields
          resolve(fields)
        }) 
        .catch(err => {
          reject()
        })
    })
  }

  const validURL = str => {
    var strRegex = '((https|http)://)[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+';
    var regex=new RegExp(strRegex,"gi"); 
  }

  const checkText = str => {
    console.log(validURL(str))
    return [
      { type: 1, text: str }
    ]
  }

  useEffect(() => {
    init()
  }, [])
  return (
    <div className={`w-100 overflow-hidden ${loadingState ? "d-flex justify-content-center" : ""}`}>
      {/* 列表 */}
      {
        !loadingState ? (
          <div className="w-100 h-100 overflow-scroll p-4 pb-100">
            <div className="card-list mb-4">
              <div className="p-3 d-flex justify-content-between">
                <div className="d-flex align-items-center bold">
                  {splitInfo.payUser}<i className="material-icons px-4">east</i> {splitInfo.receiveUser}
                </div>
                <div className="bold">${splitInfo.money}</div>
              </div>
            </div>
              {paymentMethodList.map(paymentMethod => (
                <div className="card-list mb-4" key={paymentMethod.id} >
                  <ul>
                    <li className="p-3">
                      <img className="w-100" src={paymentMethod.image[0].url} alt=""/>
                    </li>
                    <li className="p-3 text-break">{paymentMethod.text}</li>
                    {/* <li className="p-3 text-break">
                      {
                        checkText(paymentMethod.text).map((elm, eIndex) =>{
                          if (elm.type === 2) return <a key={eIndex} href={elm.text}>{elm.text}</a>
                          return <span key={eIndex}>{elm.text}</span>
                        })
                      }
                    </li> */}
                  </ul>
                </div>
              ))}
          </div>
        ) : (
          <Loading/>
        )
      }
    </div>
  );
}

export default PaymentMethod;