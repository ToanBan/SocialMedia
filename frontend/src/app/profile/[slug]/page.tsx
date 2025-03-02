import x from '../profile.module.css'
import Image from 'next/image';
import ButtonEditProfile from '../buttoneditprofile';
import ButtonDeletePost from '../buttondeletepost';
import Link from 'next/link';
import Addbutton from '../post/addbutton';
import GetPost from '../../../../_action/getpost';
import Buttonmessage from '../buttonmessage';
import UpdateProfile from '../../../../_action/updateprofile';
import FollowButton from '../followbutton';
import GetProfile from '../../../../_action/getprofile';
interface PostProps{
  _id:string, 
  title:string,
  image:string
}


const ProfileDetail = async({params}:{params:Promise<{slug:string}>}) => {
  const id = (await params).slug;
  const url = 'http://localhost:3001/uploads/';
  const res = await fetch(`http://localhost:3001/profile/${id}`, {
    method:"GET", 
    headers:{
      'Content-Type': 'application/json'
    }, 
    cache:"no-store"
  })

  const data = await res.json();
  const posts = await GetPost(id);
  const follower = await data.message.follower;
  const countFollower = follower.length;
  const following = await data.message.following;
  const countFollowing = following.length
  const authencationUser = await UpdateProfile();
  const userAuthencationId = authencationUser.userCurrent._id
  return (
    <>
        <div style={{width:"100%", height:"200px", backgroundColor:"#720979"}} className=' position-relative'></div>
        <div className={`${x.moveContainerProfile}`}>
            <div className='d-flex gap-4 align-items-center' style={{marginTop:"100px"}}>
                <div>
                    <Image src={`http://localhost:3001/uploads/profile/${data.message.image.replace("uploads\\profile\\", "")}`}
                      alt='profile'
                      width={250}
                      height={250}
                      style={{objectFit:"cover", borderRadius:"30px"}}        
                    ></Image>
                </div>

                <div className="info-profile" style={{minWidth:"400px", maxWidth:"500px"}}>
                    <div className='d-flex gap-5 mb-3'>
                        <h3 className='text-dark' style={{fontWeight:"bolder"}}>{data?.message?.username}</h3>
                    </div>
                    <p className='m-0 text-dark'>{data?.message?.description}</p>
                    <div className='d-flex gap-3 mt-3'>
                        <FollowButton  bg='black' color='white' id={id} userId={userAuthencationId}/>
                        <Buttonmessage/>
                    </div>
                </div>

                <div className="follower d-flex gap-5 justify-content-center">
                    <div>
                        <p className='text-dark'>Follower</p>
                        <h5 className='fw-bolder text-dark fs-2'>{countFollower}</h5>
                    </div>

                    <div>
                        <p className='text-dark'>Following</p>
                        <h5 className='fw-bolder text-dark fs-2'>{countFollowing}</h5>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <div>
                    <Link className='text-dark' href={'/profile'}>Posts</Link>
                </div>


            </div>

            <div className="mt-5">
                <div className="d-flex row">
                    {posts.map((post:PostProps) => (
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

export default ProfileDetail
