import Image from 'next/image'
import Button from './button'
import Link from 'next/link'
import x from './profile.module.css'
import Addbutton from './post/addbutton'
import GetPost from '../../../_action/getpost'
import ButtonEditProfile from './buttoneditprofile'
import ButtonDeletePost from './buttondeletepost'
import UpdateProfile from '../../../_action/updateprofile'
import Buttonmessage from './buttonmessage'
interface PostProps{
    _id:string, 
    title:string,
    image:string
}


const ProfilePage = async({ searchParams }: { searchParams: { q?: string } }) => {
  const userId = searchParams.q ?? ''
  const url = 'http://localhost:3001/uploads/';
  const data = await GetPost(userId);
  const infouser = await UpdateProfile();
  
  return (
    <>
        <div style={{width:"100%", height:"200px", backgroundColor:"#720979"}} className=' position-relative'></div>
        <div className={`${x.moveContainerProfile}`}>
            <div className='d-flex gap-4 align-items-center' style={{marginTop:"100px"}}>
                <div>
                    <Image src={`http://localhost:3001/uploads/profile/${infouser.userCurrent.image.replace("uploads\\profile\\", "")}`}
                        alt='profile'
                        width={250}
                        height={250}
                        style={{objectFit:"cover", borderRadius:"30px"}}        
                    ></Image>
                </div>

                <div className="info-profile" style={{minWidth:"400px", maxWidth:"500px"}}>
                    <div className='d-flex gap-5 mb-3'>
                        <h3 className='text-dark' style={{fontWeight:"bolder"}}>{infouser?.userCurrent?.username}</h3>
                        <ButtonEditProfile/>
                    </div>
                    <p className='m-0 text-dark'>{infouser?.userCurrent?.description}</p>
                    <div className='d-flex gap-3 mt-3'>
                        <Button bg='black' color='white'/>
                        <Buttonmessage/>
                    </div>
                </div>

                <div className="follower d-flex gap-5 justify-content-center">
                    <div>
                        <p className='text-dark'>Follower</p>
                        <h5 className='fw-bolder text-dark fs-2'>{infouser.userCurrent.follower.length}</h5>
                    </div>

                    <div>
                        <p className='text-dark'>Following</p>
                        <h5 className='fw-bolder text-dark fs-2'>{infouser.userCurrent.following.length}</h5>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <div>
                    <Link className='text-dark' href={'/profile'}>Posts</Link>
                </div>

                <Addbutton/>

            </div>

            <div className="mt-5">
                <div className="d-flex row">
                    {data.map((post:PostProps) => (
                        <div key={post._id} className='col-md-4 border shadow mb-3 position-relative' style={{borderRadius:"30px"}}>
                            <Link href={`/profile/post/${post._id}`}>
                            <Image 
                                src={`${url}${post.image.replace(/^uploads[\\/]/, '')}`} 
                                style={{ borderRadius: "10px", objectFit: "contain" }} 
                                alt="post" 
                                height={250} 
                                width={250} 
                                />

                                    <p className='m-0 text-dark'>{post.title}</p>
                            </Link>
                            <ButtonDeletePost id={post._id}/>           
                    </div>
                    )
                    )}    
                </div>
            </div>
        </div>
    </>
  )
}

export default ProfilePage
