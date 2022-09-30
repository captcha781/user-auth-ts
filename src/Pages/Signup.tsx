import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Space, Input, Button, message, Upload } from "antd"
import type { RcFile, UploadFile, UploadProps } from 'antd/lib/upload/interface'
import { LockFilled, MailOutlined, SendOutlined, UserOutlined, UploadOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppState } from '../Stores/Hooks'
import axios from 'axios'
import { intialize } from '../Stores/CredentialSlice'
import "../Components/styles/Signup.css"
import 'antd/es/modal/style'
import 'antd/es/slider/style'
const Signup = () => {

  const state = useAppState(state => state.credentials)
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confPassword, setConfPassword] = useState("")
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [file, setFile] = useState<any>(null)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (state.auth) {
      navigate("/")
      return
    }
  }, [navigate, state.auth])


  const signupHandler = (e: FormEvent) => {
    e.preventDefault()
    let formData = new FormData()
    if(confPassword && password){
      formData.append("name", name)
      formData.append("username", username)
      formData.append("email", email)
      formData.append("password", password)
      formData.append("confpassword", confPassword)
      formData.append("profile", file)
    }
    // console.log(file);

    axios.post("/api/user/register", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(response => {
        message.success(response.data.message)
        localStorage.setItem("jwt-token", response.data.token)
        setTimeout(() => {
          dispatch(intialize(response.data))
          if (response.data.auth) {
            navigate("/")
          }
        }, 2000)
      })
      .catch(err => message.error(err.message))
  }

  const onFileChange: UploadProps["onChange"] = ({ fileList: latestFilelist, file: fileToUpload }) => {
    // console.log(latestFilelist[0]);
    setFileList(latestFilelist)
    setFile(fileToUpload)

  }

  const onFilePreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    // console.log(src);

    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  }



  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFile(file)
    };


    return false;
  };


  return (
    <div className='tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center tw-font-sans'>
      <form className='tw-w-10/12 sm:tw-w-6/12 md:tw-w-1/3 lg:tw-w-1/4  xl:tw-w-1/6 tw-p-4 tw-bg-white tw-rounded-md tw-shadow-xl tw-shadow-slate-400'  >
        <h1 className='tw-text-xl tw-font-medium tw-my-1.5'>Sign Up</h1>
        <Space direction='vertical' className='tw-w-full'>
          <Input type='text' prefix={<UserOutlined className='tw-mr-1 tw-text-slate-400' />} placeholder="Username" className='tw-rounded-full tw-mt-3 p-1 tw-items-center' required={true} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
          <Input type='text' prefix={<UserOutlined className='tw-mr-1 tw-text-slate-400' />} placeholder="Name" className='tw-rounded-full tw-mt-3 p-1 tw-items-center' required={true} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
          <Input type='email' prefix={<MailOutlined className='tw-mr-1 tw-text-slate-400' />} placeholder="Email ID" className='tw-rounded-full tw-mt-3 p-1 tw-items-center' required={true} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
          <Input.Password prefix={<LockFilled className='tw-mr-1 tw-text-slate-400 ' />} placeholder="Password" className='tw-rounded-full tw-mt-3' required={true} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
          <Input.Password prefix={<LockFilled className='tw-mr-1 tw-text-slate-400 ' />} placeholder="Confirm Password" className='tw-rounded-full tw-mt-3' required={true} onChange={(e: ChangeEvent<HTMLInputElement>) => setConfPassword(e.target.value)} />
          <div className='tw-w-full tw-flex'>
            <Upload className='tw-rounded-full tw-mt-3 tw-flex tw-justify-center tw-flex-col tw-items-stretch tw-w-full tw-text-center custom-children' beforeUpload={beforeUpload} id='profile' listType='picture' fileList={fileList} onChange={onFileChange} onPreview={onFilePreview}>{fileList.length < 1 ? <Button className='tw-rounded-full tw-w-full tw-flex tw-items-center tw-justify-center' icon={<UploadOutlined />} onClick={() => message.info("Square image recommended")} >Upload</Button> : <></>}</Upload>
          </div>

          <Button icon={<SendOutlined sizes='small' />} className='tw-w-full tw-flex tw-justify-center tw-items-center tw-rounded-full tw-mt-3 hover:tw-bg-blue-500 hover:tw-border-blue-500 hover:tw-text-white tw-cursor-pointer' onClick={signupHandler}>Submit</Button>
        </Space>
      </form>
    </div>
  )
}


export default Signup

