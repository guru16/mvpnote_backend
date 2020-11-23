const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const UsersSchema = new Schema({
    userName: { type: String, default: null},
    firstName: { type: String, default: null},
    lastName: { type: String, default: null},
    email: { type: String, default: null},
    gender:{ type: String, default: null},
    hash:String,
    password:String,
    token:{ type: String, default: null},
    socialLogin:{ type: String, default: ''},
    profileImage: { type: String, required: false, default: null },
    profileImageName: { type: String, required: false, default: null },

    subscriptionHistory:[
        {
            subscriptionId: { type: ObjectId, ref:'Subscription'},
            date: { type: Date },
            isActive:Boolean
        }
    ],
},{timestamps:true});
UsersSchema.methods.setPassword = function(password) {
    this.hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
UsersSchema.methods.validatePassword = function(password,hash) {
    return bcrypt.compareSync(password, hash); // true
};
mongoose.model('Users', UsersSchema);
