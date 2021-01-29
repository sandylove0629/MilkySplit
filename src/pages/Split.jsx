import React, { useState } from 'react';
import SummaryCard from "../components/SummaryBlock"
import List from "../components/List";
import Button from "../components/Button"
import Modal from "../components/Modal"
import { listTest } from "../assets/json/test"

const Split = () => {
  const [amount, setAmount] = useState(300)
  const [splitList, setSplitList] = useState(listTest) // 分帳列表
  const [modalShow, setModalShow] = useState(false)

  const toggleModal = (mShow) => {
    setModalShow(mShow)
  }

  return (
    <div className={`w-100 overflow-hidden ${!splitList.length ? "d-flex justify-content-center" : ""}`}>
      {/* 新增按鈕 */}
      <div 
        className="absolute rounded-circle text-white icon-add
        d-flex flex-wrap justify-content-center align-content-center"
      >
        <i className="material-icons">add</i>
      </div>
      <div className="w-100 h-100 overflow-scroll pb-100">
        { !splitList.length && SplitEmpty() }
        { splitList.length && (<div><SummaryCard amount={amount}/><List list={splitList}/></div>) }
        <div className="text-center pt-4">
          <Button name="清空資料" type="danger" event={() => toggleModal(!modalShow)}></Button>
        </div>
      </div>
      {/* Modal */}
      <Modal event={toggleModal} mShow={modalShow} options={{persistent: false}}>
        <p>確定清空資料 ?</p>
      </Modal>
    </div>
  );
}

const SplitEmpty = () => {
  return (
    <div className="d-flex h-100 justify-content-center align-content-center flex-wrap">
      <div className="text-center text-disabled">
        <i className="material-icons xs-90">pets</i>
        <br/>
        <h1>無任何資料</h1>
      </div>
    </div>
  )
}

export default Split;