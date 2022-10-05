import { Button, Input, message } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import React, { FormEvent, useRef } from 'react'
import { useAppDispatch } from '../../../Stores/Hooks'
import { addPost } from '../../../Stores/PostSlice'

const CreatePost = () => {

    const titleRef = useRef<HTMLInputElement | null | any>(null)
    const contentRef = useRef<HTMLTextAreaElement | null | any>(null)
    const dispatch = useAppDispatch()

    const handlePostSubmit = (e: FormEvent) => {
        e.preventDefault()

        axios.post("/api/user/create-post", {
            title: titleRef.current.input.value,
            content: contentRef.current.resizableTextArea.props.value
        })
        .then(res => {
            message.success(res.data.message)
            setTimeout(() => {
                dispatch(addPost(res.data.post))
                window.location.href = window.location.pathname
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
                <Input id='createtitle' ref={titleRef} type='text' name='title' placeholder='Post Title' className='tw-rounded-xl tw-mt-0.5 p-1 tw-items-center' />
                <TextArea id='createcontent' itemProp='readOnly={false}' ref={contentRef} name='content' placeholder='Post Text' rows={10} className='tw-rounded-xl tw-mt-1.5 p-1 tw-items-center tw-resize-none' />
                <Button type='primary' htmlType='submit' className='tw-rounded-xl tw-mt-1.5 tw-relative tw-right-0 tw-self-end'>Submit</Button>

            </form>
        </div>
    )
}

export default CreatePost