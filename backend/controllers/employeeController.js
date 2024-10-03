// import { response } from "express";
import { Employee } from "../models/employeeModel.js";

// Create an employee
export const createEmployee = async (req, res) => {
    try {
        const { fullName, email, phone, designation, gender, profilePhoto, course } = req.body;
        if (!fullName || !email || !phone || !designation || !gender || !profilePhoto || !course) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await Employee.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists, please try a different one" });
        }

        // Validate email format
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Validate phone format
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Please enter a valid phone number" });
        }
        if (!["HR", "Manager", "Sales"].includes(designation)) {
            return res.status(400).send("Designation must be 'HR', 'Manager', or 'Sales'");
        }
        if (!["Male", "Female"].includes(gender)) {
            return res.status(400).send("Gender must be 'male' or 'female'");
        }

        if (!course || course.length === 0) {
            return res.status(400).send("At least one course must be selected");
        }
        
        // if (!["MCA", "BCA", "BSC"].includes(course)) {
        //     return res.status(400).send("Course must be 'MCA' or 'BCA', or 'BSC' ");
        // }

        await Employee.create({
            fullName,
            email,
            phone,
            designation,
            gender,
            course,
            profilePhoto
        });
        return res.status(201).json({
            message: "Employee created successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Read all employees with search, sorting, and pagination
export const getEmployees = async (req, res) => {
    const { search, sort, sortDirection = 'asc', page = 1, limit = 10 } = req.query;

    const query = search ? { fullName: { $regex: search, $options: "i" } } : {};
    const options = {
        sort: sort ? { [sort]: sortDirection === 'asc' ? 1 : -1 } : {}, // Sort by the field specified in the query
        page: parseInt(page), // Current page
        limit: parseInt(limit), // Number of records per page
    };

    try {
        const employees = await Employee.find(query, null, options);
        const totalEmployees = await Employee.countDocuments(query);
        return res.status(200).json({ employees, totalEmployees });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




// Read a single employee by ID
export const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json(employee);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Update an employee
export const updateEmployee = async (req, res) => {
    try {
        const { fullName, email, phone, designation, gender, profilePhoto, course } = req.body;
        if (!fullName || !email || !phone || !designation || !gender || !course) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate email format
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Validate phone format
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Please enter a valid phone number" });
        }

        if (!["HR", "Manager", "Sales"].includes(designation)) {
            return res.status(400).send("Designation must be 'HR', 'Manager', or 'Sales'");
        }
        if (!["Male", "Female"].includes(gender)) {
            return res.status(400).send("Gender must be 'male' or 'female'");
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, {
            fullName,
            email,
            phone,
            designation,
            gender,
            course,
            profilePhoto
        }, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json({
            message: "Employee updated successfully",
            success: true,
            employee: updatedEmployee
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete an employee
export const deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json({
            message: "Employee deleted successfully",
            success: true,
            employee: deletedEmployee
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

