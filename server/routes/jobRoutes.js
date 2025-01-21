import express from "express";
import {createJob,getJobs ,getJobsByUser}from "../controllers/jobController.js"
import protect from "../middleware/protect.js";
const router = express.Router();

router.post("/jobs",protect,createJob);
router.get("/jobs",getJobs);
router.get("/jobs/user/:id",getJobsByUser);

export default router;
