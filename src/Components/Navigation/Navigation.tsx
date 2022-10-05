import React from 'react'
import { Link } from 'react-router-dom'
import { useAppState } from '../../Stores/Hooks'

const Navigation = () => {

  const state = useAppState(state => state.credentials)

  return (
    <>
      <div className='tw-fixed tw-w-full tw-bg-slate-800 tw-flex tw-justify-between tw-items-center tw-p-3 tw-text-white tw-font-sans' id='navigation' style={{ zIndex: 5 }}>
        <div className='tw-font-medium tw-text-lg'>GB Instagram</div>
        <div className='tw-hidden lg:tw-flex tw-justify-between tw-items-center tw-gap-2 tw-text-base tw-w-auto'>
          {state.auth ? <span className='tw-w-6 tw-h-6 tw-rounded-full tw-bg-center tw-bg-contain tw-bg-no-repeat' style={{ backgroundImage: `url("${state.user?.profilePic}")` }}></span> : <></>}
          {state.auth ? <p className='tw-text-white tw-my-0 tw-mx-2 tw-px-3 tw-py-0.5 tw-rounded tw-bg-slate-500 tw-bg-opacity-25'>@ {state.user?.name}</p> : <></>}
          {state.auth ? <Link className='tw-text-white tw-py-0.5 tw-px-1.5 tw-rounded hover:tw-bg-slate-500 hover:tw-bg-opacity-25' to={"/"}>Home</Link> : <></>}
          {!state.auth ? <><Link className='tw-text-white tw-py-0.5 tw-px-1.5 tw-rounded hover:tw-bg-slate-500 hover:tw-bg-opacity-25' to={"/signin"}>Signin</Link>
            <Link className='tw-text-white tw-py-0.5 tw-px-1.5 tw-rounded hover:tw-bg-slate-500 hover:tw-bg-opacity-25' to={"/signup"}>Signup</Link></> : <></>}
          {state.auth ? <Link className='tw-text-white tw-py-0.5 tw-px-1.5 tw-rounded hover:tw-bg-slate-500 hover:tw-bg-opacity-25' to={"/signout"}>Signout</Link> : <></>}
        </div>
        <div className='lg:tw-hidden tw-relative' style={{ zIndex: 5 }}>
          <div className='customer-menu-container' style={{ zIndex: 5 }}>
            <label htmlFor="custom-check" onClick={() => {
              let checkbox = document.getElementById("check") as HTMLInputElement
              let menu = document.getElementById("menu-item") as HTMLDivElement
              checkbox.click()
              if (checkbox.checked) {
                menu.classList.add("custom-menu-item")
                menu.classList.remove("custom-menu-item-close")
                menu.classList.remove("tw-hidden")
              } else {
                menu.classList.remove("custom-menu-item")
                menu.classList.add("custom-menu-item-close")
                setTimeout(() => {
                  menu.classList.add("tw-hidden")
                }, 299)
              }


            }} style={{ zIndex: 5 }}>
              <input className='custom-check-box' type="checkbox" id="check" />
              <span className='custom-span' style={{ zIndex: 5 }}></span>
              <span className='custom-span' style={{ zIndex: 5 }}></span>
              <span className='custom-span' style={{ zIndex: 5 }}></span>
            </label>
          </div>
        </div>
      </div>
      <div className='tw-hidden tw-w-screen tw-h-screen lg:tw-hidden tw-fixed tw-bg-slate-800 ' id='menu-item' style={{ zIndex: 3 }} >
        <div className='tw-w-full tw-h-full tw-grid tw-place-items-center tw-text-white'>
          <div className='tw-w-1/4 tw-font-serif tw-text-lg tw-flex tw-flex-col tw-items-center'>
            {state.auth ? <span className='tw-w-6 tw-h-6 tw-rounded-full tw-bg-center tw-bg-contain tw-bg-no-repeat' style={{ backgroundImage: `url("${state.user?.profilePic}")` }}></span> : <></>}
            {state.auth ? <p className='tw-text-white tw-my-0 tw-mx-2 tw-px-3 tw-py-0.5 tw-rounded tw-bg-slate-500 tw-bg-opacity-25'>@ {state.user?.name}</p> : <></>}
            {state.auth ? <Link className='tw-text-white tw-py-0.5 tw-px-1.5 tw-rounded hover:tw-bg-slate-500 hover:tw-bg-opacity-25' to={"/"}>Home</Link> : <></>}
            {!state.auth ? <><Link className='tw-text-white tw-py-0.5 tw-px-1.5 tw-rounded hover:tw-bg-slate-500 hover:tw-bg-opacity-25' to={"/signin"}>Signin</Link>
              <Link className='tw-text-white tw-py-0.5 tw-px-1.5 tw-rounded hover:tw-bg-slate-500 hover:tw-bg-opacity-25' to={"/signup"}>Signup</Link></> : <></>}
            {state.auth ? <Link className='tw-text-white tw-py-0.5 tw-px-1.5 tw-rounded hover:tw-bg-slate-500 hover:tw-bg-opacity-25' to={"/signout"}>Signout</Link> : <></>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation