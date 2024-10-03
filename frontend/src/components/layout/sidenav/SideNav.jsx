import React from "react";
import { Box, Flex, VStack, Text, Icon, Link, Divider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa"; // Importing icons
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
// import { setAuthUser } from "../../redux/userSlice";
import axios from "axios";
// import { BASE_URL } from "../..";

const SideNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

//   const logoutHandler = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
//       toast.success(res.data.message);
//       dispatch(setAuthUser(null));
//       navigate("/login");
//     } catch (error) {
//       console.log(error);
//     }
//   };

  return (
    <Box
      as="nav"
      width="250px"
      height="100vh"
      bgGradient="linear(to-b, teal.500, blue.500)"
      color="white"
      position="fixed"
      top="0"
      left="0"
      p={5}
      boxShadow="md"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={8}>
        My Application
      </Text>
      <VStack spacing={4} align="stretch">
        <Link to="/">
          <Flex align="center" _hover={{ color: "yellow.300", transition: "color 0.3s ease" }}>
            <Icon as={FaHome} boxSize={6} />
            <Text ml={2}>Home</Text>
          </Flex>
        </Link>
        <Link to="/employees">
          <Flex align="center" _hover={{ color: "yellow.300", transition: "color 0.3s ease" }}>
            <Icon as={FaUsers} boxSize={6} />
            <Text ml={2}>Employee List</Text>
          </Flex>
        </Link>
        <Link to="/settings">
          <Flex align="center" _hover={{ color: "yellow.300", transition: "color 0.3s ease" }}>
            <Icon as={FaCog} boxSize={6} />
            <Text ml={2}>Settings</Text>
          </Flex>
        </Link>
      </VStack>
      <Divider my={8} borderColor="whiteAlpha.400" />
      {/* <Flex align="center" cursor="pointer" onClick={logoutHandler} _hover={{ color: "yellow.300", transition: "color 0.3s ease" }}>
        <Icon as={FaSignOutAlt} boxSize={6} />
        <Text ml={2}>Logout</Text>
      </Flex> */}
    </Box>
  );
};

export default SideNav;
