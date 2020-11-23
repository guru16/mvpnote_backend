const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const SubjectSchema = new Schema({
    subjectName: { type: String, default: null},
    userId: { type: ObjectId, ref: 'Users'}, 
    isDeleted:{type:Boolean,default:false} ,

    NotesData:[ { type: ObjectId, ref:'Notes' }],
},{timestamps: true});

module.exports = mongoose.model('Subjects', SubjectSchema, 'Subjects');
