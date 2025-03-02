import React from 'react'

const GetProfile = async(id:string) => {
    const res = await fetch(`http://localhost:3001/profile/${id}`, {
        method:"GET", 
        headers:{
          'Content-Type': 'application/json'
        }, 
        cache:"no-store"
    }
    )

    const data = await res.json();
    return data;
}

export default GetProfile
