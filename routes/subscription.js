var express = require('express');
var router = express.Router();
const subscriptionController = require('./../controller/subscriptionController');
const authMiddleware=require('../auth/auth');

/* GET home page. */
router.post('/createSubscription', function(req, res, next) {
  return subscriptionController.createPlan(req)
  .then((resp) => {
    res.send(resp);
  })
  .catch(err=>{
    res.status(500).send(err)

  })
});

router.put('/updateSubscription', function(req, res, next) {
    return subscriptionController.updatePlan(req)
    .then((resp) => {
      res.send(resp);
    })
    .catch(err=>{
      res.status(500).send(err)
  
    })
  });

  router.delete('/deleteSubscription', function(req, res, next) {
    return subscriptionController.deleteSubscription(req)
    .then((resp) => {
      res.send(resp);
    })
    .catch(err=>{
      res.status(500).send(err)
  
    })
  });

  router.get('/getSubscriptionPlan',authMiddleware.authenticateJWT,function(req,res,next){
    return subscriptionController.getPlans(req)
    .then((resp)=>{
        res.send(resp);

    })
    .catch(err=>{
        res.status(500).send(err)

    })

  })


  router.post('/subscribePlan',function(req,res,next){
    return subscriptionController.subscribePlan(req)
    .then((resp)=>{
        res.send(resp);

    })
    .catch(err=>{
        res.status(500).send(err)

    })

  })

  router.get('/subscriptionHistory',function(req,res,next){
    return subscriptionController.getHistory(req)
    .then((resp)=>{
      res.send(resp);

    })
    .catch(err=>{
      res.status(500).send(err)

    })
  })

  router.patch('/getPlanDetails',function(req,res,next){
    return subscriptionController.getPlanDetails(req)
    .then((resp)=>{
      res.send(resp);

    })
    .catch(err=>{
      res.status(500).send(err)

    })
  })

module.exports = router;
