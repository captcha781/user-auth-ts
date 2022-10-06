import { CommentOutlined, HeartTwoTone, ShareAltOutlined } from '@ant-design/icons'
import { message, Dropdown, Menu } from 'antd'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppState } from '../../../Stores/Hooks'
import { deletePost, initializePosts } from '../../../Stores/PostSlice'

const Main = () => {

    // const location = useLocation()
    const user = useAppState(state => state.credentials.user)
    const posts = useAppState(state => state.posts.posts)
    const dispatch = useAppDispatch()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentQueryParameters, setSearchParams] = useSearchParams();
    useEffect(() => {
        axios.get("/api/user/posts")
            .then(response => {
                if (response.data?.message) {
                    message.info(response.data.message)
                }
                dispatch(initializePosts(response.data))
            })
    }, [dispatch])

    const editTrigger = (id: string) => {
        setSearchParams("editmode=true&postID=" + id)
    }

    const deleteTrigger = (id: string) => {
        axios.delete("/api/user/posts/" + id)
            .then(deleteRes => {
                message.success(deleteRes.data.message)
                setTimeout(() => {
                    dispatch(deletePost(id))
                }, 1500);
            })
            .catch(err => {
                message.error(err.response.data.message)
            })
    }

    return (
        <div className='tw-gap-3 tw-flex tw-flex-col tw-items-stretch tw-w-full'>
            {posts.map(postItem => {
                return (
                    <div key={postItem._id} className='tw-bg-white tw-rounded-md tw-shadow-lg tw-shadow-slate-300 tw-p-3 tw-w-full'>
                        <div className='tw-flex tw-justify-between tw-items-center tw-text-sm'>
                            <div className='tw-flex tw-items-center'>
                                <div className='tw-w-9 tw-h-9 tw-rounded-full tw-bg-no-repeat tw-bg-center tw-bg-contain' style={{ backgroundImage: `url("${postItem.postedBy?.profilePic}")` }} ></div>
                                <div className='tw-text-xs tw-mx-2'>
                                    <p className='' style={{ marginBottom: 3 }}>{postItem.postedBy?.username}</p>
                                    <p className='tw-text-slate-400' style={{ marginBottom: 1 }}>{postItem.postTime}</p>
                                </div>
                            </div>
                            {user?.username === postItem.postedBy.username ? <Dropdown overlay={
                                <Menu
                                    items={[
                                        { key: '1', label: <div onClick={() => { editTrigger(postItem._id) }}>Edit Post</div>},
                                        { key: '2', label: <div onClick={() => { deleteTrigger(postItem._id) }}>Delete Post</div>}
                                    ]}
                                />
                            }
                                placement={"bottomRight"}>
                                <div className='bi bi-three-dots-vertical tw-w-9 tw-h-9 tw-rounded-full hover:tw-bg-sky-400 hover:tw-bg-opacity-20 tw-flex tw-justify-center tw-items-center'></div>
                            </Dropdown> : <Dropdown placement='bottomRight' overlay={
                                <Menu
                                    items={[
                                        { key: '1', label: <div onClick={() => { }}>Report Post</div>},
                                    ]}
                                />
                            }>
                                <div className='bi bi-three-dots-vertical tw-w-9 tw-h-9 tw-rounded-full hover:tw-bg-sky-400 hover:tw-bg-opacity-20 tw-flex tw-justify-center tw-items-center'></div>
                            </Dropdown>}
                        </div>
                        <div className='tw-mt-5 tw-w-full'>
                            <p className='tw-text-lg'>{postItem.title}</p>
                            <p className='tw-text-sm'>{postItem.content}</p>
                        </div>
                        <div className='tw-flex tw-justify-between tw-items-center'>
                            <div className='tw-flex tw-items-center tw-gap-2 tw-text-slate-600'>
                                <div className='tw-flex tw-items-center'><HeartTwoTone twoToneColor={"#f00"} className='tw-mr-2' />{postItem.totalLikes}</div>
                                <div className='tw-flex tw-items-center'><CommentOutlined className='tw-mr-2' />{postItem.totalComments}</div>
                                <div className='tw-flex tw-items-center'><ShareAltOutlined /></div>
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