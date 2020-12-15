const mongoose = require('mongoose');
const SubscriptionModel = require('../models/subscriptionModel');
const Users = require('../models/userModel');
const userModel = mongoose.model('Users');

const SubscriptionHistoryModel = require('../models/subscriptionHistoryModel')
const ObjectId = mongoose.Types.ObjectId;
class subscriptionController{
    async createPlan(req){
        let subscriptionData=req.body;
        try{
            if(subscriptionData && subscriptionData.planName && subscriptionData.planPrice && subscriptionData.planDuration ){
                let subscription = new SubscriptionModel({
                    planName:subscriptionData.planName,
                    planPrice:subscriptionData.planPrice,
                    planDuration:subscriptionData.planDuration,
                    description:subscriptionData.planDuration.description,
                    configration:{
                        dataUsage:subscriptionData.dataUsage?subscriptionData.dataUsage:'',
                        subjectUsage:subscriptionData.subjectUsage?subscriptionData.subjectUsage:'',
                        noteUsage:subscriptionData.noteUsage?subscriptionData.noteUsage:''
                    }
                });
                const result = await subscription.save();
                if(result){
                    return ({ status: 200, message: '', success: true, data: result });
          
                   }
                   else{
                       return ({ status: 400, message: 'something went wrong', success: false, data: {} });
       
                   }

            }else{
                return ({status:400,message:"variable is empty", success:"false"})

            }

        }
        catch (error){

        }

    }

    async updatePlan(req){
        try{
            let updateData=req.body;
            if(updateData){
                let subscription =await SubscriptionModel.findOne({ _id:ObjectId(req.body.subscriptionId )});
                if(subscription){
                    subscription.planName = updateData.planName ? updateData.planName : subscription.planName;
                    subscription.planDuration = updateData.planDuration ? updateData.planDuration : subscription.planDuration;
                    subscription.planPrice = updateData.planPrice ? updateData.planPrice : subscription.planPrice;
                    subscription.configration.dataUsage = updateData.dataUsage ? updateData.dataUsage : subscription.configration.dataUsage;
                    subscription.configration.subjectUsage = updateData.dataUsage ? updateData.dataUsage : subscription.configration.subjectUsage;
                    subscription.configration.noteUsage = updateData.noteUsage ? updateData.noteUsage : subscription.configration.noteUsage;
                    subscription.description=updateData.description;
                    console.log(subscription.description)
                    let result = await subscription.save();               
                    if(result){
                        return ({ status: 200, message: 'Update successfully', success: true, data: result });

                    }else{
                        return ({ status: 400, message: 'something went wrong', success: false, data: '' });

                    }
                }else{
                    return ({ status: 400, message: 'invalid subscription plan', success: false, data: '' });

                }
            }else{
                return ({ status: 400, message: 'variable is empty', success: false, data: '' });
            
            }
        }catch(error){
            return (error);
        }
    }

    async deleteSubscription(req){
        let subscriptionId=req.body.subscriptionId
        let subscription =await SubscriptionModel.find({ _id:ObjectId(req.body.subscriptionId )});
        console.log(subscription)
        if(subscription.length>0){
            return SubscriptionModel.deleteOne({ _id:ObjectId(subscriptionId)}).then(result=>{
                if(result && result.n>0){
                    console.log(result)
                    return  ({  status: 200, message: "remove successfully",success:true });
                }
            })
        }else{
            return  ({  status: 400, message: "invalid subscription",success:false });

        }
    }

    async getPlans(req){

        let plans = await SubscriptionModel.find({})
        if(plans && plans.length>0){
            return  ({  status: 200, message: "find successfully",success:true, result:plans });

        }else{
            return  ({  status: 200, message: "find successfully",success:true, result:'' });
 
        }
    }

    async subscribePlan(req){
        let planData=req.body;
        console.log(planData)
        try{
            if( planData && planData.subscriptionId && planData.userId ){
                var subscriptionObject={
                    subscriptionId:planData.subscriptionId ,
                    date:new Date(),
                    isActive:true
                }
                let user = await userModel.update({_id:ObjectId(planData.userId)}, { $push: { subscriptionHistory: subscriptionObject  } })
                if(user){
                    let subscriptionHistory = new SubscriptionHistoryModel({
                        userId:planData.userId,
                        subscriptionId:planData.subscriptionId                        
                    });
                    return subscriptionHistory.save().then(resp =>{
                        return ({ status: 200, message: 'subscribe successfully', success: true, data: resp });
                    }).catch(err =>{
                        return (err);
                    });
                }else{
                    return ({ status: 400, message: 'something went wrong', success: false, data: '' });

                }
            }

        }catch(error){
            console.log(error)
            return ({ status: 500, message: 'something went wrong', success: false, error:error });

        }

    }

    async getHistory(){
        try{
            let data=await SubscriptionHistoryModel.find({}). populate('userId').
            populate('subscriptionId').exec();
            if(data && data.length > 0){
                console.log("ddd")
                return ({ status: 200, message: 'sybscription history', success: true, data: data });

            }
          
        }
        catch(error){
            console.log(error)
            return (error);

        }
    }

    async getPlanDetails(req){
        if(req.body && req.body.plan_id){
            let data=await SubscriptionModel.findById({_id:req.body.plan_id})
            if(data){
                return ({ status: 200, message: 'subscription details', success: true, data: data });
            }else{
                return ({ status: 400, message: 'subscription not found', success: false, data: '' });
            }

        }else{
            return ({ status: 400, message: 'variable is empty', success: false, data: '' });

        }
    }
}
module.exports = new subscriptionController();
