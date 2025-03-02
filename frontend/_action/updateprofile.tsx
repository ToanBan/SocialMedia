import { cookies } from "next/headers";

const UpdateProfile = async() => {
  const token = (await cookies()).get('token')?.value; 
const res = await fetch('http://localhost:3001/infouser', {
  method: "GET",
  credentials: "include",  
  headers: {
    Cookie: `token=${token}`
  }
});
  const data = await res.json();
  return data;
}

export default UpdateProfile
