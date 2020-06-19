import React from 'react'
import { Modal } from 'antd'
import AddMenuForm from './AddMenuForm'

const AddMenuModal = (props) => {
  console.log(props.visible)
  // const [loading, setLoading] = useState(false)

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
      {/* <Button type="primary" onClick={showModal}>
        Đổi mật khẩu
        </Button> */}
      <Modal
        visible={props.visible}
        // visible={true}
        title='Thêm khu vực'
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
        <AddMenuForm {...props} />
      </Modal>
    </div>
  )
}

export default AddMenuModal