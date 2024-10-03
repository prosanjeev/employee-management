import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  Box,
  Heading,
  Flex,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../..";
import { setAuthUser } from "../../redux/userSlice";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${BASE_URL}/api/v1/user/login`, values, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        navigate("/");
        dispatch(setAuthUser(res.data));
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    },
  });

  return (
    <Flex
      align="center"
      justify="center"
      h="100vh"
      bgGradient="linear(to-r, #2a2a72, #009ffd)"
    >
      <Box
        maxW="md"
        w="full"
        p={8}
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(10px)"
        borderRadius="lg"
        boxShadow="lg"
        border="1px solid rgba(255, 255, 255, 0.3)"
      >
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center" color="white" fontSize="3xl" fontWeight="bold">
            Welcome Back
          </Heading>
          <Text textAlign="center" color="whiteAlpha.800" fontSize="md">
            Log in to your account
          </Text>
          <form onSubmit={formik.handleSubmit} action="">
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={formik.touched.username && formik.errors.username}>
                <FormLabel
                  htmlFor="username"
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Username
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<Icon as={FaUserAlt} color="gray.300" />} />
                  <Input
                    id="username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your username"
                    focusBorderColor="blue.400"
                    variant="filled"
                    bg="whiteAlpha.200"
                    _hover={{
                      bg: "whiteAlpha.300",
                      borderColor: "blue.300",
                      boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                    }}
                    _focus={{
                      bg: "whiteAlpha.300",
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.8)",
                    }}
                    _placeholder={{ color: "whiteAlpha.600" }}
                    color="white"
                  />
                </InputGroup>
                {formik.touched.username && formik.errors.username && (
                  <Text color="red.300" fontSize="sm">
                    {formik.errors.username}
                  </Text>
                )}
              </FormControl>
              <FormControl isInvalid={formik.touched.password && formik.errors.password}>
                <FormLabel
                  htmlFor="password"
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Password
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<Icon as={FaLock} color="gray.300" />} />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
                    focusBorderColor="blue.400"
                    variant="filled"
                    bg="whiteAlpha.200"
                    _hover={{
                      bg: "whiteAlpha.300",
                      borderColor: "blue.300",
                      boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                    }}
                    _focus={{
                      bg: "whiteAlpha.300",
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 2px rgba(66, 153, 225, 0.8)",
                    }}
                    _placeholder={{ color: "whiteAlpha.600" }}
                    color="white"
                  />
                </InputGroup>
                {formik.touched.password && formik.errors.password && (
                  <Text color="red.300" fontSize="sm">
                    {formik.errors.password}
                  </Text>
                )}
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                bgGradient="linear(to-r, blue.400, blue.600)"
                _hover={{ bgGradient: "linear(to-r, blue.500, blue.700)" }}
                isFullWidth
                rounded="full"
                boxShadow="xl"
                transition="all 0.3s ease"
                _active={{ transform: "scale(0.98)" }}
              >
                Login
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
