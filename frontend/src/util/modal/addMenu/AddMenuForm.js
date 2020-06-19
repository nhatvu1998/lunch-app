/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react'
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks'
import { Form, Icon, Input, Button, Select, notification } from 'antd'
import gql from 'graphql-tag'

const { Option } = Select

const ADD_MENU = gql`
  mutation CreateMenu($data:InputCreateMenu!) {
    createMenu(data: $data) {
      _id
      name
      isPublish
      siteId
      shopId
      dishes {
        name
        orderCount
      }
    }
  }
`

const GET_SHOP = gql`
query site($id: String!){
  site(id: $id) {
    shops {
      _id
      name
    }
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

const AddMenu = (props) => {
  const { loading, data } = useQuery(GET_ALL_SITE, { errorPolicy: 'all', fetchPolicy: 'network-only' })
  const [getShop, { loading: loadingShop, data: shopData }] = useLazyQuery(GET_SHOP, { errorPolicy: 'all', fetchPolicy: 'network-only' })
  const [getDishes, { loading: loadingDish, data: dishData }] = useLazyQuery(GET_DISHES, { errorPolicy: 'all', fetchPolicy: 'network-only' })

  console.log(props)
  const [addMenu] = useMutation(ADD_MENU)

  const handleSiteSelect = useCallback((e) => {
    console.log(e.key)
    getShop({ variables: { id: e.key } })
  }, [getShop])

  const handleShopSelect = useCallback((e) => {
    console.log(e.key)
    getDishes({ variables: { id: e.key } })
  }, [getDishes])

  // const onDishesChange = useCallback((x, e) => {
  //   console.log(x)
  //   console.log(e)
  // }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    console.log('ok')
    props.form.validateFields((err, values) => {
      if (!err) {
        let data = values
        console.log('Received values of form: ', values)
        data.dishes = data.dishes.map(e => {
          return {
            name: e,
            orderCount: 0,
            count: 10
          }
        })
        addMenu({ variables: { data } })
          .then(res => {
            openNotification(1)
            props.setVisible(false)
            props.gridApi.updateRowData({ add: [data] })
          })
          .catch(err => {
            openNotification(0)
            console.log(err)
          })
      }
    })
  }, [])

  const RenderSiteOption = useCallback(() => {
    if (!loading) {
      if (data && data.sites) {
        return data.sites.map(e => {
          return (
            <Option key={e._id} value={e._id} onClick={e => handleSiteSelect(e)}>{e.name}</Option >
          )
        }
        )
      }
    }
    console.log(data)
  }, [loading])

  const RenderShopOption = useCallback(() => {
    if (!loadingShop) {
      if (shopData && shopData.site.shops) {
        return shopData.site.shops.map(e => {
          return (
            <Option key={e._id} value={e._id} onClick={e => handleShopSelect(e)}>{e.name}</Option >
          )
        }
        )
      }
    }
    console.log(shopData)
  }, [loadingShop])

  const RenderDishOption = useCallback(() => {
    if (!loadingDish) {
      if (dishData && dishData.shop.dishes) {
        return dishData.shop.dishes.map(e => {
          return (
            <Option key={e._id} value={e.name}>{e.name} </Option >
          )
        }
        )
      }
    }
    console.log(dishData)
  }, [loadingDish])

  const { getFieldDecorator } = props.form
  return (
    <div>
      <Form onSubmit={handleSubmit} className='login-form'>
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your menu name!' }]
          })(
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='menu name'
            />
          )}
        </Form.Item>

        <Form.Item label='Select' >
          {getFieldDecorator('siteId', {
            rules: [{ required: true, message: 'Please select your site!' }]
          })(
            <Select placeholder='Please select a site'>
              {RenderSiteOption()}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Select' >
          {getFieldDecorator('shopId', {
            rules: [{ required: true, message: 'Please select your shop!' }]
          })(
            <Select placeholder='Please select a shop'>
              {RenderShopOption()}
            </Select>
          )}
        </Form.Item>

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

const AddMenuForm = Form.create({ name: 'add_menu' })(AddMenu)
export default AddMenuForm