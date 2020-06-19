/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Form, Icon, Input, Button, notification } from 'antd'
import gql from 'graphql-tag'

const EDIT_SHOP = gql`
  mutation EditShop($name: String!, $newName: String!) {
    editShop(name: $name, newName: $newName){
      name
    }
  }
`

// const openNotification = (e) => {
//   if (e === 1) {
//     notification.success({
//       message: 'Thêm shop thành công',
//       style: {
//         width: 600,
//         marginLeft: 335 - 600
//       },
//       placement: 'bottomRight',
//       duration: 2
//     })
//   } else {
//     notification.error({
//       message: 'Thêm shop thất bại',
//       style: {
//         width: 600,
//         marginLeft: 335 - 600
//       },
//       placement: 'bottomRight',
//       duration: 2
//     })
//   }
// }

const EditShop = (props) => {
  useEffect(() => {
    props.form.validateFields()
  }, [])
  console.log(props)
  // const [editShop] = useMutation(EDIT_SHOP)

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    console.log('ok')
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        // addShop({ variables: { data } })
        //   .then(res => {
        //     openNotification(1)
        //     props.setVisible(false)
        //     props.gridApi.updateRowData({ add: [data] })
        //   })
        //   .catch(err => {
        //     openNotification(0)
        //     console.log(err)
        //   })
      }
    })
  }, [])

  return (
    <div>
      <Form onSubmit={handleSubmit} className='login-form'>
        <Form.Item>
          <Input
            prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder='shop name'
            defaultValue='okokok'
          />,
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' className='login-form-button'>
            Sửa
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const EditShopForm = Form.create({ name: 'edit_shop' })(EditShop)
export default EditShopForm