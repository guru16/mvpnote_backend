var express = require('express');
var router = express.Router();
const userController = require('./../controller/userControler.js');
const notesController =require('./../controller/notesController')
const authMiddleware=require('../auth/auth');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', function(req, res, next) {
  console.log(req.body)
  return userController.register(req)
  .then((resp) => {
    res.send(resp);
  })
  .catch(err=>{
    res.status(500).send(err)

  })
});

router.post('/login', function(req, res, next) {
   userController.login(req)
  .then((resp) => {
    res.send(resp);
  })
  .catch(err=>{
    res.status(500).send(err)

  })
});
router.post('/socialLogin', function(req, res, next) {
  userController.socialLogin(req)
 .then((resp) => {
   res.send(resp);
 })
 .catch(err=>{
   res.status(500).send(err)

 })
});

router.post('/forgetPassword',function(req,res,next){
   return userController.sendLink(req)
  .then((resp)=>{
    res.send(resp);

  })
  .catch(err=>{
    res.status(500).send(err)

  })

})

router.post('/resetPassword',function(req,res,next){
  userController.resetPassword(req)
 .then((resp)=>{
  res.send(resp);

 })
 .catch(err=>{
  res.status(500).send(err)

})

})
router.post('/editProfile',authMiddleware.authenticateJWT,function(req,res,next){
    userController.updateProfile(req)
    .then((resp)=>{
    res.send(resp);

    })
    .catch(err=>{
      res.status(500).send(err)

    })

})
router.post('/uploadImage', authMiddleware.authenticateJWT,function(req,res,next){
  console.log(req.userId)

  userController.uploadImage(req)
  .then((resp)=>{
  res.send(resp);

  })
  .catch(err=>{
    res.status(500).send(err)

  })

})
router.get('/getUser',authMiddleware.authenticateJWT,function(req,res,next){
  console.log("enter")
  userController.getUserData(req)
  .then((resp)=>{
  res.send(resp);
  })
  .catch(err=>{
    res.status(500).send(err)

  })

})

router.delete('/removeImage',function(req,res,next){

  userController.removeImage(req)
  .then((resp)=>{
    res.send(resp)
  })
  .catch(err =>{
    res.status(500).send(err)

  })
})

router.post('/updatePassword',authMiddleware.authenticateJWT,function(req,res,nex){
  userController.updatePassword(req)
  .then((resp)=>{
    res.send(resp);
  })
  .catch(err=>{
    res.status(500).send(err)

  })

})

router.post('/createSubject',authMiddleware.authenticateJWT,function(req,res,next){
  console.log(req.userId);
  return notesController.createSubject(req)
  .then((resp)=>{
    res.send(resp);
  })
  .catch(err=>{
    res.status(500).send(err)

  })

  
})

router.post('/updateSubject',authMiddleware.authenticateJWT,function(req,res,next){
  console.log(req.userId);
  return notesController.updateSubject(req)
  .then((resp)=>{
    res.send(resp);
  })
  .catch(err=>{
    res.status(500).send(err)

  })

  
})

router.post('/searchSubject',authMiddleware.authenticateJWT,function(req,res,next){
  return notesController.findSubject(req)
  .then((resp)=>{
    res.send(resp);

  }).catch(err=>{
    res.status(500).send(err)

  })
  

})

router.get('/getSubjects',authMiddleware.authenticateJWT,function(req,res,next){
  return notesController.getSubjects(req)
  .then((resp)=>{
    res.send(resp);
  }).catch(err=>{
    res.status(500).send(err)

  })
  

})

router.get('/getNotesBySubject/:subjectId',authMiddleware.authenticateJWT,function(req,res,next){
  console.log(req.params)
  return notesController.getNotesBySubject(req.params.subjectId)
  .then((resp)=>{
    res.send(resp);

  }).catch(err=>{
    res.status(500).send(err)

  })

})

router.get('/getNotes',authMiddleware.authenticateJWT,function(req,res,next){
  return notesController.getNotes(req)
  .then((resp)=>{
    res.send(resp);

  }).catch(err=>{
    res.status(500).send(err)

  })
})
router.post('/createNotes',authMiddleware.authenticateJWT,function(req,res,next){
   notesController.createNotes(req)
  .then((resp)=>{
    console.log(resp)
    res.send(resp);

  }).catch(err=>{
    res.status(500).send(err)

  })
})
router.get('/saveNotes',function(req,res,next){
  return notesController.saveNotes(req)
  .then((resp)=>{
    res.send(resp);

  }).catch(err=>{
    res.status(500).send(err)

  })
})

router.delete('/deleteSubject/:id',function(req,res,next){
  notesController.deleteSubject(req.params.id)
  .then((resp)=>{
    res.send(resp)
  })
  .catch(err =>{
    res.status(500).send(err)

  })
})
router.delete('/deleteNotes/:id',function(req,res,next){
  notesController.deleteNotes(req.params.id)
  .then((resp)=>{
    res.send(resp)
  })
  .catch(err =>{
    res.status(500).send(err)

  })
})

module.exports = router;
