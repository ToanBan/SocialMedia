'use client'

import React, { ButtonHTMLAttributes, useEffect, useRef, useState } from 'react'
import x from './profile.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'next/navigation';
const ButtonEditProfile = () => {
    const [username, setUsername] = useState(''); 
    const [title, setTitle] = useState(''); 
    const [image, setImage] = useState<File | null>(null);
    const idUserCurrent = useParams();
    const handleOnChangeText = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if(name === 'username'){
          setUsername(value);     
        }else if(name === 'title'){
          setTitle(value)
        }
    }

    const handleOnChangeImage = (e:React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]){
        setImage(e.target.files[0]);
      }
    }


    const handleEditProfile = async(e:React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        if(username){
          formData.append('username', username)
        }
        if(title){
          formData.append('title', title)
        }
        if(image){
          formData.append('image', image);
        }
        const res = await fetch('http://localhost:3001/edit', {
            method:"POST", 
            credentials:"include", 
            body:formData 
        })
        if(!res.ok){
            console.log('Lỗi... fetch ');
            return;
        }

        const data = await res.json();
        alert("Cập Nhật Thành Công");
        window.location.reload();
    }

    useEffect(()=>{
      import('bootstrap')
    }, []);

    return (
       <>
         <button data-bs-toggle="modal" data-bs-target="#edit" className={`${x.button}`} style={{backgroundColor:"red"}}>Edit Profile</button>
         <div className="modal fade" id="edit" data-bs-backdrop="false" tabIndex={-1} aria-labelledby="addpostLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title text-dark" id="addpostLabel">Chỉnh Sửa Tài Khoản</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form encType='multipart/form-data'>
                <input onChange={handleOnChangeText} value={username} type="text" className="form-control" placeholder="Username" name='username'/>
                <input onChange={handleOnChangeText} value={title} type="text" className="mt-3 form-control" placeholder="Mô tả" name='title'/>
                <input onChange={handleOnChangeImage} type="file" className='mt-3 form-control' name='image'/>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" onClick={handleEditProfile} className="btn btn-danger">Cập Nhật Thông Tin</button>
            </div>
          </div>
        </div>
      </div>
       </>    
    )
}

export default ButtonEditProfile
