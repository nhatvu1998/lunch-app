import React, { useState } from 'react'
import jwt_decode from 'jwt-decode'
import { Provider, Dashboard, MenuBar } from '@digihcs/dashboard'

const Index = props => {
  const { history } = props
  const [childNode, setChildNode] = useState([{
    name: 'Quản lý thực đơn',
    dest: '/order',
    icon: 'shopping-cart'
  }])
  console.log(history)
  const token = window.localStorage.getItem('token')
  const decoded = jwt_decode(token)
  const role = decoded.role
  if (role === 'admin') {
    childNode.unshift({
      name: 'Quản lý site',
      dest: '/sites',
      icon: 'user'
    },
    {
      name: 'Quản lý shop',
      dest: '/shops',
      icon: 'user'
    },
    {
      name: 'Quản lý menu',
      dest: '/menu',
      icon: 'align-justify'
    },
    {
      name: 'Báo cáo',
      dest: '/report',
      icon: 'flag'
    },
    {
      name: 'Quản lý người dùng',
      dest: '/users',
      icon: 'user'
    })
  }

  console.log(decoded)
  return (
    <>
      <Provider>
        <div >
          <MenuBar />
          <div
            style={{
              height: window.innerHeight
            }}
          >
            <Dashboard
              isInEditMode={false}
              configurations={{
                history
              }}
              data={[
                {
                  title: 'App đặt cơm ',
                  type: 'navigation',
                  isSwitchTriggerable: false,
                  childs: childNode
                }
              ]}
            />
          </div>
        </div>
      </Provider>
    </>
  )
}

export default Index

// [
//   role === 'admin' ? ({
//     name: 'Quản lý site',
//     dest: '/sites',
//     icon: 'user'
//   },
//   {
//     name: 'Quản lý shop',
//     dest: '/shops',
//     icon: 'user'
//   },
//   {
//     name: 'Quản lý menu',
//     dest: '/menu',
//     icon: 'align-justify'
//   },
//   {
//     name: 'Báo cáo',
//     dest: '/report',
//     icon: 'flag'
//   },
//   {
//     name: 'Quản lý người dùng',
//     dest: '/users',
//     icon: 'user'
//   }) : ({}),
//   {
//     name: 'Quản lý thực đơn',
//     dest: '/order',
//     icon: 'shopping-cart'
//   }
// ]