import React from 'react';

const Loading = () => {
  return (
    <div className="d-flex w-100 h-100 justify-content-center align-items-center flex-wrap">
      <div className="text-center">
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <br/>
        <p className="pt-3 text-secondary">讀取中</p>
      </div>
      
    </div>
  );
}

export default Loading;