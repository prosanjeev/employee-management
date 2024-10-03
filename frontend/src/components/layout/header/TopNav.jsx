import { Box, Flex, HStack, Text, Avatar, Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../..";
import axios from "axios";
import { toast } from "react-toastify";
import { setAuthUser } from "../../../redux/userSlice";
import { FaHome, FaUsers, FaSignOutAlt } from "react-icons/fa"; // Importing icons

const TopNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.user.authUser);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/user/logout`);
      navigate("/login");
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box px="6" py="4" bgGradient="linear(to-r, teal.500, blue.500)" boxShadow="md">
      <HStack
        maxW="100rem"
        h="16"
        justify="space-between"
        mx="auto"
        color="white"
        fontWeight="600"
        fontSize="18px"
      >
        {/* Left Navigation Links */}
        <Flex gap={10} align="center">
          <Link to="/">
            <HStack spacing={2}>
              <FaHome />
              <Text cursor="pointer" _hover={{ color: "yellow.300", transition: "all 0.3s ease" }}>
                Home
              </Text>
            </HStack>
          </Link>
          <Link to="/employees">
            <HStack spacing={2}>
              <FaUsers />
              <Text cursor="pointer" _hover={{ color: "yellow.300", transition: "all 0.3s ease" }}>
                Employee List
              </Text>
            </HStack>
          </Link>
        </Flex>

        {/* Right Section (User Info & Logout) */}
        <Flex gap={8} align="center">
          {/* User Avatar and Name */}
          <Flex align="center" gap={3}>
            <Avatar name={authUser?.fullName} size="sm" />
            <Text cursor="pointer" fontWeight="500" _hover={{ color: "yellow.300", transition: "color 0.3s ease" }}>
              {authUser.fullName}
            </Text>
          </Flex>

          {/* Logout Button */}
          <Button
            leftIcon={<FaSignOutAlt />}
            colorScheme="red"
            variant="solid"
            onClick={logoutHandler}
            _hover={{
              bg: "red.600",
              transition: "background-color 0.3s ease",
            }}
            size="sm"
          >
            Logout
          </Button>
        </Flex>
      </HStack>
    </Box>
  );
};

export default TopNav;
