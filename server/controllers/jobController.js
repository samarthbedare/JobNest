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

// try
//search jobs
export const searchJobs = asyncHandler(async(req,res)=>{
    try
    {
        const {tags,location,title}=req.query;
        let query={} ;
        if(tags){
            query.tags ={ $in :tags.split(",")};
        }
        if(location){
            query.location ={$regex:title,$options:"i"};
        }
        if(title)
        {
            query.title ={$regex :title ,$options :"i"};
        }
        const jobs = await Job.find(query).populate("createdBy","name profilePicture");
        return res.status(200).json(jobs);
    }catch(error)
    {
        console.log("Error in searchJobs :",error);
        return res.status(500).json({
            message:"Server Error",
        });
    }
});
//apply for job
export const applyJobs =asyncHandler(async(req,res)=>
{
    try
    {
        const job =await Job.findById(req.params.id);
        if(!Job){
            return res.status(404).json({message :"Job not found"});
        }
        const user = await User.findOne({auth0Id :req.oidc.user.sub});
        if(!user){
            return res.status(404).json({message :"User not found"});
        }
        if(job.applicants.includes(user._id)){
            return res.status(400).json({message :"Already applied for this job"});
        }
        job.applicants.push(user._id);
        await job.save();
        return res.status(200).json(job);
    }catch(error)
    {
        console.log("Error in applyJob: ",error);
        return res.status(500).json({
            message:"Server Error",
        });
    }
});
//Like and unlike jobs
export const likeJob = asyncHandler(async (req ,res)=>{
    try
    {
        const job = await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({message :"Job not found"});
        }
        const user = await User.findOne({auth0Id : req.oidc.user.sub});
        if(!user)
        {
            return res.status(404).json({message:"User not found"});
        }
        
        const isLiked = jobs.likes.includes(user._id);
        
        if(isLiked){
            job.likes = job.likes.filter((like) => !like.equals(user._id));
        }else{
            job.likes.push(user._id);
        }
        await job.save();
        return res.status(200),json(job);
    }catch(error){
        console.log("Erro in likeJob :",error);
        return res.status(500),json({
            message:"Server Error",
        });
    }
});
//get job by id
export const getJobById = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params;
        const job = await Job.findById(id).populate("createdBy","name profilePicture");
        if(!job){
            return res.status(404).json({message :"Job not found"});
        }
        return res.status(200).json(job);
    }catch(error){
        console.log("Error in getJobByID :",error);
        return res.status(500).json({
            message:"Server Error",
        });
    }
});
//delete job
export const deleteJob = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params;
        const job = await Job.findById(id);
        const user = await User.findOne({auth0Id: req.oidc.user.sub});
        if(!job){
            return res.status(404).json({message :"User not found"});
        }
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        await job.deleteOne(
            {
                _id :id,
            }
        );
        return res.status(200).json({message :"Job deleted sucessfully"});
    }catch(error){
        console.log("Error in deleteJob: ",error);
        return res.status(500).json({
            message:"Server Error",
        });
    }
});