const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const SubscriptionHistorySchema = new Schema({
    userId: { type: ObjectId, ref: 'Users'},
    subscriptionId:{type: ObjectId, ref: 'Subscription'},  
    
      
},
{timestamps: true});

module.exports = mongoose.model('SubscriptionHistory', SubscriptionHistorySchema);
