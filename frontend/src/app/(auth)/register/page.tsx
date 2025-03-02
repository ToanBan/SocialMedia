'use client'

import React, { useState } from 'react'
import x from '../auth.module.css'
import Link from 'next/link'
import Image from 'next/image'
const RegisterPage = () => {
    const [alert, setAlert] = useState(false);


    const handleRegister = async(e:React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const username = (form.elements.namedItem('username') as HTMLFormElement).value
        const email = (form.elements.namedItem('email') as HTMLFormElement).value
        const password = (form.elements.namedItem('password') as HTMLFormElement).value
        const cfnpassword = (form.elements.namedItem('cfnpassword') as HTMLFormElement).value
        const res = await fetch('http://localhost:3001/register', {
            method:"POST", 
            body:JSON.stringify({username, email, password, cfnpassword}), 
            headers:{
                'Content-Type' : 'application/json'
            }
            
        })
        const data = await res.json();
        console.log(data);
        setAlert(true);
        setTimeout(()=> {
            setAlert(false);
        }, 3000)
        
    }


    console.log(alert);

  return (
    <>
        <div className="container position-relative">
            <div className="form-l-r d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
                <div className="frm-login-img bg-danger" style={{height:"600px", width:"450px", borderTopLeftRadius:"10px", borderBottomLeftRadius:"10px"}}>
                    <Image 
                    src={'/scenery.jpg'} alt='imageLogin' width={450} height={600} style={{objectFit:"cover"}}></Image>
                </div>

                <div className="frm-login bg-light" style={{height:"600px", width:"450px", borderTopRightRadius:"10px", borderBottomRightRadius:"10px"}}>  
                  <div className="p-5">
                  <h2 className='text-dark text-center' style={{fontWeight:"bolder"}}>Create an Account</h2>
                  <div className="register-third d-flex justify-content-between mt-3">
                        <div className='me-3 border' style={{borderRadius:"3px"}}>
                            <div className='d-flex justify-content-around align-items-center' style={{width:"160px", padding:"12px"}}>
                                <Image src={'/register.png'} alt='iconsocial' width={20} height={20}></Image>
                                <p className='m-0 text-dark'>Register</p>
                            </div>
                        </div>

                        <div className='border' style={{borderRadius:"3px"}}>
                            <div className='d-flex justify-content-around align-items-center' style={{width:"160px", padding:"12px"}}>
                                <Image src={'/fund.png'} alt='iconsocial' width={20} height={20}></Image>
                                <p className='m-0 text-dark'>Account</p>
                            </div>
                        </div>
                  </div>     
                  <div className='register-account mt-3'>
                        <form onSubmit={handleRegister}>
                            <div className='position-relative mt-3'>
                                <input className='form-control' type="text" placeholder='Username' name='username' id='username'/>
                                <Image className={x.followInputImage} src={'/user.png'} alt='usernamelogo' width={30} height={30}></Image>
                            </div>

                            <div className='position-relative mt-3'>
                                <input className='form-control' type="email" placeholder='Email' name='email' id='email'/>
                                <Image className={x.followInputImage} src={'/email.png'} alt='logoemail' width={30} height={30}></Image>
                            </div>

                            <div className='position-relative mt-3'>
                                <input className='form-control' type="password" placeholder='password' name='password' id='password'/>
                                <Image className={x.followInputImage} src={'/lock.png'} alt='logopasword' width={30} height={30}></Image>
                            </div>

                            <div className='position-relative mt-3'>
                                <input className='form-control mt-3' type="password" placeholder='confirm password' name='cfnpassword' id='cfnpassword'/>
                                <Image className={x.followInputImage} src={'/lock.png'} alt='cfnlogolock' width={30} height={30}></Image>
                            </div>

                            <div className='mt-4'>
                              <button className={x.button}>Create an Account</button>
                            </div>
                        </form>
                  </div>      
                  

                  
                  <div className='mt-5 d-flex justify-content-center'>
                    <p style={{color:"#ccc"}}>Already have an account?
                        <Link href={'/login'} className={x.textBlue}>
                            <span className='ms-2'>Log in</span>
                        </Link></p>
                  </div>
                  </div>
                         
                </div>
            </div>
        </div>
        <div className={`alert alert-primary ${alert ? x.openAlert : x.hideAlert}`} role="alert">
            Đăng Ký Thành Công
        </div>

    </>
  )
}

export default RegisterPage
