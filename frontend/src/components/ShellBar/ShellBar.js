import React from 'react'
import { Button, Row, Col, Layout, Dropdown, Menu, Icon, Avatar, Select } from 'antd'
import styled from 'styled-components'
import ChangePasswordModal from '../../util/modal/changePassword/index'
import gql from 'graphql-tag'
import history from '../../history'
import { useQuery } from '@apollo/react-hooks'
const { Option } = Select

const GET_ALL_SITE = gql`
query {
  sites {
    _id
    name
  }
}
`

const Logo = styled.div`
  font-size: 40px;
  font-weight: bold;
  padding-left: 100px;
  color: #000;
`

const SelectButton = styled(Select)`
  text-align: center;
  width: 200px;
  align-item: center
`

const StyledDropdown = styled(Dropdown)`
  .ant-dropdown {
    margin-top: 30px;
  }
`

const NavBar = styled(Row)`
  background-color: #f5f5f5;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  margin-bottom: -1px
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 10px 20px 0 rgba(0, 0, 0, 0.05);
  background: white;
`

const UserAvatar = styled(Avatar)`
  text-align: right;
`

function Header (props) {
  const { loading, data } = useQuery(GET_ALL_SITE, { errorPolicy: 'all', fetchPolicy: 'network-only' })

  console.log(props)
  const logoutClick = () => {
    localStorage.removeItem('token')
    props.setIsAuthenticated(false)
  }

  const handleChange = (value) => {
    localStorage.setItem('currentsite', value._id)
    props.setSite(value._id)
    console.log(`selected ${value.name}`)
  }

  const handleBackClick = () => {
    props.history.goBack()
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <a href='/login'>
          <Button type='primary' onClick={() => logoutClick()}>Logout</Button>
        </a>
      </Menu.Item>
      <Menu.Item>
        <ChangePasswordModal {...props} />
      </Menu.Item>
    </Menu>
  )

  const RenderOption = () => {
    if (!loading) {
      if (data && data.sites) {
        return data.sites.map(e => {
          return (
            <Option key={e._id} value={e.name} onClick={() => handleChange(e)}>{e.name}</Option >
          )
        }
        )
      }
    }
  }

  return (
    <div>
      <NavBar type='flex' justify='space-around' align='middle'>
        <Col span={5}>
          <a href='/lun' className='site-logo'>
            <Logo><img src='https://i.ibb.co/Vv6yJQZ/daf4ae51007d9df4a5cc9f7c55687d6d.png' width='150' /></Logo>
          </a>
        </Col>

        <Col span={1}>
          <Icon type='left' onClick={() => handleBackClick()}/>
        </Col>

        <Col span={12} style={{ textAlign: 'center' }}>
          <SelectButton defaultValue='Chọn khu vực'>
            {/* <Option value="Đà Nẵng">Đà Nẵng</Option>
            <Option value="Nha Trang">Nha Trang</Option> */}
            {RenderOption()}
          </SelectButton>
        </Col>
        <Col span={6} style={{ textAlign: 'right', paddingRight: 20 }}>
          <StyledDropdown overlay={menu} placement='bottomCenter'>
            <a className='ant-dropdown-link' href='#'>
              <Avatar icon='user' />
            </a>
          </StyledDropdown>
        </Col>
      </NavBar>
    </div>
  )
}

export default Header