'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import SharePost from './page'
import { LikeButton } from './page'
import { CommentButotn } from './page'

interface PostProps{
  _id: string
  title: string
  image: string
  username: string
  userImage:string, 
  likes:string[]
}

const HomePost = () => {
  const [like, setLike] = useState([]);
  const [liked, setLiked] = useState({ postId: '', liked: false});
  const [comments, setComments] = useState(false);
  const [see, setSee] = useState(false);
  const [posts, setPosts] = useState<PostProps[] | null>([]);
  const [userId, setUserId] = useState(null);
  const [countLike, setCountLike] = useState(null);
  const FetchUserId = async() => {
    const res = await fetch('http://localhost:3001/getprofile', {
      method:"GET", 
      credentials:"include", 
      headers:{
        'Content-Type':'application/json'
      }
    })

    const data = await res.json();
    setUserId(data.message)
  }

  if(userId){
    localStorage.setItem('userId', userId);
  }

  const posturl = 'http://localhost:3001/uploads/';
  
  
  const OpenComment = () => {
    return comments === true ? setComments(false) : setComments(true)
  }

  const SeeComment = () => {
    return see === true ? setSee(false) : setSee(true)
  }

  const fetchHomePost = async() => {
    const res = await fetch('http://localhost:3001/homepost', {
      method:"GET", 
      credentials:"include", 
      headers:{
        'Content-Type':'application/json'
      }
    })

    const data = await res.json();
    setPosts(data.posts);
  }

  const handleLikePost = async (id: string) => {
    try {
      const res = await fetch('http://localhost:3001/like', {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include"
      });
  
      if (!res.ok) {
        console.error("Lỗi Khi Fetch Like Dữ Liệu");
        return;
      }
  
      const data = await res.json();
      setLike(data);
      if(data.userLiked.includes(data.userId)){
        
        fetchHomePost();
      }else{
        fetchHomePost();
      }
    } catch (error) {
      console.error("Lỗi khi xử lý yêu cầu like:", error);
    }
  };
  useEffect(()=> {
    fetchHomePost()
    FetchUserId()
  }, [liked])
  

  return (
      <div className="col-7 mt-5 scrollable-column">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-dark fw-bolder fs-5">Feeds</p>
                </div>
                <div className="d-flex gap-3">
                  <p className="text-dark">Friends</p>
                  <p className="text-dark">Popular</p>
                </div>
              </div>
    
              <SharePost />
    
              {posts?.map((post) => (
                <div key={post._id} className="border-post mt-3">
                  <div className="p-5">
                    <div>
                      <div className="d-flex gap-2">
                        <Image
                           src={`http://localhost:3001/uploads/profile/${post.userImage.replace("uploads\\profile\\", "")}`}
                          alt="avt"
                          width={50}
                          height={50}
                        ></Image>
                        <p className="m-3 text-dark">{post.username}</p>
                      </div>
      
                      <p className="text-dark mt-3">
                        {post.title}
                      </p>
      
                      <div>
                        <Image
                          src={`${posturl}${post.image.replace("uploads\\", "")}`}
                          alt="post"
                          width={300}
                          height={400}
                          style={{ height: "300", width: "100%", objectFit:"contain"}}
      
                        ></Image>
                      </div>
      
                      <div className="reaction d-flex gap-4 align-items-center mt-3 ">
                        <div className='d-flex justify-content-center align-items-center'>
                          <LikeButton onClick={()=>handleLikePost(post._id)} text={userId && post.likes.includes(userId) ? 'Liked' : 'Like'} postId={post._id}/>
                          <p className='text-dark m-0 ms-2'>{post.likes.length}</p>
                        </div>
      
                        <div onClick={OpenComment}>
                          <CommentButotn />
                          <p className="text-dark">Comment</p>
                        </div>

                        {comments ? 
                        (<div style={{width:"100%"}}>
                          <input type="text" placeholder='Để Lại Bình Luận Của Bạn?' className='form-control'
                          style={{borderRadius:"10px"}} />
                        </div>):<p>''</p>}
                      </div>

                      <div className='comments'>
                          <p onClick={SeeComment} className='text-dark'>Xem Bình Luận</p>
                          {see?(<div className='border p-3' style={{borderRadius:"10px"}}>
                              <div className='d-flex gap-3 align-items-center'>
                                  <Image alt='avt' src={'/facebook.png'} width={30} height={30}></Image>
                                  <p className='m-0 text-dark'>Lê Toàn Bân</p>
                              </div>

                              <div>
                                  <p className='text-dark mt-2 ms-5'>Tấm Hình Này Xinh Quá đinh</p>
                              </div>
                          </div>):<p>''</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              

              
        </div>
  )
}

export default HomePost
