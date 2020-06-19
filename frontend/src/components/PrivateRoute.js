import React, { Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import Header from './ShellBar/ShellBar'

const PrivateRoute = props => {
  if (!props.isAuthenticated) return <Redirect to='/login' />
  return (
    <Fragment>
      <Header {...props} />
      <div className='private-content'>{props.children}</div>
    </Fragment>
  )
}

export default PrivateRoute
