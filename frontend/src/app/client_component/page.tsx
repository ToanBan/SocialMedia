'use client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import React, { useState } from 'react'
import Image from 'next/image'

export const LikeButton = ({onClick, text, postId}:{text:string, postId:string,onClick:(event:React.MouseEvent<HTMLDivElement>)=>void}) => {
    
    return (
      <>
        <div onClick={onClick}>
          <Image className='img-icon' src={'/like.png'} alt="icon" width={30} height={30}></Image>
          <p className="text-dark like-text">{text}</p>
        </div>
      </>
    )
}

export const CommentButotn = () => {
    return <Image src={'/chat.png'} alt="icon" width={30} height={30}></Image>
}

export const OpenCanvas = () => {
  return (
    <>
      <a className='text-dark' data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
        Messages
      </a>
    </>
  )
}

export const SearchInfoProfile = () => {
  return (
    <>
      <a className='text-dark' data-bs-toggle="offcanvas" href="#searchprofile" role="button" aria-controls="offcanvasExample">
        Search Profile
      </a>
    </>
  )
}


export const Logout = () => {
    const handleLogout = async() => {
        const res = await fetch('http://localhost:3001/logout', {
          method:"POST", 
          credentials: 'include',
        })

        const data = await res.json();
        if (data.success) {
          window.location.href = '/login';
        }
    }
  

    return (
      <>
        <div style={{ padding: "10px" }} className="mt-3 ms-3">
          <a className='text-dark' onClick={handleLogout}>
            Logout
          </a>
        </div>
      </>
    )
}

const SharePost = () => {
  return (
    <div className="mt-3">
                  <div>
                    <form action="" className="d-flex gap-2 justify-content-center align-items-center">
                      <Image src={'/facebook.png'} alt="avt" height={20} width={20}></Image>
                      <input className="form-control" type="text" placeholder="Share something"/>
                    </form>
    
                    <div className="d-flex gap-3 mt-3">
                      <div className="d-flex gap-3">
                        <Image src={'/image-gallery.png'} alt="icon" width={20} height={20}></Image>
                        <p className="text-dark">Image</p>
                      </div>
    
                      <div className="d-flex gap-3">
                        <Image src={'/document.png'} alt="icon" width={20} height={20}></Image>
                        <p className="text-dark">File</p>
                      </div>
                    </div>
                  </div>
                </div>
  )
}


export default SharePost

