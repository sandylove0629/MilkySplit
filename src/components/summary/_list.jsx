import React from 'react';
import { useHistory, useParams } from 'react-router-dom'

const List = ({ list, type }) => {
  /*
    type: 1 (user, 有金額, 顯示pay及split分別金額)
    type: 2 (無金額) 
  */

  const history = useHistory()
  const params = useParams()
  
  const routeToPayment = (element) => {
    console.log(element)
    let query = JSON.stringify(element)
    let code = btoa(query)
    history.push(`/paymentMethod/${params.groupId}/${code}`)
  }

  return (
    <div>
      {list.length && (
        <div>
          { 
            list.map((element, index) => (
              <div className="card-list w-100 mb-4" 
                  key={index} 
                  onClick={() => routeToPayment(element)}
              >
                <ul>
                  <li className="p-3 d-flex justify-content-between bg-light">
                    <div>
                      <p>{element.payUser}</p>
                      <p>
                        <i className="material-icons t-5 pr-2">subdirectory_arrow_right</i>
                        給 {element.receiveUser}
                      </p>
                    </div>
                    <p className="d-flex align-items-center">{element.money}</p>
                  </li>
                </ul>
                
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default List;