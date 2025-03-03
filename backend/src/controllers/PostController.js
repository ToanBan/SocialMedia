const jwt = require('jsonwebtoken');
const User = require('../models/user');
const fs = require('fs');

exports.AddPost = async(req, res) => {
    const {title} = req.body;
    const token = req.cookies.token;
    const image = req.file;
    if(!token){
        return res.json({
            message:"Không thể thực hiện thao tác này"
        })
    }

   if(!image){
         return res.json({
              message:"Hãy chọn ảnh"
         })
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    if(!decoded){
        return res.json({
            error:"Token không dúng"
        })
    }

    const userId = decoded.userId;

    const updatePostUser = await User.findById(userId);
    const newPost = {title:title, image:image.path};
    updatePostUser.posts.push(newPost);
    await updatePostUser.save();
    return res.json({
        message:updatePostUser
    })
}

exports.GetPost = async (req, res) => {
    const userId = req.query.q;
    const data = await User.findById(userId);
    return res.json({message:data.posts});
};

exports.DeletePost = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        if (!decoded.userId) {
            return res.status(401).json({ error: "Token không đúng" });
        }
        const postId = req.params.id;
        const userCurrent = await User.findById(decoded.userId);
        const ImageDelete = await userCurrent.posts.find((post) => post._id.toString() == postId);
        fs.unlink(ImageDelete.image, (error)=> {
            if(error){
                return res.json({
                    error:"Lỗi khi xóa ảnh"
                })
            }else{
                console.log("Xóa ảnh thành công")
            }
        })
        userCurrent.posts = userCurrent.posts.filter((post) => post._id.toString() !== postId);
        await userCurrent.save();

        return res.json({
            imagePath: ImageDelete.image
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Lỗi server" });
    }
};

