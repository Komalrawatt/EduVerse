const Section = require("../models/Section");
const Course= require("../models/Course");

exports.createSection = async(req,res)=>{
try{
    //data fetch
    const {sectionName, courseId}= req.body;
    //data validation
    if(!sectionName || !courseId){
        return res.status(400).json({
            success:false,
            message:"Missing Properties"
        })
    }
    // create section
    const newSection = await Section.create({sectionName});
    //update course with section ObjetID
    const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                        {
                                            $push:{
                                                courseContent:newSection._id,
                                            }
                                        },
                                        {new:true},
                                        )
 // TODO  -> use populate to replace secion/subSection both in the updatedCourseDetails
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            }
        })
        .exec(); 

        
   //return response
    return res.status(200).json({
        success:true,
        message:"Section created Successfully",
        updatedCourseDetails
    })
}
catch(error){
    return res.status(500).json({
        success:false,
        message:"Unable to update sections Please try again",
        error:error.message
    })
    
}
}

exports.updateSection = async(req,res)=>{
    try{
        //data input
        const {sectionName, sectionId}=req.body;

        //data validation
         if(!sectionName || !sectionId){
          return res.status(400).json({
            success:false,
            message:"Missing Properties"
        })
    }
        //update data
        const sectionDetails = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated Successfully",
            sectionDetails
        })

    }
    catch(error){
          return res.status(500).json({
        success:false,
        message:"Unable to create sections Please try again",
        error:error.message
    })
    }
}

exports.deleteSection = async(req,res)=>{
    try{
        // HW --> req.params [test]
        //get id  -- assuming that we are sending ID in params
        const {sectionId} = req.body;
        //delete section using findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        //TODO : [testing] do we need to delete the entry from the course schema??
        // return response
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully"
        })
    }
    catch(error){
        return res.status(500).json({
        success:false,
        message:"Unable to delete sections Please try again",
        error:error.message
    })
    }
}