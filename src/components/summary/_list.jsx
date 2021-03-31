import React from 'react';

const List = ({ list, type }) => {
  /*
    type: 1 (user, 有金額, 顯示pay及split分別金額)
    type: 2 (無金額) 
  */

  return (
    <div>
      {list.length && (
        <div>
          { 
            list.map((element, index) => (
              <div className="card-list w-100 mb-4" 
                  key={index} 
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