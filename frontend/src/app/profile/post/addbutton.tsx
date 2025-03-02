'use client'

import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';

const Addbutton = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
      import('bootstrap');
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleAddPost = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        if (image) {
            formData.append('image', image);
        }

        const res = await fetch('http://localhost:3001/post', {
            method: "POST",
            credentials: 'include',
            body: formData,
        });

        const data = await res.json();
        alert("Thêm bài post thành công");
        window.location.reload();
    }

    return (
        <>
            <button className='mt-3 btn btn-danger' data-bs-toggle="modal" data-bs-target="#addpost">
                Add Post
            </button>

            <div className="modal fade" id="addpost" data-bs-backdrop="false" tabIndex={-1} aria-labelledby="addpostLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title text-dark" id="addpostLabel">Thêm bài post</h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form encType='multipart/form-data'>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="form-control" placeholder="Chia sẻ cảm xúc" name='title' />
                                <input onChange={handleImageChange} type="file" className='mt-3 form-control' name='image' />
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleAddPost}>Thêm Bài Post</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Addbutton;
