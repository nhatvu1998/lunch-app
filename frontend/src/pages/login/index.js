import React, { useEffect, useContext, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Form, Icon, Input, Button, Card, Row, Col, notification } from 'antd';
import "./styles.scss"
import history from '../../history'
import gql from "graphql-tag";
import { Link } from 'react-router-dom';

const LOGIN = gql`
  mutation Login($userData:InputLogin!) {
    login(userData: $userData) {
      token
    }
  }
`
const openNotification = (e) => {
  if (e === 1) {
    notification.success({
      message: 'Đăng nhập thành công',
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
      placement: "bottomRight",
      duration: 2
    });
  } else {
    notification.error({
      message: 'Tên đăng nhập hoặc mật khẩu không đúng',
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

const NormalLoginForm = (props) => {
  useEffect(() => {
    props.form.validateFields();
  }, [])

  const [login] = useMutation(LOGIN);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log('ok')
    props.form.validateFields((err, values) => {
      if (!err) {
        let userData = values
        console.log('Received values of form: ', values);
        login({ variables: { userData } })
          .then(res => {
            localStorage.setItem("token", res.data.login.token)
            openNotification(1)
            props.setIsAuthenticated(true)
            props.history.push('/lun')
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
      <Row type="flex" justify="space-around" align="middle" className="layout-login">
        <Col xs={{ span: 24, offset: 0 }}
          sm={{ span: 16, offset: 8 }}
          md={{ span: 14, offset: 10 }}
          lg={{ span: 12, offset: 12 }}
          xl={{ span: 7, offset: 17 }} >

          <div className='right-layout'>
            <div className='header'>
              <img src="http://acexis.com/static/logo-6db1382b3bd008f64df4dfe39d2d31c1.png" alt="drawing" width="200" />
            </div>
            <Form onSubmit={handleSubmit} className="login-form">
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Log in
                </Button >
                Or <Link to='/register'>register now!</Link>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>

  );
}


const Login = Form.create({ name: 'normal_login' })(NormalLoginForm);
export default Login