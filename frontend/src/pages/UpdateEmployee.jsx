import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { Field, Form, Formik } from "formik";
import { object, string, array } from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// Validation schema
const employeeValidationSchema = object({
  fullName: string().required("Name is required"),
  email: string().email("Invalid email").required("Email is required"),
  phone: string()
    .required("Mobile No. is required")
    .matches(/^[0-9]{10}$/, "Must be exactly 10 digits"),
  designation: string().required("Designation is required"),
  gender: string().required("Gender is required"),
  course: array().min(1, "At least one course is required"),
});

const UpdateEmployee = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [employeePhoto, setEmployeePhoto] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Get the employee ID from the URL

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/employee/${id}`);
        setEmployeeData(response.data);
        setEmployeePhoto(response.data.profilePhoto); // Store current photo if exists
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Failed to fetch employee data");
      }
    };

    fetchEmployeeData();
  }, [id]);

  const convertToBase64 = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => setEmployeePhoto(reader.result);
    reader.onerror = (error) => console.error("Error", error);
  };

  const employeeInformation = [
    {
      label: "Full Name",
      name: "fullName",
      type: "text",
      placeholder: "Enter your full name",
    },
    {
      label: "Email",
      name: "email",
      type: "text",
      placeholder: "Enter your email",
    },
    {
      label: "Mobile No",
      name: "phone",
      type: "tel",
      placeholder: "Enter your mobile number",
    },
    {
      label: "Designation",
      name: "designation",
      type: "select",
      options: ["HR", "Manager", "Sales"],
      placeholder: "Select Designation",
    },
    {
      label: "Gender",
      name: "gender",
      type: "radio",
      options: ["Male", "Female"],
    },
    {
      label: "Course",
      name: "course",
      type: "checkbox",
      options: ["MCA", "BCA", "BSC"],
    },
    {
      label: "Employee Photo",
      name: "profilePhoto",
      type: "file",
    },
  ];

  const onSubmit = async (values, actions) => {
    try {
      values.course = values.course.filter(Boolean); // Clean up the course array
      values.profilePhoto = employeePhoto; // Include photo in values
      console.log("Form Values:", values);

      const response = await axios.put(
        `http://localhost:8080/api/v1/employee/${id}`, // Update employee endpoint
        values
      );

      if (response.status === 200) {
        toast.success("Employee updated successfully");
        navigate("/employees"); // Redirect after successful update
      } else {
        toast.error("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while updating the employee"
      );
    }
  };

  if (!employeeData) return <Text>Loading...</Text>; // Show loading message while fetching data

  return (
    <Box py={10} bgColor="gray.50">
      <Center>
        <Card
          my={6}
          py={8}
          px={6}
          borderRadius="16px"
          minW={{ base: "90vw", md: "100vw", lg: "600px" }}
          boxShadow="lg"
          bgColor="white"
          border="1px"
          borderColor="gray.200"
        >
          <Box textAlign="center" mb={6}>
            <Heading as="h2" size="xl" color="teal.600" mb={2}>
              Update Employee
            </Heading>
            <Text fontSize="lg" color="gray.500">
              Update the details below to modify the employee information.
            </Text>
          </Box>

          <Formik
            initialValues={{
              fullName: employeeData.fullName,
              email: employeeData.email,
              phone: employeeData.phone,
              designation: employeeData.designation,
              gender: employeeData.gender,
              course: employeeData.course || [],
              profilePhoto: null,
            }}
            validationSchema={employeeValidationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Stack spacing={6} mt={4}>
                  <SimpleGrid columns={1} spacing={4}>
                    {employeeInformation.map((input) => (
                      <Field name={input.name} key={input.name}>
                        {({ field, meta }) => (
                          <FormControl isInvalid={meta.touched && !!meta.error}>
                            <FormLabel
                              htmlFor={input.name}
                              fontWeight="bold"
                              color="teal.600"
                              mb={2}
                            >
                              {input.label}
                            </FormLabel>
                            {input.type === "select" ? (
                              <Select
                                bgColor="gray.100"
                                borderColor="teal.300"
                                focusBorderColor="teal.400"
                                {...field}
                                placeholder={input.placeholder}
                                onChange={(e) => setFieldValue(input.name, e.target.value)}
                              >
                                {input.options.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </Select>
                            ) : input.type === "radio" ? (
                              <RadioGroup onChange={(value) => setFieldValue(input.name, value)} value={field.value}>
                                <Stack direction="row" spacing={6} mt={2}>
                                  {input.options.map((option) => (
                                    <Radio key={option} value={option} colorScheme="teal">
                                      {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </Radio>
                                  ))}
                                </Stack>
                              </RadioGroup>
                            ) : input.type === "checkbox" ? (
                              <CheckboxGroup value={values.course} onChange={(newValue) => setFieldValue(input.name, newValue)}>
                                <Stack spacing={4} mt={2}>
                                  {input.options.map((option) => (
                                    <Checkbox key={option} value={option} colorScheme="teal">
                                      {option}
                                    </Checkbox>
                                  ))}
                                </Stack>
                              </CheckboxGroup>
                            ) : input.type === "file" ? (
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={convertToBase64}
                                borderColor="teal.300"
                                mt={2}
                              />
                            ) : (
                              <Input
                                bgColor="gray.100"
                                borderColor="teal.300"
                                focusBorderColor="teal.400"
                                {...field}
                                type={input.type}
                                placeholder={input.placeholder}
                                mt={2}
                              />
                            )}
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    ))}
                  </SimpleGrid>

                  <Stack direction={{ base: "column", md: "column" }} spacing={4}>
                    <Button
                      leftIcon={<MdKeyboardDoubleArrowRight />}
                      size="lg"
                      colorScheme="teal"
                      variant="solid"
                      type="submit"
                      w="100%"
                      py={6}
                      borderRadius="8px"
                      _hover={{ bg: "teal.600", transform: "translateY(-2px)", boxShadow: "lg" }}
                      boxShadow="md"
                    >
                      Update Employee
                    </Button>
                    <Button
                      size="lg"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => navigate("/employees")} 
                      w="100%"
                      py={6}
                      borderRadius="8px"
                      boxShadow="md"
                      _hover={{ 
                        borderColor: "red.600", 
                        color: "red.600", 
                        bg: "red.50",
                        transform: "translateY(-2px)",
                        boxShadow: "lg" 
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </Card>
      </Center>
    </Box>
  );
};

export default UpdateEmployee;
