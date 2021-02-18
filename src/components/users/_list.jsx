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
    // history.push(`/editUser/${params.groupId}/${userId}`)
  }
  return (
    <div>
      {list.length && (
        <div>
          <div className="card-list w-100 mb-4" 
              >
            <ul>
              { 
                list.map((element) => (
                  <li 
                    className="py-3 px-4 d-flex justify-content-between border-bottom border-light"
                    key={element.id} 
                    onClick={() => routeToUser(element.id)}
                  >
                    <p>{element.name}</p>
                  </li>
                ))
              }
            </ul>                    
          </div>
        </div>
      )}
    </div>
  );
}

export default List;