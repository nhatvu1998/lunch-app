import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button, Form, Input, Icon } from 'antd';
import AddSiteForm from './AddSiteForm';



const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const AddSiteModal = (props) => {
  console.log(props.visible)
  const [loading, setLoading] = useState(false)

  const handleOk = () => {
    props.setVisible(false)
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);

  };

  const handleCancel = () => {
    props.setVisible(false)
  };

  return (
    <div>
      {/* <Button type="primary" onClick={showModal}>
        Đổi mật khẩu
        </Button> */}
      <Modal
        visible={props.visible}
        // visible={true}
        title="Thêm khu vực"
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
        <AddSiteForm {...props} />
      </Modal>
    </div>
  );

}

export default AddSiteModal