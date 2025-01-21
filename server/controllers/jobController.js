import asyncHandler from 'express-async-handler';
import User from "../models/UserModel.js";
import Job from '../models/JobModel.js';

export const createJob = asyncHandler(async(req,res) =>{
    try
    {
        const user =await User.findOne({auth0Id :req.oidc.user,sub});
        const isAuth = req.oidc.isAuthenticated() || user.email;

        if(!isAuth){
            return res.status(401).json({
                message :"Not Authorized"
            })
        }
        
        const {title, description, location , salary ,jobType ,tags,skills,salaryType,negotiable,}=req.body;

        // if(!title || !description || !location ||!salary ||!jobtype){
            // return res.status(400).json({message :"PLease fill all fields"});
        // 
        // }
        if(!title)
        {
            return res.status(400).json({message :"PLease fill title"});   
        }
        if(!description)
        {
            return res.status(400).json({message :"PLease fill description"}); 
        }
        if(!location)
        {
            return res.status(400).json({message :"PLease fill location"}); 
        }
        if(!jobType)
        {
            return res.status(400).json({message :"PLease fill sJobtype"}); 
        }
        if(!tags)
        {
            return res.status(400).json({message :"PLease fill tags"}); 
        }
        if(!skills)
        {
            return res.status(400).json({message :"PLease fill sklills"}); 
        }
        if(!salaryType)
        {
            return res.status(400).json({message :"PLease fill salarytype"}); 
        }
        if(!negotiable)
        {
            return res.status(400).json({message :"PLease fill negotiable"}); 
        }

        const job = new Job(
            {
                title,
                description,
                location,
                salary,
                jobType,
                tags,
                skills,
                salaryType,
                negotiable,
                createdBy: user._id,
            }
        );
        await job.save();

        return res.status(201).json(job);

    }catch(error){
        console.log("Error in createJob: ",error);
        return res.status(500).json(
            {
                message :"Server Error",
            }
        );
    }
});

// get jobs
export const getJobs = asyncHandler(async(req,res) =>{
    try{
        const jobs = await Job.find({}).populate("createdBy","name profilePicture").sort({createdAt:-1}); // sort by latest job

        return res.status(200).json(jobs);
    }catch{
        console.log("Error in getJobs: ",error);
        return res.status(500).json(
            {
                message :"Server Error",
            }
        );
    }
});

// get jobs by user
export const getJobsByUser = asyncHandler(async(req,res) =>{
    try{
        const user = await User.findById(req.params.id);

        if(!user){
            return res.status(404).json({message :"User not found"});
        }

        const jobs = await Job.find({createdBy :user.id}).populate("createdBy","name profilePicture");

        return res.status(200).json(jobs);
    }catch{
        console.log("Error in getJobsByUser: ",error);
        return res.status(500).json(
            {
                message :"Server Error",
            }
        );
    }
});

