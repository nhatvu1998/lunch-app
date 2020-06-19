import React, { useState, useCallback } from 'react'
import { Modal, Button, Form, Input, Icon } from 'antd'
import ChangePasswordForm from './ChangePasswordForm'

const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const ChangePasswordModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const showModal = () => {
    setVisible(true)
  }

  const handleOk = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({ loading: false, visible: false })
    }, 3000)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  return (
    <div>
      <Button type='primary' onClick={showModal}>
        Đổi mật khẩu
      </Button>
      <Modal
        visible={visible}
        title='Đổi mật khẩu'
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
        <ChangePasswordForm setVisible={setVisible} {...props} />
      </Modal>
    </div>
  )
}

export default ChangePasswordModal