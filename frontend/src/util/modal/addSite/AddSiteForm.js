import React, { useEffect, useContext, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Form, Icon, Input, Button, Card, Row, Col, notification } from 'antd';
import gql from "graphql-tag";

const ADD_SITE = gql`
  mutation CreateSite($data:InputCreateSite!) {
    createSite(data: $data) {
      name
    }
  }
`

const openNotification = (e) => {
  if (e === 1) {
    notification.success({
      message: 'Thêm khu vực thành công',
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
      placement: "bottomRight",
      duration: 2
    });
  } else {
    notification.error({
      message: 'Thêm khu vực thất bại',
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
      placement: "bottomRight",
      duration: 2
    });
  }

}

const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const AddSite = (props) => {
  useEffect(() => {
    props.form.validateFields();
  }, [])
  console.log(props)
  const [addSite] = useMutation(ADD_SITE);
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('ok')

    props.form.validateFields((err, values) => {
      if (!err) {
        let data = values

        console.log('Received values of form: ', values);
        addSite({ variables: { data } })
          .then(res => {
            openNotification(1)
            props.setVisible(false)
            props.gridApi.updateRowData({ add: [data] })
            //props.refetch()
            //props.gridApi.redrawRows()
          })
          .catch(err => {
            openNotification(0)
            console.log(err)
          })
      }
    })
  }, [])

  const { getFieldDecorator } = props.form;
  return (
    <div>
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your site name!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="site name"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Thêm
            </Button>
        </Form.Item>
      </Form>
    </div>
  );
}


const AddSiteForm = Form.create({ name: 'add_site' })(AddSite);
export default AddSiteForm