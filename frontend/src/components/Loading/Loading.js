import React from 'react'
import { ClipLoader } from 'react-spinners'
import './styles.scss'

const Loading = () => (
  <div className='loadingLazy'> 
    <ClipLoader 
      sizeUnit='px'
      loading
      size={70}
      color='#74B1E5'
    />
  </div>
)

export default Loading