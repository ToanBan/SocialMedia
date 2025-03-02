'use client'

import React from 'react'
import x from '../auth.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
const LoginPage = () => {
    const router = useRouter();

    const handleLogin = async(e:React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLFormElement).value;
        const password = (form.elements.namedItem('password') as HTMLFormElement).value;
        const res = await fetch('http://localhost:3001/login', {
            method:"POST", 
            headers:{
                'Content-Type' : 'application/json'
            }, 
            body:JSON.stringify({email, password}), 
            credentials:'include'
        })
        const data = await res.json();
        console.log(data);
        if(data.token){
            router.push('/')
        }


    }
  

  return (
    <>
        <div className="container">
            <div className="form-l-r d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                <div className="frm-login bg-light" style={{height:"600px", width:"450px", borderTopLeftRadius:"10px", borderBottomLeftRadius:"10px"}}>
                    <div className='p-5'>
                    <div className='d-flex align-items-center '>
                        <Image src={'/logo.png'} alt='logo' width={30} height={30}></Image>
                        <p className={`ms-3 ${x.textBlue} mb-0`}>BanSocialMedia</p>
                    </div>
                    
                    <div className='mt-3'>
                        <h2 className='text-dark' style={{fontWeight:"bolder"}}>Log in to your Account</h2>
                        <p style={{color:"#ccc"}}>Welcome back! Select method to log in</p>
                    </div>

                    <div className="login-third d-flex justify-content-between">
                        <div className='me-3 border' style={{borderRadius:"3px"}}>
                            <div className='d-flex justify-content-around align-items-center' style={{width:"160px", padding:"12px"}}>
                                <Image src={'/search.png'} alt='iconsocial' width={20} height={20}></Image>
                                <p className='m-0 text-dark'>Google</p>
                            </div>
                        </div>

                        <div className='border' style={{borderRadius:"3px"}}>
                            <div className='d-flex justify-content-around align-items-center' style={{width:"160px", padding:"12px"}}>
                                <Image src={'/facebook.png'} alt='iconsocial' width={20} height={20}></Image>
                                <p className='m-0 text-dark'>Facebook</p>
                            </div>
                        </div>
                    </div>

                    <p className='mt-3' style={{color:"#ccc"}}>Or continue with account</p>

                    <div className='login-account'>
                        <form onSubmit={handleLogin}>
                            <div className='position-relative'>
                                <input className='form-control' type="email" placeholder='Email' name='email' id='email'/>
                                <Image className={x.followInputImage} src={'/email.png'} alt='logoemail' width={30} height={30}></Image>
                            </div>

                            <div className='position-relative'>
                                <input className='form-control mt-3' type="password" placeholder='password' name='password' id='password'/>
                                <Image className={x.followInputImage} src={'/lock.png'} alt='logolock' width={30} height={30}></Image>
                            </div>


                            <div className='mt-3'>
                                <button className={x.button}>Log in</button>
                            </div>
                        </form>
                    </div>

                    <div className='mt-3 d-flex justify-content-end'>
                        <p style={{color:"#007FFF"}}>Forgot password?</p>
                    </div>

                    

                    <div className='mt-3'>
                        <p style={{color:"#ccc"}}>Don't have an acount?
                        <Link href={'/register'} className={x.textBlue}>
                            <span className='ms-2'>Create an account</span>
                        </Link></p>
                    </div>
                    </div>
                </div>

                <div className="frm-login-img bg-danger" style={{height:"600px", width:"450px", borderTopRightRadius:"10px", borderBottomRightRadius:"10px"}}>
                    <Image 
                    src={'/imagelogin.jpg'} alt='imageLogin' width={450} height={600} style={{objectFit:"cover"}}></Image>
                </div>
            </div>
        </div>
    </>
  )
}

export default LoginPage
