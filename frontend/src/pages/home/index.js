import React from 'react'
import './styles.less'
import Dashboard from '../dashboard/index'

const Home = (props) => {
  return (
    <div>
      <Dashboard {...props} />
    </div>
  )
}

export default Home