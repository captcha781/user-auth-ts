import { CommentOutlined, HeartTwoTone, ShareAltOutlined } from '@ant-design/icons'
import { message } from 'antd'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppState } from '../../../Stores/Hooks'
import { initializePosts } from '../../../Stores/PostSlice'

const Main = () => {

    const user = useAppState(state => state.credentials.user)
    const posts = useAppState(state => state.posts.posts)
    const dispatch = useAppDispatch()

    useEffect(() => {
        axios.get("/api/user/posts")
        .then(response => {
            if(response.data?.message){
                message.info(response.data.message)
            }
            dispatch(initializePosts(response.data))
        })
    },[dispatch])

  return (
    <div className='tw-gap-3 tw-flex tw-flex-col tw-items-stretch tw-w-full'>
        {posts.map(postItem => {
            return (
                <div key={postItem._id} className='tw-bg-white tw-rounded-md tw-shadow-lg tw-shadow-slate-300 tw-p-3 tw-w-full'>
                    <div className='tw-flex tw-justify-between tw-items-center tw-text-sm'>
                        <div className='tw-flex tw-items-center'>
                            <div className='tw-w-9 tw-h-9 tw-rounded-full tw-bg-no-repeat tw-bg-center tw-bg-contain' style={{backgroundImage: `url("${user?.profilePic}")`}} ></div>
                            <div className='tw-text-xs tw-mx-2'>
                                <p className='' style={{marginBottom: 3}}>{user?.username}</p>
                                <p className='tw-text-slate-400' style={{marginBottom: 1}}>{postItem.postTime}</p>
                            </div>
                        </div>
                        <div className='bi bi-three-dots-vertical tw-w-9 tw-h-9 tw-rounded-full hover:tw-bg-sky-400 hover:tw-bg-opacity-20 tw-flex tw-justify-center tw-items-center'></div>
                    </div>
                    <div className='tw-mt-5 tw-w-full'>
                        <p className='tw-text-lg'>{postItem.title}</p>
                        <p className='tw-text-sm'>{postItem.content}</p>
                    </div>
                    <div className='tw-flex tw-justify-between tw-items-center'>
                        <div className='tw-flex tw-items-center tw-gap-2 tw-text-slate-600'>
                            <div className='tw-flex tw-items-center'><HeartTwoTone twoToneColor={"#f00"}  className='tw-mr-2'/>{postItem.totalLikes}</div>
                            <div className='tw-flex tw-items-center'><CommentOutlined className='tw-mr-2'/>{postItem.totalComments}</div>
                            <div className='tw-flex tw-items-center'><ShareAltOutlined/></div>
                        </div>
                        <div></div>
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export default Main