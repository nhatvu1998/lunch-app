/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Form, Icon, Input, Button, Row, Col } from 'antd'
import './styles.scss'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'

const REGISTER = gql`
  mutation Register($userData:InputRegister!) {
    register(userData: $userData) {
      username
    }
  }
`

const NormalRegisterForm = (props) => {
  useEffect(() => {
    props.form.validateFields()
  }, [])
  const [confirmDirty, setConfirmDirty] = useState(false)
  const [register] = useMutation(REGISTER)

  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        const userData = values
        console.log('Received values of form: ', values)
        register({ variables: { userData } })
          .then(props.history.push('/login'))
          .catch(err => console.log(err))
      }
    })
  }

  const handleConfirmBlur = e => {
    const { value } = e.target
    setConfirmDirty(confirmDirty || !!value)
  }

  const compareToFirstPassword = (_, value, callback) => {
    if (value && value !== props.form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  const validateToNextPassword = (_, value, callback) => {
    if (value && confirmDirty) {
      props.form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  const { getFieldDecorator } = props.form
  return (
    <div>
      <Row className='layout-register'>
        <Col
          xs={{ span: 24, offset: 0 }}
          sm={{ span: 16, offset: 8 }}
          md={{ span: 14, offset: 10 }}
          lg={{ span: 12, offset: 12 }}
          xl={{ span: 7, offset: 17 }}
        >
          <div className='right-layout'>
            <div className='header'>
              <img src='http://acexis.com/static/logo-6db1382b3bd008f64df4dfe39d2d31c1.png' alt='drawing' width='200' />
            </div>
            <Form onSubmit={handleSubmit} className='register-form'>
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [
                    { required: true, message: 'Please input your username!' },
                    {
                      pattern: /^[^\s]/,
                      message: 'Không được có dấu cách đầu dòng'
                    }]
                })(
                  <Input
                    prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder='Username'
                  />
                )}
              </Form.Item>
              <Form.Item hasFeedback>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your password!'
                    },
                    {
                      validator: validateToNextPassword
                    }
                  ]
                })(<Input.Password
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Password'
                />)}
              </Form.Item>
              <Form.Item hasFeedback>
                {getFieldDecorator('passwordCheck', {
                  rules: [
                    {
                      required: true,
                      message: 'Please confirm your password!'
                    },
                    {
                      validator: compareToFirstPassword
                    }
                  ]
                })(<Input.Password
                  prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder='Password confirm'
                  onBlur={handleConfirmBlur}
                />)}
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit' className='register-form-button'>
                  Register
                </Button>
                Or <Link to='/login'>login now! </Link>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>

  )
}

const Register = Form.create({ name: 'normal_register' })(NormalRegisterForm)
export default Register