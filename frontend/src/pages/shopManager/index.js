/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ERPGrid } from '@digihcs/grid'
// import { Redirect } from 'react-router-dom'
import DeleteButton from '../../components/DeleteButton'
import { DynamicPage } from '@digihcs/innos-ui3'
import { Button } from 'antd'
import gql from 'graphql-tag'
import AddShopModal from '../../util/modal/addShop'

const GET_ALL_SHOP = gql`
query {
  shops {
    _id
    name
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

const DELETE_SHOP = gql`
  mutation DeleteShop($id:String!) {
    deleteShop(id: $id) {
      name
    }
  }
`

const EDIT_SHOP = gql`
  mutation EditShop($id: String!, $newName: String!) {
    editShop(id: $id, newName: $newName){
      name
    }
  }
`

const Shops = (props) => {
  console.log(props)
  const [gridApi, setGridApi] = useState('')
  const [rowData, setRowdata] = useState([])
  const [visible, setVisible] = useState(false)
  const [isEditForm, setIsEditForm] = useState(false)
  const { loading, data, refetch } = useQuery(GET_SHOP, { variables: { id: props.site } }, { errorPolicy: 'all', fetchPolicy: 'network-only' })
  console.log(data)
  const [deleteCell] = useMutation(DELETE_SHOP)
  // useEffect(() => {
  //   if (!loading) {
  //     if (data && data.shops) {
  //       setRowdata(data.shops.map(e => {
  //         return {
  //           ...e
  //         }
  //       }))
  //     }
  //   }
  // }, [data, loading])

  useEffect(() => {
    if (!loading) {
      if (data && data.site.shops) {
        setRowdata(data.site.shops.map(e => {
          return {
            ...e
          }
        }))
      }
    }
    console.log(data)
  }, [loading, data])

  const columnDefs = [
    {
      headerName: 'Name',
      field: 'name'
    },
    {
      headerName: 'Delete',
      // cellRenderer: 'DeleteButton'
      cellRendererFramework: params => {
        return <DeleteButton deleteCell={deleteCell} params={params} setIsEditForm={setIsEditForm} setVisible={setVisible} refetch={refetch}/>
      }
    },
    {
      headerName: 'Detail',
      // eslint-disable-next-line react/display-name
      cellRendererFramework: params => {
        return <Button type='primary' onClick={() => handleShopDetail(params)}>xem</Button>
      }
    }
  ]

  const headerDefs = [
    {
      key: 'add',
      icon: 'Plus',
      type: 'default',
      onClick: () => {
        console.log('ok')
        setVisible(true)
      },
      tooltip: 'Add'
    }
  ]

  const handleShopDetail = (e) => {
    if (e.data) {
      props.history.push(`/shops/dishes/${e.data._id}`)
    }
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
          title='Manage Shop'
        />
        <ERPGrid
          gridName='exportExample'
          headerDefs={headerDefs}
          columnDefs={columnDefs}
          rowData={rowData}
          onGridReady={onGridReady}
        />
        <AddShopModal visible={visible} setVisible={setVisible} gridApi={gridApi} isEditForm={isEditForm} setIsEditForm={setIsEditForm} refetch={refetch}/>
      </DynamicPage>
    </div>
  )
}

export default Shops