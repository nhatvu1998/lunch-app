/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Form, Button, Select, notification } from 'antd'
import gql from 'graphql-tag'
const { Option } = Select

const GET_DISHES = gql`
query shop($id: String!){
  shop(id: $id) {
    dishes {
      _id
      name
    }
  }
}
`

// const GET_MENU_DETAIL = gql`
// query FindById($id: String!){
//   findById(id: $id) {
//     dishes {
//       name
//       orderCount
//       count
//     }
//   }
// }
// `

const ADD_DISHES = gql`
mutation AddDishes($data: InputAddDish!){
  addDishes(data: $data) {
    name
  }
}
`

const openNotification = (e) => {
  if (e === 1) {
    notification.success({
      message: 'Thêm menu thành công',
      style: {
        width: 600,
        marginLeft: 335 - 600
      },
      placement: 'bottomRight',
      duration: 2
    })
  } else {
    notification.error({
      message: 'Thêm menu thất bại',
      style: {
        width: 600,
        marginLeft: 335 - 600
      },
      placement: 'bottomRight',
      duration: 2
    })
  }
}

const AddDishOnMenu = (props) => {
  const { loading, data } = useQuery(GET_DISHES, { variables: { id: props.shopId } }, { errorPolicy: 'all', fetchPolicy: 'network-only' })
  console.log(props)
  const [addDishes] = useMutation(ADD_DISHES)
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    console.log('ok')
    props.form.validateFields((err, values) => {
      if (!err) {
        const data = {}
        data.menuId = props.id
        data.dishes = values.dishes.map(e => {
          return {
            name: e,
            orderCount: 0,
            count: 10
          }
        })

        console.log(data)
        addDishes({ variables: { data } })
          .then(res => {
            openNotification(1)
            props.setVisible(false)
            props.gridApi.updateRowData({ add: [...data.dishes] })
            // props.refetch()
          })
          .catch(err => {
            openNotification(0)
            console.log(err)
          })
      }
    })
  }, [])

  const RenderDishOption = useCallback(() => {
    if (!loading) {
      if (data && data.shop.dishes) {
        return data.shop.dishes.map(e => {
          return (
            <Option key={e._id} value={e.name}>{e.name} </Option >
          )
        }
        )
      }
    }
    console.log(data)
  }, [loading])

  const { getFieldDecorator } = props.form
  return (
    <div>
      <Form onSubmit={handleSubmit} className='login-form'>
        <Form.Item label='Select' >
          {getFieldDecorator('dishes', {
            rules: [{ required: true, message: 'Please select your dish!' }]
          })(
            <Select mode='tags' placeholder='Please select a dish'>
              {RenderDishOption()}
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

const AddDishOnMenuForm = Form.create({ name: 'add_menu' })(AddDishOnMenu)
export default AddDishOnMenuForm