'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
interface SearchProfile{
    _id:string
    username: string,
    image:string
}

const CanvasSearch = () => {
  const [search, setSearch] = useState(''); 
  const [resultsProflie, setResultsProfile] = useState<SearchProfile[]>([]);
  const url = 'http://localhost:3001/uploads/profile/'
  const handleSearch = async(e:React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/search', {
        method:"POST", 
        body:JSON.stringify({search}), 
        headers:{
            'Content-Type':'application/json'
        }
    })

    const data = await res.json();
    setResultsProfile(data.message);
  }  

  return (
      <div className="offcanvas offcanvas-start" tabIndex={-1} id="searchprofile" aria-labelledby="offcanvasExampleLabel">
          <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasExampleLabel">Search Profile</h5>
          </div>
          <div className="offcanvas-body">
              <div>
                <form onSubmit={handleSearch}>
                    <input value={search} onChange={(e)=> setSearch(e.target.value)} type="text" placeholder='Tìm Kiếm' className='form-control' />
                </form>
              </div>

              <div className="results">
                    {resultsProflie.length > 0 ? (
                        resultsProflie.map((user) => (
                            <Link key={user._id}  href={`/profile/${user._id}`}>
                                <div className="border d-flex align-items-center mt-3" style={{borderRadius:"10px"}}>
                                    <div className="p-2 d-flex gap-3 align-items-center">
                                        <Image 
                                        src={`${url}${user.image.replace("uploads\\profile\\", "")}`} alt="avt" height={30} width={30}>   
                                        </Image>
                                        <p className="m-0">{user?.username}</p>
                                    </div>
                                </div> 
                            </Link>
                        ))
                    ):(
                        <p className='mt-4'>Không Có Thông Tin Tìm Kiếm</p>
                    )}
              </div>  
          </div>
      </div>
    )
}

export default CanvasSearch
