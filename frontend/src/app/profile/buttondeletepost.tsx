'use client'

import React from 'react'
import x from './profile.module.css'
import Image from 'next/image'
const ButtonDeletePost = ({id}:{id:string}) => {
  const handleDeletePost = async(e:React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    const isConfirm = window.confirm('Bạn có muốn xóa bài bài viết này không');
    if(!isConfirm) return;
    const res = await fetch(`http://localhost:3001/post/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })

    const data = await res.json()
    window.location.reload();
  }

  return <Image onClick={handleDeletePost} src='/remove.png' alt='delete' width={18} height={18} className={x.btnDelete}></Image>
}

export default ButtonDeletePost
