import React, { Fragment } from 'react'
import { Redirect } from 'react-router-dom'

const PublicRoute = props => {
  if (props.isAuthenticated) return <Redirect to='/lun' />
  return <Fragment>{props.children}</Fragment>
}

export default PublicRoute
