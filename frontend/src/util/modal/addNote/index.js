import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Button, Form, Input, Icon } from 'antd'
import AddNoteForm from './AddNoteForm'

const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const AddNoteModal = (props) => {
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
  }

  return (
    <div>
      <Modal
        visible={props.visible}
        title='Shop'
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <AddNoteForm {...props} />
      </Modal>
    </div>
  )
}

export default AddNoteModal