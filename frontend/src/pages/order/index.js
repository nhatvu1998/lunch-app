/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks'
import { ERPGrid } from '@digihcs/grid'
import gql from 'graphql-tag'
import { Icon, DynamicPage, Input, Radio, Button } from '@digihcs/innos-ui3'
import { Modal } from 'antd'
import AddNoteModal from '../../util/modal/addNote'
import openNotification from '../../components/Notification/Notification'
const { confirm } = Modal

const GET_PUBLISH_MENU_BY_SITE_ID = gql`
  query findPublishMenu($siteId: String!){
    findPublishMenu(siteId: $siteId) {
      _id
      name
      isLocked
      dishes{
        _id
        name
        orderCount
        count
      }
    }
  }
`

const CONFIRM_EAT = gql`
  mutation confirmEat{
    confirmEat {
      menuId
    }
  }
`

const CREATE_ORDER = gql`
  mutation createOrder($input: InputCreateOrder!) {
    createOrder(input: $input){
      menuId
      dishId
    }
  }
`

const DELETE_ORDER = gql`
  mutation deleteOrder($dishId: String!) {
    deleteOrder(dishId: $dishId)
  }
`

const FIND_BY_USER_ID = gql`
  query {
    findOrderByUserId{
      _id
      user{
        _id
        username
      }
      menuId
      dishId
      count
      isConfirmed
      note
    }
  }
`

const Order = (props) => {
  const [gridApi, setGridApi] = useState('')
  const [rowData, setRowdata] = useState([])
  const [visible, setVisible] = useState(false)
  const { loading, data, refetch } = useQuery(GET_PUBLISH_MENU_BY_SITE_ID, { variables: { siteId: props.site } }, { errorPolicy: 'all', fetchPolicy: 'network-only' })
  const { loading: loadingOrders, data: orders, refetch: refetchOrder } = useQuery(FIND_BY_USER_ID)
  const [createOrder] = useMutation(CREATE_ORDER)
  const [deleteOrder] = useMutation(DELETE_ORDER)
  const [confirmEat] = useMutation(CONFIRM_EAT)

  useEffect(() => {
    if (!loading && !loadingOrders) {
      if (data && data.findPublishMenu) {
        console.log(orders)
        if (data.findPublishMenu.length !== 0) {
          setRowdata(data.findPublishMenu[0].dishes.map(e => {
            return {
              ...e,
              isLocked: data.findPublishMenu[0].isLocked,
              orderedCount: (orders) ? ((orders.findOrderByUserId.dishId === e._id) ? orders.findOrderByUserId.count : 0) : 0,
              menuId: data.findPublishMenu[0]._id,
              note: (orders) ? ((orders.findOrderByUserId.dishId === e._id) ? orders.findOrderByUserId.note : '') : ''
            }
          }))
        } else {
          setRowdata([])
        }
      }
    }
  }, [loading, props.site, data, orders, loadingOrders])

  refetch({ variables: { siteId: props.site } })

  const handlePlus = useCallback((params) => {
    console.log(params)
    createOrder({
      variables: {
        input: {
          menuId: params.menuId,
          dishId: params._id
        }
      }
    }).then(res => {
      console.log(res)
      refetchOrder()
      refetch()
      openNotification('success', 'Success', 'Success')
    }).catch(err => {
      const errors = err.graphQLErrors.map(error => error.message)
      openNotification('error', 'failed', errors[0])
    })
  }, [])

  console.log(orders)
  console.log(data)

  const handleMinus = useCallback((params) => {
    console.log(params)
    refetchOrder()
    refetch()
    deleteOrder({
      variables: {
        dishId: params._id
      }
    }).then(res => {
      openNotification('success', 'Success', 'Success')
    }).catch(err => {
      const errors = err.graphQLErrors.map(error => error.message)
      openNotification('error', 'failed', errors[0])
    })
  }, [])

  const handleNote = useCallback((params) => {
    setVisible(true)
  }, [visible])

  const columnDefs = [
    {
      headerName: 'Dish',
      field: 'name'
    },
    {
      headerName: 'Ordered',
      field: 'orderedCount'
    },
    {
      headerName: 'Note',
      field: 'note'
    },
    {
      headerName: 'Total',
      cellRendererFramework: params => {
        console.log(params)
        return (
          <div>{params.data.orderCount + '/' + params.data.count}</div>
        )
      }
    },
    {
      headerName: 'Action',
      cellRendererFramework: params => {
        return (
          <>
            {params.data.isLocked ? (
              <span>System has locked</span>
            ) : (
              <div style={{ display: 'flex', width: '3rem' }}>
                <Button
                  className='ordert-action-btn'
                  name='minus'
                  onClick={() => handleMinus(params.data)}
                  disabled={params.data.orderedCount < 1}
                >
                  <Icon type='minus' />
                </Button>
                <Button
                  className='ordert-action-btn'
                  style={{ marginLeft: '1em' }}
                  name='plus'
                  onClick={() => handlePlus(params.data)}
                  disabled={params.data.orderedCount === 1}
                >
                  <Icon type='plus' />
                </Button>
                <Button
                  className='ordert-action-btn'
                  style={{ marginLeft: '1em' }}
                  name='file'
                  onClick={() => handleNote(params.data)}
                  disabled={params.data.orderedCount < 1}
                >
                  <Icon type='file' />
                </Button>
              </div>
            )}
          </>
        )
      }
    }
  ]

  const onGridReady = params => {
    params.api.sizeColumnsToFit()
    setGridApi(params.api)
  }

  const timer = new Date().getHours()

  const handleConfirm = () => {
    confirmEat()
      .then(res => {
        console.log(res)
        refetchOrder()
      })
  }

  return (
    <div
      className='ag-theme-balham'
      style={{
        height: '100vh'
      }}
    >
      {timer <= 12 || timer >= 14 ? (
        <DynamicPage floorplans='none' paddingContent>
          <DynamicPage.HeaderTitle
            title='Đặt cơm'
          />
          <ERPGrid
            gridName='exportExample'
            columnDefs={columnDefs}
            rowData={rowData}
            onGridReady={onGridReady}
            getRowStyle={(params) => {
              const ordered = params.data.orderedCount
              if (ordered > 0) {
                return {
                  backgroundColor: 'gainsboro',
                  fontWeight: 'bold'
                }
              }
              return null
            }
            }
          />
          {/* {
            useMemo(() => ( */}
          <AddNoteModal {...props} visible={visible} setVisible={setVisible} gridApi={gridApi} refetchOrder={refetchOrder} refetch={refetch} />
          {/* ), [visible]) */}
          {/* } */}
        </DynamicPage>) : (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {!loadingOrders && orders ? (
            <div>
              <span style={{
                display: 'flex',
                justifyContent: 'center',
                color: '#000',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}
              >
                {'You have ordered'}
              </span>
              <Button
                loading={loadingOrders}
                disabled={orders.findOrderByUserId.isConfirmed}
                onClick={() => handleConfirm()}
                style={{
                  margin: 'auto'
                }}
              >
                {!orders.findOrderByUserId.isConfirmed
                  ? 'Confirm'
                  : 'Confirmed'
                }
              </Button>
            </div>
          ) : (
            <h1 style={{ color: '#000', fontSize: 20 }}>
                  System has locked
            </h1>
          )}
        </div>
      )}
    </div>
  )
}

export default Order
