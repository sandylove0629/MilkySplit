import React, { useEffect, useState } from "react"

/*
  options: {
    persistent: true // 點擊黑色區域即可關閉 modal
  }
*/

const Modal = ({ title, btnName, mShow, event, options = {}, children, confirm }) => {
  const [modalShow, setModalShow] = useState(false)

  // 外層傳進來
  useEffect(() => {
    setModalShow(mShow)
  }, [mShow])

  // 內層往上傳
  useEffect(() => {
    event(modalShow)
  }, [modalShow])

  const doConfirm = () => {
    if (confirm) confirm()
  }

  return (
    <div className={`modal${modalShow ? " show" : ""}`}>
      { options.persistent ? "" : <div className="modal-display w-100 h-100 absolute" onClick={() => setModalShow(false)}></div>}
      <div className="modal-dialog ms-3 md-4">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || "提醒"}</h5>
            <button type="button" className="btn-close" onClick={() => setModalShow(false)}>
              <i className="material-icons">cancel</i>
            </button>
          </div>
          <div className="modal-body text-left">
            {children}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-default btn-cancel cell" onClick={() => setModalShow(false)}>取消</button>
            <button type="button" className="btn btn-default cell ml-3" onClick={() => doConfirm()}>{btnName || "確定"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Modal