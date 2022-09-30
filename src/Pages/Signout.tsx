import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signout } from '../Stores/CredentialSlice'
import { useAppDispatch } from '../Stores/Hooks'

const Signout = () => {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useEffect(() => {
    setTimeout(() => {
      localStorage.clear()
      axios.defaults.headers.common["jwt-token"] = ""
      dispatch(signout("signout"))
      navigate("/signin")
    },2000)
  })

  return (
    <div className='tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center'><Spin size='large' indicator={<LoadingOutlined className='tw-text-black' spin/>}/></div>
  )
}

export default Signout