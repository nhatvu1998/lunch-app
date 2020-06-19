import React from 'react'

const CustomButton = (props) => {
  return (
    <button className='custom-btn'>{props.children}</button>
  )
}

export default CustomButton
