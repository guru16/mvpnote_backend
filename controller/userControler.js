const mongoose = require('mongoose');
const Users = require('../models/userModel');
const auth = require('../auth/jwt');
const template = require('../services/mail/mailTemplates');
const userModel = mongoose.model('Users');
const multer = require('multer');
const storage = require('../config/multerConfig');
require("dotenv").config();
const bcrypt = require('bcrypt');

const ObjectId = mongoose.Types.ObjectId;


const url = 'http://localhost:3000/uploads/';

var singleUpload = multer({ storage: storage.storage }).single('file'); // for single file upload


class userController{
    async register(req){
        return new Promise(function(resolve, reject) { 
        const registerData = req.body;
        if (registerData.email !== undefined && registerData.email !== ''){
            let users = new userModel();
              return userModel.find({email:registerData.email}).then(resp => {
                if(resp.length>0){
                 return resolve({  message: 'Email already exsist', success: false, data: {} });
                }else{
                    users.email=registerData.email;
                    users.userName=registerData.name
                    users.setPassword(registerData.password);
                     users.save(async (err, resp) => {
                         console.log("users",users)

                        let token =   await auth.signJWT({ uid: resp._id, t: 'USER'});
                            users.token=token;
                            return users.save()
                            .then(userSaved =>{
                                return resolve ({ status: 200, success: true, data: userSaved, token: token });

                            });

                    })
                    


                }
            })

        }else {throw 'invalid email';}
    })
    }

    async login(req ){
        
        let loginData=req.body
        
        if (loginData.email !== undefined && loginData.email !== '' && loginData.password !== undefined && loginData.password !== ''){
            let user = await userModel.findOne({email:loginData.email});
            if(user){
                let validPassword = await user.validatePassword(loginData.password,user.hash);
                console.log(validPassword)
                if(validPassword){
                    let token = await auth.signJWT({ uid: user._id, t: 'USER'});
                    user.token=token;
                    return user.save()
                    .then(userSaved =>{
                        return  ({ status: 200, success: true, data: userSaved, token: token });

                    });

                }else{
                    return ({ status: 400, message: 'Invalid Password', success: false, data: {} });
                }
            }else
            {
                return({ status: 400, message: 'Invalid Email', success: false, data: {} });
            }
        }
        else{
           return({  status: 400, message: 'not valid'});

        }
    }

    async socialLogin(req){
        var socialData=req.body;
        if(socialData.authToken && socialData.email && socialData.firstName ){
            
            let user = await userModel.findOne({email:socialData.email});
                if(user){
                    console.log(user._id)
                    user.token = await auth.signJWT({ uid: user._id, t: 'USER'});
                    console.log(user.token)
                    return user.save()
                    .then(userSaved =>{
                        return  ({ status: 200, success: true, data: userSaved, token: userSaved.token });

                    })
                    .catch(err=>{
                        console.log("err",err)
                        return  ({ status: 400, success: false, message:"something went wrong" });
                    })
                    

                }else{
                let users = new userModel();

                    users.email=socialData.email

                    users.firstName=socialData.firstName
                    users.lastName=socialData.lastName;
                    users.socialLogin=socialData.provider?socialData.provider:'';
                   let userData = await users.save();
                   if(userData){
                    users.token = await auth.signJWT({ uid: userData._id, t: 'USER'});                       

                    return  users.save()
                    .then(async(userSaved) =>{
                        console.log(userSaved)

                        return  ({ status: 200, success: true, data: userSaved, token: userSaved.token });

                    })
                    .catch(err=>{
                        console.log("error")
                    })
                   }
                    
                   
                }
            

        }else{
            return({  status: 400, message: 'not valid'});

        }
    }

    async sendLink(req){

        if(req.body.email){
            let user = await userModel.findOne({email:req.body.email});
            console.log(user)

            if(user){
                console.log(user)
                let resetLink=`http://localhost:4200/reset-password/${user._id}`;
                let data={
                    email:req.body.email,
                    url:resetLink
                };
                return template.sendVerificationMail(data).then(resp=>{
                    return  ({ status: 200, success: true, message: "Email sent", });
                })
                .catch(errr=>{
                    console.log("...",errr)
                })

            }
            else{
                return  ({ status: 400, success: false, message: "Email not exsist", });

            }

        }

    }

    async resetPassword(req) {
    
            const resetData = req.body;
            // validating user req
            if(resetData.password !== undefined && resetData.password !== ''){
                console.log(".......1",resetData._id)

                let userId = resetData._id ? resetData._id : null;
                let user = await userModel.findOne({_id:userId});
                if(user)
                {    
                    user.setPassword(resetData.password);
                    return user.save().then(resp =>{
                        console.log(resp)
                        return  ({ status: 200, success: true, messag:"password changed successfully" });
                    
                    }).catch(err =>{
                        return (err);
                    });
                }else
                {
                    return ({ status: 400, message: 'Invalid User', success: false, data: {} });
                }
       
            }
            
    }
    async updateProfile(req) {
        try {
            const editData = req.body;
            // validating user req
            let userId = req.userId ? req.userId : null;

            let user = await userModel.findOne({_id:userId});
            if(user)
            {
                Object.entries(editData).map(entry => {
                    console.log(entry[0],)
                    let key = entry[0];
                    let value = entry[1];
                    user[key]=value;
                });
                return user.save().then(resp =>{
                    return ({ status: 200, message: 'Update successfully', success: true, data: resp });
                }).catch(err =>{
                    return (err);
                });
            }else
            {
                return ({ status: 400, message: 'Invalid User', success: false, data: {} });
            }
        } catch (error) {
            return (error);
        }
    }

    async uploadImage(req, res, next) {
        console.log(req.userId)

        try {
            return new Promise(async (resolve, reject) => {

            
            return  singleUpload(req, res, function (err) {

                if (err instanceof multer.MulterError) {
                    return resolve ({ status: 500, message: err, url:'', success:false });
                } else if (err) {

                    return resolve ({ status: 500, message: err, url:'', success:false});
                }
                let fileName=req.file ? req.file.filename : null;
              // let link =`${url}${fileName}`;
                if(fileName){
                    var userId =  ObjectId(req.userId);
                    var path = `/uploads/${fileName}`;
                    var update = {
                      "profileImage": path,
                      "profileImageName": fileName,
                    };
                     userModel.updateOne({ _id: userId }, { $set: update }).then(result=>{
                         console.log(result)
                        if (result.nModified) {
                            return resolve({  status: 200,profileImage: path, message: "update successfully" });
                          } else {
                            return resolve ({ status: 400, message: "Unable to update profile pic!" });
                          }
                     }).catch(err=>{
                        return reject ({ status: 500, message: "internal error" });

                     })
                    
                    
                }else
                {
                    return reject({ status: 500, message: 'File not found', url:'', success:false});
                }
            });
        })
        } catch (error) {
            console.log(error)
            return next(error);
        }
    }

    async getUserData(req){
        return new Promise(async (resolve, reject) => {

        if(req && req.userId){
            
             userModel.findOne({ _id:ObjectId(req.userId) }).then(resp=>{
                 
                if(resp.profileImage){                    
                    resp.profileImage = process.env.BASE_URl+resp.profileImage
                    return resolve ({status:200,message:"success",result:resp,success:true})
                }else{
                    return resolve ({status:200,message:"success",result:resp,success:true})
                }


            }).catch(err=>{
                console.log(err)
                return ({status:500,message:"internal error", success:"false"})
            })

        }else{
            return ({status:400,message:"variable is empty", success:"false"})

        }
    })

    }
    async removeImage(req){
        return new Promise(async (resolve, reject) => {

        if(req.body && req.body.userId ){
            var userId =  ObjectId(req.body.userId);

            var update = {
                "profileImage": null,
                "profileImageName": null
              };
              console.log(userId,update)
                 userModel.updateOne({ _id: userId }, { $unset: update }).then(result=>{
                   console.log(result)
                  if (result.nModified) {
                      return resolve ({  status: 200, message: "remove successfully",success:true });
                    } else {
                      return resolve ({ status: 400, message: "unable to remove" });
                    }
               }).catch(err=>{
                   console.log(err)
                  return reject ({ status: 500, message: "internal error" });

               })
              

        }else{

        }
    })
    }

    async updatePassword(req) {
    
        const resetData = req.body;
        // validating user req
        if(resetData.password !== undefined && resetData.password !== ''){

            let userId = req.userId ? req.userId : null;
            let user = await userModel.findOne({_id:userId});
            if(user)
            {    
                user.setPassword(resetData.password);
                return user.save().then(resp =>{
                    console.log(resp)
                    return  ({ status: 200, success: true, messag:"password update successfully" });
                
                }).catch(err =>{
                    return (err);
                });
            }else
            {
                return ({ status: 400, message: 'Invalid User', success: false, data: {} });
            }
   
        }
        
}

    

}

module.exports = new userController();