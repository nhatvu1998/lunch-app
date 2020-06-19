/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useCallback } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Form, Icon, Input, Button, Card, Row, Col, notification } from 'antd'
import gql from 'graphql-tag'

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($userData:InputChangePassword!) {
    changePassword(userData: $userData) {
      username
    }
  }
`

const openNotification = (e) => {
  if (e === 1) {
    notification.success({
      message: 'Thay đổi mật khẩu thành công',
      style: {
        width: 600,
        marginLeft: 335 - 600
      },
      placement: 'bottomRight',
      duration: 2
    })
  } else {
    notification.error({
      message: 'Thay đổi mật khẩu thất bại',
      style: {
        width: 600,
        marginLeft: 335 - 600
      },
      placement: 'bottomRight',
      duration: 2
    })
  }
}

const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

const ChangePassword = (props) => {
  useEffect(() => {
    props.form.validateFields()
  }, [])
  console.log(props)
  const [changePassword] = useMutation(CHANGE_PASSWORD)
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    console.log('ok')

    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        changePassword({ variables: { values } })
          .then(res => {
            openNotification(1)
            props.setVisible(false)
            localStorage.removeItem('token')
            props.setIsAuthenticated(false)
            props.history.push('/login')
          })
          .catch(err => {
            openNotification(0)
            console.log(err)
          })
      }
    })
  }, [])

  const { getFieldDecorator } = props.form
  return (
    <div>
      <Form onSubmit={handleSubmit} className='login-form'>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your password!' }]
          })(
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='password'
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('newPassword', {
            rules: [{ required: true, message: 'Please input your new password!' }]
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='new password'
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' className='login-form-button'>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const ChangePasswordForm = Form.create({ name: 'change_password' })(ChangePassword)
export default ChangePasswordForm