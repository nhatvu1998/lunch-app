/* eslint-disable react/display-name */
import React, { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks'
import { ERPGrid } from '@digihcs/grid'
import gql from 'graphql-tag'
import { Icon, Modal, Input, Select } from 'antd'
import { Button, DynamicPage } from '@digihcs/innos-ui3'
import openNotification from '../../components/Notification/Notification'
import * as XLSX from 'xlsx'
const { Option } = Select
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

const GET_ORDER_BY_MENU_ID = gql`
  query findOrderByMenuId($menuId: String!){
    findOrderByMenuId(menuId: $menuId) {  
      _id
      user{
        _id
        username
      }
      menuId
      dishId
      count
      note
      isConfirmed
    }
  }
`

const LOCK_MENU = gql`
  mutation LockMenu($siteId: String!){
    lockMenu(siteId: $siteId) {
      name
      isLocked
    }
  }
`
const CREATE_ORDER_BY_ADMIN = gql`
  mutation createOrderByAdmin($input: InputCreateOrderByAdmin!) {
    createOrderByAdmin(input: $input){
      menuId
      dishId
    }
  }
`
const DELETE_ORDER_BY_ADMIN = gql`
  mutation deleteOrderByAdmin($dishId: String!, $userId: String!) {
    deleteOrderByAdmin(dishId: $dishId, userId: $userId)
  }
`

const GET_ALL_USER = gql`
  query {
    getAllUsers {
      _id
      username
      password
      role
    }
}
`

const Report = (props) => {
  const [gridApi, setGridApi] = useState('')
  const [visible, setVisible] = useState(false)
  const [rowData, setRowdata] = useState([])
  const [params, setParams] = useState()

  const [userSelect, setUserSelect] = useState(null)

  const { loading, data, refetch } = useQuery(GET_PUBLISH_MENU_BY_SITE_ID, { variables: { siteId: props.site } }, { errorPolicy: 'all', fetchPolicy: 'network-only' })
  const { loading: loadingUser, data: users, refetch: refetchUser } = useQuery(GET_ALL_USER, { errorPolicy: 'all', fetchPolicy: 'network-only' })
  const [getOrders, { loading: loadingOrder, data: orders, refetch: refetchOrder }] = useLazyQuery(GET_ORDER_BY_MENU_ID, { errorPolicy: 'all', fetchPolicy: 'network-only' })

  const [lockMenu] = useMutation(LOCK_MENU)
  const [createOrderByAdmin] = useMutation(CREATE_ORDER_BY_ADMIN)
  const [deleteOrderByAdmin] = useMutation(DELETE_ORDER_BY_ADMIN)

  useEffect(() => {
    if (!loading) {
      if (data && data.findPublishMenu) {
        if (data.findPublishMenu.length !== 0) {
          getOrders({ variables: { menuId: data.findPublishMenu[0]._id } })
          setRowdata(data.findPublishMenu[0].dishes.map(e => {
            return {
              ...e
            }
          }))
        } else {
          setRowdata([])
        }
      }
    }
  }, [data, loading, props.site])

  useEffect(() => {
    if (!loadingOrder) {
      if (orders && orders.findOrderByMenuId) {
        setRowdata(rowData.map(e => {
          const orderRecords = []
          orders.findOrderByMenuId.map(order => {
            order.fullName = order.user.username
            if (order.dishId === e._id) {
              orderRecords.push(order)
            }
          })
          console.log(e)
          return {
            ...e,
            orderRecords
          }
        }))
      }
    }
  }, [loadingOrder, props.site, orders])

  console.log(orders)
  refetch({ variables: { siteId: props.site } })

  const handlePlusButton = (param) => {
    setParams(param.data)
    setVisible(true)
  }

  const handleOk = useCallback(() => {
    const userId = userSelect
    const menuId = data.findPublishMenu[0]._id
    const dishId = params._id
    createOrderByAdmin({
      variables: {
        input: {
          menuId,
          userId,
          dishId
        }
      }
    }).then(res => {
      console.log(res)
      refetchOrder()
      setVisible(false)
    })
  }, [userSelect, data])

  console.log(params)

  const handleMinusButton = useCallback((param) => {
    console.log(param)
    console.log(param.data.user._id)
    confirm({
      title: 'Do you want to delete these items?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      onOk () {
        return new Promise((resolve, reject) => {
          deleteOrderByAdmin({ variables: { dishId: param.data.dishId, userId: param.data.user._id } })
            .then(res => {
              console.log(res)
              console.log('ok')
            })
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel () { }
    })
  }, [])

  const columnDefs = [
    {
      headerName: 'Món ăn',
      field: 'name',
      cellRenderer: 'agGroupCellRenderer'
    },
    {
      headerName: 'Đã đặt',
      field: 'orderCount'
    },
    {
      headerName: 'Tổng số',
      field: 'count'
    },
    {
      headerName: 'Action',
      cellRendererFramework: params => {
        return (
          <Button
            style={{ marginLeft: '1em' }}
            name='plus'
            onClick={() => {
              setVisible(true)
              handlePlusButton(params)
            }}
          >
            <Icon type='plus' />
          </Button>
        )
      }
    }
  ]

  const detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        {
          headerName: 'Full Name',
          field: 'fullName'
        },
        {
          headerName: 'Ordered',
          field: 'count'
        },
        {
          headerName: 'Note',
          field: 'note'
        },
        {
          headerName: 'Confirm',
          field: 'isConfirmed',
          cellRendererFramework: cell => cell.value
            ? (
              <Icon type='check-circle' theme='twoTone' twoToneColor='#52c41a' />
            ) : (
              <Icon type='close-circle' theme='twoTone' twoToneColor='#ff4d4f' />
            )
        },
        {
          headerName: 'Action',
          cellRendererFramework: params => {
            return (
              <Button
                style={{ marginLeft: '1em' }}
                name='minus'
                onClick={() => handleMinusButton(params)}
              >
                <Icon type='minus' />
              </Button>
            )
          }
        }
      ],
      defaultColDef: {
        editable: true,
        resizable: true
      },
      onFirstDataRendered: function (params) {
        params.api.sizeColumnsToFit()
      }
    },
    getDetailRowData: function (params) {
      params.successCallback(params.data.orderRecords)
    }
  }

  const onGridReady = params => {
    params.api.sizeColumnsToFit()
    setGridApi(params.api)
  }

  const buttonChangeStatus = () => {
    if (!loading) {
      if (!data.findPublishMenu[0]) {
        return <div>Loading</div>
      }
      return (data.findPublishMenu[0].isLocked ? <div>UnLock</div> : <div>Lock</div>)
    }
  }
  console.log(rowData)
  const lockedMenu = () => {
    lockMenu({ variables: { siteId: props.site } })
      .then(res => {
        console.log(res)
        openNotification('success', 'Success', data.findPublishMenu[0].isLocked ? 'Unlock success' : 'Lock success')
        refetch()
      })
      .catch(err => {
        const errors = err.graphQLErrors.map(error => error.message)
        openNotification('error', 'failed', errors[0])
      })
  }

  const exportFile = () => {
    // const params = {
    //   columnWidth: 100,
    //   columnGroups: true,
    //   sheetName: 'export',
    //   fileName: 'ds order',
    //   allColumns: true,
    //   customHeader: [
    //     [],
    //     [{ styleId: 'bigHeader', data: { type: 'String', value: 'content appended with customHeader' }, mergeAcross: 3 }],
    //     [{ data: { type: 'String', value: 'Numeric value' }, mergeAcross: 2 }, { data: { type: 'Number', value: '3695.36' } }],
    //     []
    //   ],
    //   customFooter: [
    //     [],
    //     [{ styleId: 'bigHeader', data: { type: 'String', value: 'content appended with customFooter' } }]
    //   ]
    // }

    // gridApi.exportDataAsExcel(params)

    const menu = data.findPublishMenu[0].dishes
    const dataExport = []
    let totalOrder = 0
    rowData.map(item => {
      totalOrder += parseInt(item.orderCount)
      dataExport.push([item.name, '', '', '', '', item.orderCount])
      item.orderRecords.map(del => dataExport.push(['', del.fullName || 'no name', '', '', '', del.count, '', del.note]))
      dataExport.push([])
      return item
    })

    dataExport.unshift(['Tên món ăn', '', '', '', '', 'Số lượng', '', 'Ghi chú'])
    dataExport.unshift([])
    dataExport.unshift([menu.name])

    dataExport.push(['', '', '', 'Tổng', '', totalOrder])
    dataExport.push(['', '', '', 'Ngày gửi :', new Date()])
    dataExport.push(['', '', '', 'Người gửi :'])

    /* make the worksheet */
    const ws = XLSX.utils.json_to_sheet(dataExport, {
      dateNF: 'HH:mm:ss DD-MM-YYYY'
    })

    const merge = [
      {
        s: { r: 0, c: 0 },
        e: { r: 0, c: 8 }
      }
    ]

    ws['!merges'] = merge
    ws.A1 = ''
    /* add to workbook */
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    /* generate an XLSX file */
    XLSX.writeFile(wb, `${menu.name}.xlsx`, {
      bookType: 'xlsx',
      cellStyles: true
    })
  }

  const RenderUserList = () => {
    if (!loadingUser) {
      if (users && users.getAllUsers) {
        return users.getAllUsers.map(e => {
          return (
            <Option key={e._id} value={e.username} onClick={() => setUserSelect(e._id)}>{e.username}</Option >
          )
        }
        )
      }
    }
  }

  return (
    <div
      className='ag-theme-balham'
      style={{
        height: '100vh'
      }}
    >
      <DynamicPage floorplans='none' paddingContent>
        <DynamicPage.HeaderTitle
          title='Báo cáo'
          actions={[
            <Button
              key='1'
              className='lock-menu report-action-btn'
              name='lockAndUnlock'
              onClick={() => lockedMenu()}
            >{buttonChangeStatus()}</Button>,
            <Button
              key='2'
              className='complete-menu report-action-btn'
              name='complete'
            // onClick={showProps}
            >Close menu</Button>,
            <Button
              key='3'
              className='request-menu'
              onClick={() => exportFile()}
            >Export file</Button>
          ]}
        />
        <ERPGrid
          gridName='exportExample'
          columnDefs={columnDefs}
          detailCellRendererParams={detailCellRendererParams}
          rowData={rowData}
          onGridReady={onGridReady}
        />
        <Modal
          title='Order'
          visible={visible}
          onOk={() => handleOk(params)}
          onCancel={() => setVisible(false)}
        >
          <Select defaultValue='Select user'>
            {RenderUserList()}
          </Select>
        </Modal>
      </DynamicPage>
    </div>
  )
}

export default Report