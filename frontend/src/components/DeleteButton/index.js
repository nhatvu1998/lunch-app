/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react'
import { Button, Icon, Modal } from 'antd'
import gql from 'graphql-tag'
const { confirm } = Modal

const ButtonGroup = Button.Group

const DELETE_SHOP = gql`
  mutation DeleteShop($id:String!) {
    deleteShop(id: $id) {
      name
    }
  }
`

const DeleteButton = (props) => {
  console.log(props)

  const showConfirm = () => {
    confirm({
      title: 'Do you want to delete these items?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk () {
        return new Promise((resolve, reject) => {
          props.deleteCell({ variables: { id: props.params.data._id } })
            .then(res => {
              props.refetch()
            })
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel () { }
    })
  }

  const editRow = useCallback(() => {
    props.setIsEditForm(true)
    setTimeout(() => {
      props.setVisible(true)
    }, 500)
  }, [])

  return (
    <div >
      <ButtonGroup>
        <Button type='primary' ghost onClick={editRow}>Edit</Button>
        <Button type='danger' ghost onClick={showConfirm}>Delete</Button>
      </ButtonGroup>
    </div>
  )
}

export default DeleteButton