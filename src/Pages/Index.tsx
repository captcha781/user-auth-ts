import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CreatePost from '../Components/Index/CreatePost/CreatePost'
import Main from '../Components/Index/Main/Main'
import { useAppState } from '../Stores/Hooks'

const Index = () => {
  document.title = "Home"
  const state = useAppState(state => state.credentials)
  const navigate = useNavigate()

  let navHt;
  navHt = document.getElementById("navigation")?.clientHeight

  useEffect(() => {
    if (!state.auth) {
      navigate("/signin")
      return
    }

  }, [navigate, state.auth])

  return (
    <div className='tw-w-full tw-h-full tw-text-lg tw-font-sans tw-font-medium tw-grid tw-grid-cols-12 tw-p-3 tw-gap-3 lg:tw-items-stretch' style={{marginTop:navHt}}>
      <div className='tw-fixed lg:tw-static tw-col-span-2 tw-bottom-0  tw-overflow-auto'>sidebar</div>
      <div className='tw-col-span-7  tw-rounded-lg tw-overflow-auto [height:94%]'><Main/></div>
      <div className='tw-hidden lg:tw-block lg:tw-col-span-3 tw-overflow-auto'><CreatePost/></div>
    </div>
  )
}

export default Index