/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Form, Icon, Input, Button, Select, notification } from 'antd'
import gql from 'graphql-tag'
import openNotification from '../../../components/Notification/Notification'

const { Option } = Select

const ADD_SHOP = gql`
  mutation CreateShop($data:InputCreateShop!) {
    createShop(data: $data) {
      _id
      name
    }
  }
`
const GET_ALL_SITE = gql`
query {
  sites {
    _id
    name
  }
}
`

const AddShop = (props) => {
  const { loading, data } = useQuery(GET_ALL_SITE, { errorPolicy: 'all', fetchPolicy: 'network-only' })
  useEffect(() => {
    props.form.validateFields()
  }, [])
  console.log(props)
  const [addShop] = useMutation(ADD_SHOP)

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    console.log('ok')
    props.form.validateFields((err, data) => {
      if (!err) {
        console.log('Received values of form: ', data)
        addShop({ variables: { data } })
          .then(res => {
            openNotification('success', 'Success', 'Thêm shop thành công')
            props.setVisible(false)
            props.refetch()
          })
          .catch(err => {
            const errors = err.graphQLErrors.map(error => error.message)
            openNotification('error', 'failed', errors[0])
          })
      }
    })
  }, [])

  const RenderOption = () => {
    if (!loading) {
      if (data && data.sites) {
        return data.sites.map(e => {
          return (
            <Option value={e._id} key={e._id}>{e.name}</Option >
          )
        }
        )
      }
    }
    console.log(data)
  }

  const { getFieldDecorator } = props.form
  return (
    <div>
      <Form onSubmit={handleSubmit} className='login-form'>
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your shop name!' }]
          })(
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='shop name'
            />
          )}
        </Form.Item>

        <Form.Item label='Select' >
          {getFieldDecorator('siteId', {
            rules: [{ required: true, message: 'Please select your site!' }]
          })(
            <Select placeholder='Please select a site'>
              {RenderOption()}
            </Select>
          )}
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' className='login-form-button'>
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const AddShopForm = Form.create({ name: 'add_shop' })(AddShop)
export default AddShopForm