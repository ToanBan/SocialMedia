const { Schema } = require("mongoose");
const mongoose = require('mongoose');

const PostSchema = new Schema({
    title:String, 
    image:String, 
    likes:[{
        type:Schema.Types.ObjectId, 
        ref:'User'
    }]
})


const UserSchema = new Schema({
    username:{
        type:String, 
    },

    email:{
        type:String
    },

    password:{
        type:String
    }, 

    image:{
        type:String, 
        default:'uploads\\profile\\default.jpg'
    }, 

    follower: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }], 

    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    description:{
        type:String,
        default:'Giới Thiệu Về Bản Thân?'
    }, 
    
    posts:[PostSchema]
})

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;


