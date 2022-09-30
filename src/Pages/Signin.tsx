import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppState } from '../Stores/Hooks'
import { Space, Input, Button, message } from "antd"
import { LockFilled, MailOutlined, SendOutlined } from "@ant-design/icons"
import axios from 'axios'
import { intialize } from '../Stores/CredentialSlice'
import { useFormik } from 'formik'
import * as Yup from "yup"

const Signin = () => {
  document.title = "Sign In"
  const state = useAppState(state => state.credentials)
  const navigate = useNavigate()

  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")

  const dispatch = useAppDispatch()

  useEffect(() => {
    
    if (state.auth) {
      navigate("/")
      return
    }

  }, [navigate, state.auth])


  const signInHandler = (values:any) => {
    axios.post("/api/user/login", values)
      .then(response => {
        message.success(response.data.message)
        localStorage.setItem("jwt-token", response.data.token)
        setTimeout(() => {
          dispatch(intialize(response.data))
          navigate("/")
        }, 2000)
      })
      .catch((err) => {
        message.error(err.response.data.message || err.message)
      })
      return
  }

  const formik = useFormik({
    initialValues:{email: "",password: ""},
    onSubmit: values => signInHandler(values),
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(8).max(30).matches(new RegExp ("^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$"),"Password must contain 1 uppercase, 1 lowercase, 1 symbol, 1 number and min 8 to max 30 characters").required("Required")
    })
  })

  return (
    <div className='tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-font-sans'>
      <form className='tw-w-10/12 sm:tw-w-6/12 md:tw-w-1/3 lg:tw-w-1/4  xl:tw-w-1/6 tw-p-4 tw-bg-white tw-rounded-md tw-shadow-xl tw-shadow-slate-400' onSubmit={formik.handleSubmit} >
        <h1 className='tw-text-xl tw-font-medium tw-my-1.5'>Sign In</h1>
        <Space direction='vertical' className='tw-w-full'>
          {/* <Input type='email' prefix={<MailOutlined className='tw-mr-1 tw-text-slate-400' />} placeholder="Email ID" className='tw-rounded-full tw-mt-3 p-1 tw-items-center' required={true} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} /> */}
          <Input type='email' name='email' prefix={<MailOutlined className='tw-mr-1 tw-text-slate-400' />} placeholder="Email ID" className='tw-rounded-full tw-mt-3 p-1 tw-items-center' required={true} value={formik.values.email} onChange={formik.handleChange} />
          {/* <Input.Password prefix={<LockFilled className='tw-mr-1 tw-text-slate-400 ' />} placeholder="Password" className='tw-rounded-full tw-mt-3' required={true} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} /> */}
          <Input.Password name='password' prefix={<LockFilled className='tw-mr-1 tw-text-slate-400 ' />} placeholder="Password" className='tw-rounded-full tw-mt-3' required={true} onChange={formik.handleChange} value={formik.values.password} />
          <Button htmlType='submit' icon={<SendOutlined sizes='small' />} className='tw-w-full tw-flex tw-justify-center tw-items-center tw-rounded-full tw-mt-3 hover:tw-bg-blue-500 hover:tw-border-blue-500 hover:tw-text-white tw-cursor-pointer' >Submit</Button>
        </Space>
      </form>
    </div>
  )
}

export default Signin