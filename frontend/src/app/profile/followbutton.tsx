'use client'
import { useParams } from 'next/navigation'
import x from './profile.module.css'
import React, { useEffect, useState } from 'react'

interface ButtonProps {
    color: string
    bg: string
    id: string
    userId: string
}

const FollowButton: React.FC<ButtonProps> = ({ color, bg, id, userId }) => {
  const userProfile = useParams();
  const [follow, setFollow] = useState(false);
  const [profile, setProfile] = useState<{ message?: any } | null>(null);

  const handleClick = async () => {
    const newFollowState = !follow;
    setFollow(newFollowState); 

    try {
      const res = await fetch('http://localhost:3001/following', {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ follow: newFollowState, userProfile: userProfile.slug }), 
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
    } catch (error) {
      console.error("Lỗi Khi Follow");
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:3001/profile/${id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
        cache: "no-store"
      });

      const data = await res.json();
      setProfile(data);
    
      if (data.message?.follower?.includes(userId)) {
        setFollow(true);
      }
    } catch (error) {
      console.error("Lỗi khi tải hồ sơ");
    }
  };
 

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <button onClick={handleClick} style={{ backgroundColor: bg, color: color }} className={x.button}>
        {follow ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  )
}

export default FollowButton;
