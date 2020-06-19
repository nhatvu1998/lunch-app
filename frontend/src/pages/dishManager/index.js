/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { ERPGrid } from '@digihcs/grid'
import DeleteButton from '../../components/DeleteButton'
import gql from 'graphql-tag'
import AddDishModal from '../../util/modal/addDish/index'

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

const Dishes = (props) => {
  const [gridApi, setGridApi] = useState('')
  const [rowData, setRowdata] = useState([])
  const [visible, setVisible] = useState(false)

  const id = props.match.params.id
  const { loading, data } = useQuery(GET_DISHES, { variables: { id: id } }, { errorPolicy: 'all', fetchPolicy: 'network-only' })

  useEffect(() => {
    if (!loading) {
      if (data && data.shop) {
        setRowdata(data.shop.dishes.map(e => {
          return {
            ...e
          }
        }))
      }
    }
  }, [loading])

  const columnDefs = [
    { headerName: 'Name', field: 'name' },
    {
      headerName: 'Delete',
      cellRendererFramework: params => {
        return <DeleteButton setVisible={setVisible} />
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
      <ERPGrid
        gridName='exportExample'
        onGridReady={onGridReady}
        // frameworkComponents={frameworkComponents}
        headerDefs={headerDefs}
        columnDefs={columnDefs}
        rowData={rowData}
      />
      <AddDishModal visible={visible} setVisible={setVisible} gridApi={gridApi} id={id} />
    </div>
  )
}

export default Dishes