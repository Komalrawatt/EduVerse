const category = require("../models/category");
// const Course = require("../models/Course")
//create Tag ka handler function

exports.createCategory = async(req,res)=>{
    try{
        //fetch data from admin
        const {name,description}=req.body;
        //validation
        if(!name || !description) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //create entry in DB
        const categoryDetails = await category.create({
            name:name,
            description:description
        })
        console.log(categoryDetails);
        
        //return response

        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:true,
            message:error.message
        })
    }
}


// getAllTags handler function
exports.showAllCategory = async (req,res)=>{
    try{
        const allCategory = await category.find({},{name: true, description: true});
        
        return res.status(200).json({
            success: true,
            message: "All Category returned successfully",
            allCategory,
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


// categoryPageDetails
exports.categoryPageDetails = async (req,res)=>{
    try{
        // get categoryId
        const categoryId = req.body;

        // get courses for specified categoryId
        const selectedCategory = await category.findById({_id: categoryId})
                                                        .populate("courses")
                                                        .exec();
        
        // validation
        if(!selectedCategory){
            return res.status(400).json({
                success: false,
                message: "Data Not Found",
            });
        }
        
        // get courses for different categories
        const differentCategories = await category.find({
                                                        _id: {$ne: categoryId}
                                                    })
                                                    .populate("courses")
                                                    .exec();


        // get top 10 selling courses
        // const topCourses= await Course.Aggregate([
        //     {
        //         $addFields: {
        //         enrollmentCount: { $size: "$studentsEnrolled" }
        //          }
        //     },
        //     {
        //         $sort :{ enrollmentCount : -1 }
        //     },
        //     {
        //         $limit: 10
        //     }
        // ])

        // console.log(topCourses);
        
        // HW --> Write it your own

        
        // return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
            }
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}