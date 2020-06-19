/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Form, Icon, Input, Button, notification } from 'antd'
import gql from 'graphql-tag'

const ADD_DISH = gql`
  mutation AddDish($dish:DishInput!) {
    addDish(dish: $dish) {
      name
    }
  }
`

const openNotification = (e) => {
  if (e === 1) {
    notification.success({
      message: 'Thêm món ăn thành công',
      style: {
        width: 600,
        marginLeft: 335 - 600
      },
      placement: 'bottomRight',
      duration: 2
    })
  } else {
    notification.error({
      message: 'Thêm món ăn thất bại',
      style: {
        width: 600,
        marginLeft: 335 - 600
      },
      placement: 'bottomRight',
      duration: 2
    })
  }
}

let id = 0

const DynamicFieldSet = (props) => {
  const { form } = props
  const remove = k => {
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 1) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    })
  }

  const add = () => {
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat(id++)
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    })
  }

  const [addDish] = useMutation(ADD_DISH)

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values.names);
        values.names.map(e => {
          console.log(e)
          const dish = { name: e, shopId: props.id }
          addDish({ variables: { dish } })
            .then(res => {
              openNotification(1)
              console.log(res)
              props.setVisible(false)
              props.gridApi.updateRowData({ add: [dish] })
            })
            .catch(err => {
              openNotification(0)
              console.log(err)
            })
        })
      }
    })
  }, [])

  const { getFieldDecorator, getFieldValue } = props.form
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  }
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 }
    }
  }
  getFieldDecorator('keys', { initialValue: [] })
  const keys = getFieldValue('keys')
  const formItems = keys.map((k, index) => (
    <Form.Item
      {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
      label={index === 0 ? 'Dishes' : ''}
      required={false}
      key={k}
    >
      {getFieldDecorator(`names[${k}]`, {
        validateTrigger: ['onChange', 'onBlur'],
        rules: [
          {
            required: true,
            whitespace: true,
            message: "Please input dish's name or delete this field."
          }
        ]
      })(<Input placeholder='dish name' style={{ width: '60%', marginRight: 8 }} />)}
      {keys.length > 1 ? (
        <Icon
          className='dynamic-delete-button'
          type='minus-circle-o'
          onClick={() => remove(k)}
        />
      ) : null}
    </Form.Item>
  ))
  return (
    <Form onSubmit={handleSubmit}>
      {formItems}
      <Form.Item {...formItemLayoutWithOutLabel}>
        <Button type='dashed' onClick={() => add()} style={{ width: '60%' }}>
          <Icon type='plus' /> Add field
        </Button>
      </Form.Item>
      <Form.Item {...formItemLayoutWithOutLabel}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

const AddDishForm = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet)

export default AddDishForm