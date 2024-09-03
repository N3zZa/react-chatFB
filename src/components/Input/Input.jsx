import React from 'react'
import { forwardRef } from 'react'
import './input.css'

const Input = forwardRef((props, ref) => {
  return (
    <input {...props} ref={ref}/>
  )
})

export default Input