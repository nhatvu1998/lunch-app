/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ERPGrid } from '@digihcs/grid'
import { Redirect } from 'react-router-dom'
import { DynamicPage } from '@digihcs/innos-ui3'
import DeleteButton from '../../components/DeleteButton'
import gql from 'graphql-tag'
import AddMenuModal from '../../util/modal/addMenu'
import { Button, Icon } from 'antd'

const GET_MENU = gql`
query {
  menu {
    _id
    name
    siteId
    shopId
    isPublish
    dishes{
      name
    }
  }
}
`
const GET_MENU_BY_SITE_ID = gql`
  query FindMenuBySiteId($siteId: String!){
    findMenuBySiteId(siteId: $siteId) {
        _id
    name
    siteId
    shopId
    isPublish
    dishes{
      name
    }
    }
  }
`

const DELETE_SHOP = gql`
  mutation DeleteShop($id:String!) {
    deleteShop(id: $id) {
      name
    }
  }
`

const EDIT_SHOP = gql`
  mutation EditShop($name: String!, $newName: String!) {
    editShop(name: $name, newName: $newName){
      name
    }
  }
`

const Menu = (props) => {
  const [gridApi, setGridApi] = useState('')
  const [rowData, setRowdata] = useState([])
  const [visible, setVisible] = useState(false)
  const [isEditForm, setIsEditForm] = useState(false)
  const { loading, data, refetch } = useQuery(GET_MENU_BY_SITE_ID, { variables: { siteId: props.site } }, { errorPolicy: 'all', fetchPolicy: 'network-only' })

  const [deleteCell] = useMutation(DELETE_SHOP)
  useEffect(() => {
    if (!loading) {
      if (data && data.findMenuBySiteId) {
        setRowdata(data.findMenuBySiteId.map(e => {
          return {
            ...e
          }
        }))
      }
    }
  }, [loading, props.site])

  refetch({ variables: { siteId: props.site } })
  const columnDefs = [
    {
      headerName: 'Name',
      field: 'name'
    },
    {
      headerName: 'Publish',
      field: 'isPublish',
      // eslint-disable-next-line react/display-name
      cellRendererFramework: cell => cell.value
        ? (
          <Icon type='check-circle' theme='twoTone' twoToneColor='#52c41a' />
        ) : (
          <Icon type='close-circle' theme='twoTone' twoToneColor='#ff4d4f' />
        )
    },
    {
      headerName: 'Delete',
      // eslint-disable-next-line react/display-name
      cellRendererFramework: params => {
        return <DeleteButton deleteCell={deleteCell} params={params} setIsEditForm={setIsEditForm} setVisible={setVisible} />
      }
    },
    {
      headerName: 'Detail',
      // eslint-disable-next-line react/display-name
      cellRendererFramework: params => {
        return <Button type='primary' onClick={() => handleMenuDetail(params)}>xem</Button>
      }
    }
  ]

  const headerDefs = [
    {
      key: 'add',
      icon: 'Plus',
      type: 'default',
      onClick: () => {
        setVisible(true)
      },
      tooltip: 'Add'
    }
  ]

  const handleMenuDetail = e => {
    props.history.push(`/menu/${e.data._id}/${e.data.shopId}`)
  }

  const onGridReady = params => {
    params.api.sizeColumnsToFit()
    setGridApi(params.api)
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
          title='Menu Manage'
        />
        <ERPGrid
          gridName='exportExample'
          headerDefs={headerDefs}
          columnDefs={columnDefs}
          rowData={rowData}
          onGridReady={onGridReady}
        />
        {
          useMemo(() => (
            <AddMenuModal visible={visible} setVisible={setVisible} gridApi={gridApi} isEditForm={isEditForm} setIsEditForm={setIsEditForm} />
          ), [visible])
        }
      </DynamicPage>
    </div>
  )
}

export default Menu