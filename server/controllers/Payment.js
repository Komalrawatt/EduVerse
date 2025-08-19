const {instance} = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
// const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");



// capture the payment aand initate the Razorpay order
exports.capturePayment = async(req,res)=>{

    // get courseId and userId
    const {courseId} = req.body;
    const userId = req.user.id;

    // validation
    // valid courseId
    if(!courseId){
        return res.json({
            success: false,
            message: "Please provide valid course ID",
        });
    }
    
    // valid coursedetails
    let course;
    try{
        course = await Course.findById(courseId);
        if(!course){
            return res.json({
                success: false,
                message: "Could not find the course",
            });
        }

        // user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: "Student is already enrolled",
            });
        }


    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
    
    // create order
    const amount = course.price;
    const currency = "INR";
    
    const options = {
        amount : amount*100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes: {
            courseId: courseId,
            userId,
        }
    }

    try{
        // initiate the payment using RAZORPAY
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        
        // return response
        return res.status(200).json({
            success: false,
            courseName: course.courseName,
            courseDescription : course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.orderId,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,

        });

    }
    catch(err){
        console.error(err);
        return res.json({
            success: false,
            message: "Could not initiate order",
        });
    }


}





// verify signature of razorpay and server
exports.verifySignature = async(req,res)=>{
    const weebhookSecret = "12345678";

    const signature = req.headers("x-razorpay-signature");

    const shaSum = crypto.createHmac("sha256", weebhookSecret);
    shaSum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("Payment is Authorised");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        // fulfill the action
        try{
            // find the course and enroll the student in it
            const enrolledCourse = Course.findOneAndUpdate(
                {_id: courseId},
                {
                    $push: {
                        enrolledCourse: userId
                    }
                },
                {new: true}
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Course Not Found",
                });
            }
            console.log(enrolledCourse);

            
            // Find the student and add course in their enrolled course
            const enrolledStudent = await User.findByIdAndUpdate(
                {_id: userId},
                {
                    $push: {
                        courses: courseId
                    }
                },
                {new: true}
            )
            console.log(enrolledStudent);


            // mail send krdo confimation wala
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulations from StudyNotion",
                "Congratulations, you are onboarding into new StudyNotion course"
            );
            console.log(emailResponse);
                
            // return response
            return res.status(200).json({
                success: true,
                message: "Signature verified and course added",
            });

        }
        catch(err){
            console.error(err);
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid request"
        })
    }

}