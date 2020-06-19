import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ERPGrid } from '@digihcs/grid'
// import { Redirect } from 'react-router-dom'
import DeleteButton from '../../components/DeleteButton'
import { DynamicPage } from '@digihcs/innos-ui3'
import gql from 'graphql-tag'

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

const User = (props) => {
  const [gridApi, setGridApi] = useState('')
  const [rowData, setRowdata] = useState([])
  const { loading, data, refetch } = useQuery(GET_ALL_USER, { errorPolicy: 'all', fetchPolicy: 'network-only' })

  useEffect(() => {
    if (!loading) {
      if (data && data.getAllUsers) {
        setRowdata(data.getAllUsers.map(e => {
          return {
            ...e,
            name: e.username
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
      headerName: 'Status',
      field: 'status'
    },
    {
      headerName: 'Number Of Times Locked',
      field: 'ok'
    },
    {
      headerName: 'Action',
      field: 'action'
    }
  ]

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
          title='Manage User'
        />
        <ERPGrid
          gridName='exportExample'
          columnDefs={columnDefs}
          rowData={rowData}
          onGridReady={onGridReady}
        />
      </DynamicPage>
    </div>
  )
}

export default User
