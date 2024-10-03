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
} from "@chakra-ui/react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { Field, Form, Formik } from "formik";
import { object, string, array } from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const CreateEmployee = () => {
  const [employeePhoto, setEmployeePhoto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("employeePhoto", employeePhoto);
  }, [employeePhoto]);

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
      values.profilePhoto = employeePhoto;
      console.log("Form Values:", values);

      const response = await axios.post(
        "http://localhost:8080/api/v1/employee/create",
        values
      );

      if (response.status === 201) {
        toast.success("Employee created successfully");
        actions.resetForm();
        navigate("/employees");
      } else {
        toast.error("Failed to create employee");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while creating the employee"
      );
    }
  };

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
              Create Employee
            </Heading>
            <Text fontSize="lg" color="gray.500">
              Fill in the details below to add a new employee.
            </Text>
          </Box>

          <Formik
            initialValues={{
              fullName: "",
              email: "",
              phone: "",
              designation: "",
              gender: "",
              course: [],
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
                      Add New Employee
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

export default CreateEmployee;
