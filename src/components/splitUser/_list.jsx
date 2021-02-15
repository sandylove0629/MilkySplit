import React from 'react';

const List = ({ list, type, amount }) => {
  /*
    type: 1 (支付) 
    type: 2 (分帳)
  */
  return (
    <div className="card-list w-100">
      { list.length && (
        <ul>
          <li>
              {
                type === 1 ? (
                  <div className="py-3 px-4 d-flex justify-content-between bg-light">
                    <p>
                      <i className="material-icons t-5 pr-2">outbox</i>
                      支付
                    </p>
                    { amount && <p>{parseFloat(amount.toFixed(2))}</p> }
                  </div>
                ) : (
                  <div className="py-3 px-4 d-flex justify-content-between bg-light">
                    <p>
                      <i className="material-icons t-5 pr-2">move_to_inbox</i>
                      收帳
                    </p>
                    { amount && <p>{parseFloat(amount.toFixed(2))}</p> }
                  </div>
                )
              }              
          </li>
          { 
            list.map((element) => (
              <li key={`${type === 1 ? 'pay' : 'split'}-${element.id}`}>
                <div className="py-3 px-4 d-flex justify-content-between">
                  <p>
                    <i className="material-icons t-4 pr-2">subdirectory_arrow_right</i>
                    {element.name}
                  </p>
                  { element.total && <p>{parseFloat(element.total.toFixed(2))}</p> }
                </div>
              </li>
            ))
          }
        </ul>
      )}
    </div>
  );
}

export default List;