import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Button, Form, Input, Icon } from 'antd'
import AddShopForm from './AddShopForm'
import EditShopForm from './EditShopForm'

const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const AddShopModal = (props) => {
  console.log(props)
  const [loading, setLoading] = useState(false)

  const handleOk = () => {
    props.setVisible(false)
    setTimeout(() => {
      this.setState({ loading: false, visible: false })
    }, 3000)
  }

  const handleCancel = () => {
    props.setVisible(false)
    props.setIsEditForm(false)
  }

  return (
    <div>
      {/* <Button type="primary" onClick={showModal}>
        Đổi mật khẩu
        </Button> */}
      <Modal
        visible={props.visible}
        title='Shop'
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          // <Button key="back" onClick={handleCancel}>
          //   Return
          //   </Button>,
          // <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          //   Submit
          //   </Button>,
        ]}
      >
        {!props.isEditForm ? <AddShopForm {...props} /> : <EditShopForm {...props} />}
      </Modal>
    </div>
  )
}

export default AddShopModal