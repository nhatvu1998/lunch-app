/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Button, Form, Input, Icon } from 'antd'
import AddDishForm from './AddDishForm'

const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const AddDishModal = (props) => {
  console.log(props)
  // const [loading, setLoading] = useState(false)

  const handleOk = useCallback(() => {
    props.setVisible(false)
    setTimeout(() => {
      this.setState({ loading: false, visible: false })
    }, 3000)
  }, [])

  const handleCancel = useCallback(() => {
    props.setVisible(false)
  }, [props.visible])

  return (
    <div>
      {/* <Button type="primary" onClick={showModal}>
        Đổi mật khẩu
        </Button> */}
      <Modal
        visible={props.visible}
        title='Thêm món ăn'
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
        <AddDishForm {...props} />
      </Modal>
    </div>
  )
}

export default AddDishModal