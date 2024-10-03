import express from "express";
import {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} from "../controllers/employeeController.js";
import upload from "../utils/upload.js";

const router = express.Router();

// Use upload.single for handling single file uploads
router.route("/create").post(upload.single("profilePhoto"), createEmployee); // 'profilePhoto' is the key in the form data
router.route("/").get(getEmployees);
router.route("/:id")
    .get(getEmployeeById)
    .put(updateEmployee)
    .delete(deleteEmployee);

export default router;
