import React from 'react';

const List = ({ list, type}) => {
  /*
    type: 1 (default, 有金額)
    type: 2 (無金額) 
  */
  return (
    <div className="card-list w-100">
      {list.length && (
        <ul>
          { 
            list.map((element) => (
              <li key={element.id}>
                <div className="py-3 px-4 d-flex justify-content-between">
                  <p>{element.name}</p>
                  {element.money && <p>{element.money}</p>}
                </div>
                <hr/>
                {element.details && (
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
                )}
              </li>
            ))
          }
        </ul>
      )}
    </div>
  );
}

export default List;