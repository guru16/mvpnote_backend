const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const NotesSchema = new Schema({
    userId: { type: ObjectId, ref: 'Users'},
    notesName: { type: String, default: ''},
    title: { type: String, default: ''},
    cues: {
        cuesTitle:{type:String,default: ''},
        cuesText:{type:String,default: ''}
    },
    notesData: {
        notesTitle:{type:String,default: ''},
        notesText:{type:String,default: ''}
    },
    summaries: {
        summaryText:{type:String,default: ''}
    },   
    isDeleted:{type:Boolean,default:false},
    subjectId: { type: Schema.ObjectId, ref: "Subjects" }
      
},
{timestamps: true});

module.exports = mongoose.model('Notes', NotesSchema);
