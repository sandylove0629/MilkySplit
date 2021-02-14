import React from 'react';

const List = ({ list, type }) => {
  /*
    type: 1 (user, 有金額, 顯示pay及split分別金額)
    type: 2 (無金額) 
  */
  return (
    <div className="card-list w-100">
      {list.length && (
        <ul>
          { 
            list.map((element) => (
              <li key={element.id}>
                <div className="py-3 px-4 d-flex justify-content-between bg-light">
                  <p>{element.name}</p>
                  {element.total && <p>{element.total}</p>}
                </div>
                {
                  type === 1 && (
                    <ul>
                      <li className="py-3 px-4 d-flex justify-content-between border-bottom border-light">
                        <p>
                          <i className="material-icons t-5 pr-2">outbox</i>
                          支付
                        </p>
                        <p>{element.payPrice ? element.payPrice : 0}</p>
                      </li>
                      <li className="py-3 px-4 d-flex justify-content-between border-bottom border-light">
                        <p>
                          <i className="material-icons t-5 pr-2">move_to_inbox</i>
                          分帳
                        </p>
                        <p>{element.splitPrice ? element.splitPrice : 0}</p>
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
              </li>
            ))
          }
        </ul>
      )}
    </div>
  );
}

export default List;