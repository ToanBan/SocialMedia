'use client';

import OffCanvasMessagePage from "../server_component/canvasmessage";
import Link from "next/link";
import Image from "next/image";
import { OpenCanvas } from "../client_component/page";
import { Logout } from "../client_component/page";
import GetUser from "../../../_action/getuser";
import { useEffect, useState } from "react";
import { SearchInfoProfile } from "../client_component/page";
import CanvasSearch from "./canvassearch";

interface UserProps{
  username: string, 
  email: string, 
  userId: string
}

const Navigation =() => {
  const [user, setUser] = useState<UserProps | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await GetUser();
        if (!userData || !userData.username) {
          window.location.href = "/login"; 
        } else {
          setUser(userData); 
        }
      } catch (error) {
        window.location.href = "/login";
      }
    };
    
    fetchUser();
    const interval = setInterval(()=>{
      fetchUser();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="col-3 mt-5 scrollable-column" style={{ height: "100vh" }}>

      <div className="avatar-logo">
        <div className="d-flex justify-content-center align-items-center">
          <Image
            src={"/facebook.png"}
            alt="logoavt"
            width={100}
            height={100}
          ></Image>
        </div>
        <h5 className="text-dark text-center mt-3">{user?.username}</h5>
        <p className="email text-dark text-center">{user?.email}</p>
      </div>

      <div className="navigation mt-4">
        <div style={{ padding: "10px" }} className="mt-3 ms-3">
          <Link className="text-dark" href={`/profile?q=${user?.userId}`}>
            My Profile
          </Link>
        </div>

        <div
          className="ms-3 mt-3"
          style={{
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "lavender",
          }}
        >
          <Link className="text-dark" href={"/"}>
            News Feed
          </Link>
        </div>

        <div style={{ padding: "10px" }} className="mt-3 ms-3">
          <SearchInfoProfile/>
          <CanvasSearch/>
        </div>   


        <div style={{ padding: "10px" }} className="mt-3 ms-3">
          <OpenCanvas />
          <OffCanvasMessagePage />
        </div>

        <div style={{ padding: "10px" }} className="mt-3 ms-3">
          <Link className="text-dark" href={"/friends"}>
            Friends
          </Link>
        </div>

        <Logout />
      </div>
    </div>
  );
};

export default Navigation;
