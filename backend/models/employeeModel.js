import mongoose from "mongoose";

const employeeModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function (v) {
            return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
          },
          message: "Please enter a valid email address",
        },
      },
      phone: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^\d+$/.test(v);
          },
          message: "Please enter a valid phone number",
        },
      },
      designation: {
        type: String,
        enum: ["HR", "Manager", "Sales"],
        required: true,
      },
      gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
      },
      
        course: {
          type: [String],
          required: true,
          // Changed to array of strings
      },
      
      profilePhoto: {
        type: String,
      },
    }, { timestamps: true });

export const Employee = mongoose.model("Employee", employeeModel)