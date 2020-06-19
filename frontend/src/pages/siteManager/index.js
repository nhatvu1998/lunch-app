import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { ERPGrid } from '@digihcs/grid'
import DeleteButton from '../../components/DeleteButton'
import { DynamicPage } from '@digihcs/innos-ui3'
import gql from 'graphql-tag'
import AddSiteModal from '../../util/modal/addSite'

const GET_SITE = gql`
query {
  sites {
    _id
    name
  }
}
`

const Sites = () => {
  const [gridApi, setGridApi] = useState('')
  const [rowData, setRowdata] = useState([])
  const [visible, setVisible] = useState(false)
  const { loading, error, data, refetch } = useQuery(GET_SITE, { errorPolicy: 'all', fetchPolicy: 'network-only' })

  useEffect(() => {
    if (!loading) {
      if (data && data.sites) {
        setRowdata(data.sites.map(e => {
          return {
            ...e
          }
        }))
      }
    }
  }, [loading])

  console.log(rowData)
  console.log('ok')
  const columnDefs = [
    { headerName: "Name", field: "name" },
    { headerName: "Delete", cellRenderer: "DeleteButton" },
  ]

  const frameworkComponents = {
    DeleteButton
  }

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
    },
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
          title='Site Manage'
        />
        <ERPGrid
          gridName='exportExample'
          onGridReady={onGridReady}
          frameworkComponents={frameworkComponents}
          headerDefs={headerDefs}
          columnDefs={columnDefs}
          rowData={rowData}

        />
        <AddSiteModal visible={visible} setVisible={setVisible} gridApi={gridApi} refetch={refetch} />
      </DynamicPage>
    </div>
  )
}

export default Sites