/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Form, Icon, Input, Button, Select, notification, Radio } from 'antd'
import gql from 'graphql-tag'
import openNotification from '../../../components/Notification/Notification'

const { Option } = Select

const ADD_NOTE = gql`
  mutation AddNote($input:String!) {
    addNote(input: $input) {
      _id
      note
    }
  }
`

const AddNote = (props) => {
  useEffect(() => {
    props.form.validateFields()
  }, [])
  console.log(props)

  const [addNote] = useMutation(ADD_NOTE)

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    console.log('ok')
    props.form.validateFields((err, data) => {
      if (!err) {
        console.log('Received values of form: ', data)
        const input = data.name + ' (' + data.option + ')'
        console.log(input)
        addNote({ variables: { input } })
          .then(res => {
            openNotification('success', 'Success', 'Thêm shop thành công')
            props.setVisible(false)
            props.refetchOrder()
            props.refetch()
            props.gridApi.redrawRows()
          })
          .catch(err => {
            console.log(err)
            // const errors = err.graphQLErrors.map(error => error.message)
            // openNotification('error', 'failed', errors[0])
          })
      }
    })
  }, [])

  const { getFieldDecorator } = props.form
  return (
    <div>
      <Form onSubmit={handleSubmit} className='login-form'>
        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your note!' }]
          })(
            <Input
              type='text'
              placeholder='Input note'
            />
          )}
        </Form.Item>

        <Form.Item label='Select' >
          {getFieldDecorator('option', {
            rules: [{ required: true, message: 'Please select your site!' }]
          })(
            <Radio.Group name='radioGroup' >
              <Radio value='Cơm thêm'>
                Cơm thêm
              </Radio>
              <Radio value='Không cơm' >
                Không cơm
              </Radio>
            </Radio.Group>
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

const AddNoteForm = Form.create({ name: 'add_note' })(AddNote)
export default AddNoteForm