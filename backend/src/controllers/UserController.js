const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const cache = new NodeCache();
const mongoose = require('mongoose')
exports.UserRegister = async(req, res) => {
    const {username, email, password, cfnpassword} = req.body;

    if(!username || !email || !password || !cfnpassword){
        return res.json({
            error:'Invalid Field'
        });
    }

    if(password !== cfnpassword){
        return res.json({
            error:'password and confirm password have same'
        })
    }


    const existUser = await User.findOne({email:email});
    if(existUser){
        return res.json({
            error:'User exists'
        })
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username, 
        email,
        password:hashpassword
    })



    return res.json({
        message:newUser, 
        success:true
    })
}


exports.UserLogin = async(req, res) => {
    const {email, password} = req.body;

    const authencationUser = await User.findOne({email});

    if(!authencationUser){
        return res.json({
            message:"User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, authencationUser.password);

    if(!isPasswordValid){
        return res.json({
            message:"Invalid Password"
        })
    }

    const token = jwt.sign(
        {userId:authencationUser._id, email:authencationUser.email, username:authencationUser.username}, 
        process.env.JWT_ACCESS_TOKEN, 
        {expiresIn:"30m"}
    )

    const refreshToken = jwt.sign(
        {userId:authencationUser._id, email:authencationUser.email, username:authencationUser.username}, 
        process.env.JWT_REFRESH_TOKEN, 
        {expiresIn:"1d"}
    )

    cache.set(authencationUser._id.toString(), refreshToken);

    res.cookie('token', token, {
        httpOnly: true,    
        secure: false,    
        sameSite: 'Lax',   
        path: '/'
    });
     res.cookie('refreshToken', refreshToken, {
        httpOnly: true,    
        secure: false,    
        sameSite: 'Lax',
        path: '/'
    })
  
    return res.json({
        message:authencationUser,
        token:token,
        refreshToken:refreshToken, 
    })
}


exports.UserLogout = async(req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        path: '/'
    });


    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        path: '/'
    });
    return res.json({
        message:'Logout Success', 
        success:true
    })
}

exports.GetUser = async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token,'secretkey123456789');
    const userId = decoded.userId;
    const { username, email } = req.user;


    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    return res.json({ username, email, userId, token});
};

exports.RefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.json({ message: 'Refresh token not found' });
    }

    try{
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
        const cachedToken = cache.get(decoded.userId);

        if(cachedToken !== refreshToken){
            return res.json({
                message:'Invalid Refresh Token'
            })
        }

        const newAccessToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email, username: decoded.username}, 
            'secretkey123456789',
            {expiresIn:"30m"}
        )

        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            path: '/'
        })

        return res.json({
            message:'Refresh Token Success',
            token:newAccessToken
        })  
    }catch(err){
        return res.json({
            message:err
        })
    }
}


exports.EditProfile = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập" });
        }
        const decoded = jwt.verify(token, 'secretkey123456789');
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        const updateData = {
            username: req.body.username || user.username,
            description: req.body.title || user.description,
            image: req.file ? req.file.path : user.image
        };
        const userUpdate = await User.updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: updateData }
        );
        return res.json({
            message: "Cập nhật thành công",
            data: userUpdate
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật hồ sơ:", error);
        return res.status(500).json({ message: "Có lỗi xảy ra" });
    }
};

exports.GetInfoProfile = async(req, res) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({message:'không có token'})
    }
    const decoded = jwt.verify(token,'secretkey123456789');
    const userId = decoded.userId;
    if(!userId){
        return res.json({
            error:"Xác thực không thành công"
        })
    }

    const userCurrent = await User.findById(userId);
    return res.json({
        userCurrent
    })
}


exports.SearchProfile = async(req, res) => {
    const {search} = req.body;
    const resultsProfule = await User.find({username:{$regex:search, $options:"i"}});
    return res.json({
        message:resultsProfule
    })
}

exports.ProfileDetail = async(req, res) => {
    const id = req.params.id;
    const profileDetail = await User.findById(id);
    return res.json({
        message:profileDetail
    })
}

exports.UserFollowing = async (req, res) => {
    try {
        const { follow, userProfile } = req.body;
        const token = req.cookies.token;
        const decoded = jwt.verify(token, 'secretkey123456789');
        const userId = decoded.userId;

        if (!userId) {
            return res.json({ error: "Xác Thực Không Thành Công" });
        }

        const userFollowing = await User.findById(userId);
        const userFollower = await User.findById(userProfile);

        if (!userFollowing || !userFollower) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        if (follow === true) {
            if (!userFollowing.following.includes(userProfile)) {
                userFollowing.following.push(userProfile);
                await userFollowing.save();
            }
            if (!userFollower.follower.includes(userId)) {
                userFollower.follower.push(userId);
                await userFollower.save();
            }
            return res.json({ message: "Theo Dõi Thành Công", userProfile, userId});
        } else {
            userFollowing.following = userFollowing.following.filter(id => id.toString() !== userProfile);
            await userFollowing.save();

            userFollower.follower = userFollower.follower.filter(id => id.toString() !== userId);
            await userFollower.save();

            return res.json({ message: "Hủy Theo Dõi Thành Công" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Lỗi Server" });
    }
};


exports.PostFollowing = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, 'secretkey123456789');
        const userId = decoded.userId;

        if (!userId) {
            return res.json({ error: "Xác thực không thành công" });
        }

        const userAuthencation = await User.findById(userId).populate({
            path: 'following',
            select: 'username image posts'
        });

        const postsWithUser = userAuthencation.following.flatMap(user =>
            user.posts.map(post => ({
                _id: post._id,
                title: post.title,
                image: post.image,
                username: user.username, 
                userImage: user.image, 
                likes: post.likes, 
                
            }))
        );

        

        return res.json({ posts: postsWithUser});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Lỗi server" });
    }
};

exports.UserLikePost = async(req, res) => {
    const {id} = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token , 'secretkey123456789');
    const userId = decoded.userId;
    if(!userId){
        return res.json({
            error:"Xác thực không thành công"
        })
    }
    const user = await User.findOne({'posts._id': new mongoose.Types.ObjectId(id)})
    const PostLiked = user.posts.find((post) => post._id.toString() === id);
    if(PostLiked.likes.includes(userId)){
        PostLiked.likes = PostLiked.likes.filter((prev) => prev.toString() !== userId);
        user.markModified('posts');
            await user.save();
            return res.json({ message: "Bỏ Like Thành Công", success: false, userId:userId, userLiked:PostLiked.likes});
    }
    PostLiked.likes.push(userId);
    user.markModified('posts');
    await user.save();
    return res.json({
        success:true, 
        userId:userId, 
        userLiked:PostLiked.likes, 
        posts:id, 
    })
}

exports.UserChatFollowing = async(req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, 'secretkey123456789');
    const userId = decoded.userId;
    if(!userId){
        return res.json({
            error:"Xác Thực Không Thành Công"
        })
    }
    const userAuthencation = await User.findById(userId).populate('following');
    const userFollowing = userAuthencation.following
    return res.json({
        message:userAuthencation
    })
}

exports.UserChatFollowingDetail = async(req, res,) => {
    const userId = req.params.id;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, 'secretkey123456789');
    const authencationUser = decoded.userId;
    if(!authencationUser){
        return res.json({
            error:"Xác thực không thành công"
        })
    }

    const userToChat = await User.findById(userId)
    if(!userId){
        return res.json({
            message:"Không Có Người Dùng"
        })
    }

    return res.json({
        message:userToChat
    })


}







