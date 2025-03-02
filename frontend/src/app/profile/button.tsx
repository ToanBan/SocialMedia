'use client'
import x from './profile.module.css'
import React, { useState } from 'react'

interface ButtonProps{
  
    color:string
    bg:string,
    changeFollow?: (data: { countFollower: number; isFollowing: boolean }) => void;   
}

const Button:React.FC<ButtonProps> = ({ color, bg, changeFollow}) => {
  const [follow, setFollow] = useState(false);
  const handleClick = () => {
    if(follow === true){
      setFollow(false)
    }else{
      setFollow(true);
      
    }
  }


  return (
    <div>
      <button onClick={handleClick} style={{backgroundColor:`${bg}`, color:`${color}`}} className={x.button}>
        {follow ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  )
}

export default Button
