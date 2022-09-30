import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../Stores/Hooks'

const Index = () => {

  const state = useAppState(state => state.credentials)
  const navigate = useNavigate()

  useEffect(() => {
    if (!state.auth) {
      navigate("/signin")
      return
    }

  }, [navigate, state.auth])

  return (
    <div className='tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-text-lg tw-font-sans tw-font-medium'>HomePage</div>
  )
}

export default Index