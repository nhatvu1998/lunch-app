/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable object-property-newline */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ERPGrid } from '@digihcs/grid'
import DeleteButton from '../../components/DeleteButton'
import gql from 'graphql-tag'
import { DynamicPage } from '@digihcs/innos-ui3'
import AddDishOnMenuModal from '../../util/modal/addDishOnMenu'
import * as XLSX from 'xlsx'
import { InputNumber, Button } from 'antd'

// const ADD_DISH = gql`
// mutation AddDish($dish: DishInput!) {
//   addDish(dish: $dish) {
//     _id
//     name
//   }
// }
// `
const PUBLISH_MENU = gql`
  mutation PublishMenu($id:String!){
    publishMenu(id : $id){
      name
    }
  }
`

const GET_MENU_DETAIL = gql`
query FindById($id: String!){
  findById(id: $id) {
    isPublish
    dishes {
      _id
      name
      orderCount
      count
    }
  }
}
`
const IMPORT_MENU = gql`
    mutation($_id: String!,$shopId: String!, $fileInput: [FileInput]! ){
    importMenu(_id: $_id, shopId: $shopId, fileInput: $fileInput)
  }
`

const MenuDetail = (props) => {
  const [gridApi, setGridApi] = useState('')
  const [rowData, setRowdata] = useState([])
  const [visible, setVisible] = useState(false)

  const id = props.match.params.id
  const shopId = props.match.params.shopId
  console.log(id)
  console.log(shopId)
  const { loading, data, refetch } = useQuery(GET_MENU_DETAIL, { variables: { id: id } }, { errorPolicy: 'all', fetchPolicy: 'network-only' })
  const [importFile] = useMutation(IMPORT_MENU)
  const [publishMenu] = useMutation(PUBLISH_MENU)

  console.log(data)
  useEffect(() => {
    if (!loading) {
      if (data && data.findById) {
        setRowdata(data.findById.dishes.map(e => {
          return {
            ...e
          }
        }))
      }
    }
  }, [loading])

  console.log(rowData)
  console.log(data)

  const columnDefs = [
    { headerName: 'Name', field: 'name' },
    {
      headerName: 'Delete', cellRendererFramework: params => {
        return <DeleteButton params={params} setVisible={setVisible} />
      }
    },
    {
      headerName: 'Count', cellRendererFramework: params => {
        return <InputNumber min={1} max={20} defaultValue={params.data.count} onChange={() => handleChange(params)} />
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
    },
    {
      key: 'file',
      icon: 'File',
      type: 'file',
      downloadText: 'Download',
      onDownload: () => console.log('file sent'),
      browseFileText: <span>Browse</span>,
      onBrowseFile: event => importMenu(event),
      onClear: files => console.log('Cleared', files),
      tooltip: 'File',
      hide: shopId === ''

    }
  ]

  const onGridReady = params => {
    params.api.sizeColumnsToFit()
    setGridApi(params.api)
  }

  const handleChange = (e) => {
    console.log(e)
  }

  const importMenu = (event) => {
    const oFile = event.target.files[0]
    const reader = new FileReader()
    reader.onload = e => {
      const dataE = e.target.result
      const readData = XLSX.read(dataE, { type: 'binary' })
      const dataName = readData.SheetNames[0]
      const data = readData.Sheets[dataName]
      const dataImport = XLSX.utils.sheet_to_json(data, { header: 2 })
      console.log('1', dataImport)
      importFile({
        variables: {
          _id: id,
          shopId: shopId,
          fileInput: dataImport
        }
      }).then(() => {
        refetch()
        // refetchDish()
      })
    }
    reader.readAsBinaryString(oFile)
  }

  const publicMenu = () => {
    publishMenu({ variables: { id: id } })
      .then(res => {
        console.log(res)
        refetch()
      })
  }

  const buttonChangeStatus = () => {
    if (!loading) {
      if (!data.findById) {
        return <div>Loading</div>
      }
      return (data.findById.isPublish ? <div>Hủy công khai</div> : <div>Công khai</div>)
    }
  }

  const saveMenu = () => {

  }

  return (
    <div
      className='ag-theme-balham'
      style={{
        height: '70vh'
      }}
    >
      <DynamicPage floorplans='none' paddingContent>
        <DynamicPage.HeaderTitle
          title='Menu Detail'
          actions={[
            <Button key='1' onClick={() => publicMenu()}>{buttonChangeStatus()}</Button>,
            <Button key='2' onClick={() => saveMenu()}>Save</Button>
          ]}
        />
        <ERPGrid
          gridName='exportExample'
          onGridReady={onGridReady}
          // frameworkComponents={frameworkComponents}
          headerDefs={headerDefs}
          columnDefs={columnDefs}
          rowData={rowData}
        />
        <AddDishOnMenuModal visible={visible} setVisible={setVisible} gridApi={gridApi} id={id} shopId={shopId} refetch={refetch} />
      </DynamicPage>
    </div>
  )
}

export default MenuDetail