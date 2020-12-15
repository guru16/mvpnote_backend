const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const SubscriptionSchema = new Schema({
    planName: { type: String, default: ''},
    planPrice: { type: Number, default: ''},
    planDuration:{type:String,default:''},
    description:{type:String,default:''},
    configration: {
        dataUsage:{type:String,default: ''},
        subjectUsage:{type:String,default: ''},
        noteUsage:{type:String,default: ''}

    },
      
},
{timestamps: true});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
