const mongoose = require('mongoose');

const url = process.env.MONGODB_URI
const ConnectDB = async() => {
  try{
    await mongoose.connect(url, {
      ssl:true, 
    });
    console.log('Connected Database')
  }catch(error){
    console.error('database failed', error)
  }
}

module.exports = ConnectDB;