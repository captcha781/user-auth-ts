import { Button, Input, message } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppState } from '../../../Stores/Hooks'
import { addPost, editPost } from '../../../Stores/PostSlice'
// import { Post } from '../../../types'

const CreatePost = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentQueryParameters, setSearchParams] = useSearchParams();
    const [postData, setPostData] = useState<any>()
    const dispatch = useAppDispatch()
    const [editmode, setEditmode] = useState(false)
    const [editableID, setEditableID] = useState<string | null>()
    // const [editpost, setEditPost] = useState<Post | null>(null)
    const posts = useAppState(state => state.posts.posts)

    useEffect(() => {
        let editCheck = currentQueryParameters.get("editmode")
        if (editCheck) {
            setEditmode(true)
            setEditableID(currentQueryParameters.get("postID"))
            setPostData(posts.filter(post => post._id === editableID)[0])
        }
    }, [currentQueryParameters, editableID, posts])


    const handlePostSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (editmode) {
            axios.put("/api/user/edit-post", postData)
                .then(updateResponse => {
                    dispatch(editPost(updateResponse.data.post))
                    window.location.href = window.location.pathname
                    setPostData({ title: "", content: "" })
                })
                .catch(err => {
                    console.log(err);
                })
            setPostData({ title: "", content: "" })
            return
        }

        axios.post("/api/user/create-post", postData)
            .then(res => {
                message.success(res.data.message)
                setTimeout(() => {
                    dispatch(addPost(res.data.post))
                    window.location.href = window.location.pathname
                    setPostData({ title: "", content: "" })
                }, 1500)
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    return (
        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-full '>
            <form className='tw-w-10/12 tw-p-3 tw-px-5 tw-bg-white tw-rounded-md tw-shadow-lg tw-shadow-slate-400 tw-flex tw-flex-col' onSubmit={handlePostSubmit}>
                <h1 className='tw-text-lg tw-text-slate-800 tw-font-medium'>Create Post</h1>
                <Input value={editmode ? postData?.title : ""} onChange={(e: ChangeEvent<HTMLInputElement>) => setPostData({ ...postData, title: e.target.value })} id='createtitle' type='text' name='title' placeholder='Post Title' className='tw-rounded-xl tw-mt-0.5 p-1 tw-items-center' />
                <TextArea id='createcontent' value={editmode ? postData?.content : ""} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPostData({ ...postData, content: e.target.value })} itemProp='readOnly={false}' name='content' placeholder='Post Text' rows={10} className='tw-rounded-xl tw-mt-1.5 p-1 tw-items-center tw-resize-none' />
                <div className='tw-flex tw-justify-end tw-items-center tw-gap-3'>
                    <Button type='primary' htmlType='submit' className='tw-rounded-xl tw-mt-1.5 tw-relative tw-right-0 '>Submit</Button>
                    <Button type='primary' htmlType='reset' className='tw-rounded-xl tw-mt-1.5 tw-relative tw-right-0  tw-bg-amber-400 tw-border-amber-400 hover:tw-bg-amber-300' onClick={() => setPostData({title:"",content:""})}>Reset</Button>
                </div>
            </form>
        </div>
    )
}

export default CreatePost