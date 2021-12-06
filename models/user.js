const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema  = new mongoose.Schema({
  username :{
      type  : String,
      
  } ,
  email :{
    type  : String,
    
} ,
password :{
    type  : String,
    
} ,
date :{
    type : Date,
    default : Date.now
}
});

UserSchema.plugin(passportLocalMongoose);
const User= mongoose.model('User',UserSchema);

module.exports = User;