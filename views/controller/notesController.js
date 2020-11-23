const mongoose = require('mongoose');
const SubjectsModal = require('../models/subjectModel');
const notesModal = require('../models/notesModel');

const ObjectId = mongoose.Types.ObjectId;

//  const SubjectsModal = mongoose.model('Subjects');

class notesController{
async createSubject(req){
    try{
        if(req.userId && req.body.subjectTitle){
            let subjects = new SubjectsModal({
                userId:req.userId,
                subjectName:req.body.subjectTitle
            });
            
            const result = await subjects.save()
            if(result){
             return ({ status: 200, message: '', success: true, data: result });
   
            }
            else{
                return ({ status: 400, message: 'something went wrong', success: false, data: {} });

            }

        }else{
            return ({ status: 400, message: 'variable is empty', success: false, data: {} });

        }
    }catch(error){
        return ({ status: 500, message: 'something went wrong', success: false, data: {} });
    }
    

    }

    async createNotes(req){
        try{
            if( req.body.notesName){
                let notes = new notesModal({
                    userId:req.userId,
                    notesName:req.body.notesName,
                    subjectId:req.body.subjectId?req.body.subjectId:null
                });
                const result = await notes.save()
                if(result){
                 return ({ status: 200, message: '', success: true, data: result });       
                }
                else{
                    return ({ status: 400, message: 'something went wrong', success: false, data: {} });
                }    
            }
        }catch(error){
            return ({ status: 500, message: 'something went wrong', success: false, data: {} });
        }      
    }

    async getNotes(req){
        if(req.userId){
            let result =await notesModal.find({ userId:ObjectId(req.userId)});
            console.log(result)
            if(result && result.length > 0){
                return ({ status: 200, message: '', success: true, data: result });
            }else{
                return ({ status: 400, message: 'data not found', success: false, data: result });
            }

        }else{
            return ({ status: 500, message: 'something went wrong', success: false, data: {} });


        }

    }

    async getNotesBySubject(subjectId){
        try{
            if(subjectId){
                let result =await notesModal.find({ subjectId:ObjectId(subjectId)});
                if(result && result.length> 0){
                    return ({ status: 200, message: '', success: true, data: result });

                }else{
                    return ({ status: 200, message: '', success: true, data: '' });

                }
    
            }else{
            return ({ status: 400, message: 'variable is empty', success: false, data: {} });
    
            }
        }catch(error){
            return ({ status: 500, message: 'something went wrong', success: false, data: {} });
        } 
        

    }


    async findSubject(req){
        try{
           if(req.body && req.body.subjectName){    

           let result =await SubjectsModal.find({ $and: [ {userId:ObjectId(req.userId) },{isDeleted:false}, { subjectName: { $regex: req.body.subjectName, $options: "i" } }]});
                if(result && result.length > 0){
                    return ({ status: 200, message: '', success: true, data: result });
                }else{
                    return ({ status: 400, message: 'data not found', success: false, data: result });
                }
            }else{
                return ({ status: 400, message: 'variable is empty ', success: false, data: '' });
            }
        }
        catch(error){
            return ({ status: 500, message: 'something went wrong', success: false, data: '' });
        }

    }

    async getSubjects(req){
        try{
           if( req.userId){           
           let result =await SubjectsModal.find({$and:[{userId:ObjectId(req.userId)},{isDeleted:false}] });
           console.log("result",result)     
           if(result && result.length > 0){
                    return ({ status: 200, message: '', success: true, data: result });
                }else{
                    return ({ status: 400, message: 'data not found', success: false, data: result });
                }
            }else{
                return ({ status: 400, message: 'variable is empty ', success: false, data: '' });
            }
        }
        catch(error){
            return ({ status: 500, message: 'something went wrong', success: false, data: '' });
        }

    }

    async deleteSubject(id){
        try{
        if(id){
            console.log("id",id)
           let subjectId=id
            let subject =await SubjectsModal.findOne({ _id:ObjectId(subjectId)});
            if(subject){
                subject.isDeleted=true
                let finalResult= await subject.save()
                if(finalResult){
                    let notesData=await notesModal.find({subjectId: ObjectId(subjectId)})
                    if(notesData>0){
                        let notes=await notesModal.updateMany({subjectId: ObjectId(subjectId)}, {$set: {isDeleted: true}})
                         if(notes.nModified>0){
                              return ({ status: 200, message: 'subject deleted successfully', success: true, data: '' });
      
                          }else{
                              return ({ status: 400, message: 'something goes wrong', success: false, data: '' });
      
                          }
      
                    }else{
                        return ({ status: 200, message: 'subject deleted successfully', success: true, data: '' });

                    }
                }

            }else{
                return ({ status: 400, message:'subject not found', success: false, data:"" });
  
            }


        }else{
            return ({ status: 400, message: 'variable is empty ', success: false, data: '' });
  
        }
        
        }
        catch(error){
            console.log(error)
            return ({ status: 500, message: 'something went wrong', success: false, data: '' });
 
        }

    }


    async deleteNotes(id){
        try{
        if(id){
            console.log("id",id)
           let notesId=id
            let notes =await notesModal.findOne({ _id:ObjectId(notesId)});
            if(notes){
                notes.isDeleted=true
                let finalResult= await notes.save()
                if(finalResult){                    
                    return ({ status: 400, message:'notes deleted successfully ', success: false, data:"" });

                }else{
                    return ({ status: 400, message:'something goes wrong', success: false, data:"" });

                }
            }else{
                return ({ status: 400, message:'notes not found', success: false, data:"" });
  
            }


        }else{
            return ({ status: 400, message: 'variable is empty ', success: false, data: '' });
  
        }
        
        }
        catch(error){
            console.log(error)
            return ({ status: 500, message: 'something went wrong', success: false, data: '' });
 
        }

    }


    async updateSubject(req){
        try{

        
            if(req.body && req.body.subjectId && req.body.subjectTitle){
                let subject =await SubjectsModal.findOne({ _id:ObjectId(req.body.subjectId )});
                if(subject){
                    subject.subjectName=req.body.subjectTitle
                    let finalResult= await subject.save()
                    if(finalResult){
                        return ({ status: 200, message: 'subject updates successfully', success: true, data: finalResult });

                    }else{
                        return ({ status: 400, message: 'something goes wrong', success: false, data: ''});

                    }

                }else{
                    return ({ status: 400, message: 'this subject is not exsist ', success: false, data: '' });

                }

            }else{
                return ({ status: 400, message: 'variable is empty ', success: false, data: '' });
            }
        }
        catch(error){
            console.log(error)
            return ({ status: 500, message: 'something went wrong', success: false, data: '' });
 
        }
    }

    async restoreSubject(req){
        try{
        if(req.body.subjectId){
            let subject =await SubjectsModal.findOne({ _id:ObjectId(req.body.subjectId)});
            if(subject){
                subject.isDeleted=false
                let finalResult= await subject.save()
                if(finalResult){
                   let notes=await notesModal.updateMany({subjectId: ObjectId(req.body.subjectId)}, {$set: {isDeleted: false}})
                    if(notes.nModified>0){
                        return ({ status: 200, message: 'subject deleted successfully', success: true, data: '' });

                    }else{
                        return ({ status: 400, message: 'something goes wrong', success: false, data: '' });

                    }
                }

            }else{
                return ({ status: 400, message:'subject not found', success: false, data:"" });
  
            }


        }else{
            return ({ status: 400, message: 'variable is empty ', success: false, data: '' });
  
        }
        
        }
        catch(error){
            console.log(error)
            return ({ status: 500, message: 'something went wrong', success: false, data: '' });
 
        }

    }


    async deleteNotes(notesId){
        if(notesId){

        }else{
            return ({ status: 400, message: 'variable is empty ', success: false, data: '' }); 
        }
    }

    async saveNotes(req){
        if(req.userId ){

        }else{
            return ({ status: 400, message: 'variable is empty ', success: false, data: '' });
        }
    }



    // async saveNotes(){
    //     try{
    //         if(req.body && req.body.notesId){                
    //         }else{
    //             return ({ status: 400, message: 'variable is empty ', success: false, data: '' });
 
    //         }

    //     }
    //     catch(error){

    //     }
    // }

    async findSubject1(req){
        try{
            if(req.body.id && req.body.subjectTitle){
                let subjects = new SubjectsModal({
                    userId:req.body.id,
                    subjectName:req.body.subjectTitle
                });
                
                const result = await subjects.find().populate(populateQuery).select('userId.firstName userId.lastName')
                if(result){
                    console.log(result)
                }
            }
        }catch(error){
            console.log(error)
        }
        populateQuery={
            path: 'user',
            match: { 'accountStatus.isPro': false }
          };
    
        }
    
}

module.exports = new notesController();