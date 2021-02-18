import React from 'react';
import { useHistory, useParams } from "react-router-dom"

const List = ({ list, type }) => {
  /*
    type: 1 (user, 有金額, 顯示pay及split分別金額)
    type: 2 (無金額) 
  */
  const history = useHistory()
  const params = useParams()
  const routeToUser = (userId) => {
    history.push(`/splitUser/${params.groupId}/${userId}`)
  }
  return (
    <div>
      {list.length && (
        <div>
          { 
            list.map((element) => (
              <div className="card-list w-100 mb-4 cursor-pointer" 
                  key={element.id} 
                  onClick={() => routeToUser(element.id)}
              >
                <ul>
                  <li className="py-3 px-4 d-flex justify-content-between bg-light">
                    <p>{element.name}</p>
                    {element.total && <p>{parseFloat(element.total.toFixed(2))}</p>}
                  </li>
                  {
                    type === 1 && (
                      <ul>
                        <li className="py-3 px-4 d-flex justify-content-between border-bottom border-light">
                          <p>
                            <i className="material-icons t-5 pr-2">outbox</i>
                            花費
                          </p>
                          <p>{element.payPrice ? parseFloat(element.payPrice.toFixed(2)) : 0}</p>
                        </li>
                        <li className="py-3 px-4 d-flex justify-content-between border-bottom border-light">
                          <p>
                            <i className="material-icons t-5 pr-2">move_to_inbox</i>
                            受益
                          </p>
                          <p>{element.splitPrice ? parseFloat(element.splitPrice.toFixed(2)) : 0}</p>
                        </li>
                      </ul>
                    )
                  }
                  {/* <hr/> */}
                  {/* {element.details && (
                    <ul>
                      {
                        element.details.map((detail) => (
                          <li className="py-3 px-4 d-flex justify-content-between" key={detail.id}>
                            <p>
                              <i className="material-icons t-4 pr-2">subdirectory_arrow_right</i>
                              {detail.name}
                            </p>
                            {detail.money && <p>{detail.money}</p>}
                          </li>
                        ))
                      }
                      
                    </ul>  
                  )} */}
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