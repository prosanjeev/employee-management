import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tag,
  Image,
  useDisclosure,
  Select,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { DeleteIcon, EditIcon, SearchIcon, UpDownIcon } from "@chakra-ui/icons";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const totalPages = Math.ceil(totalEmployees / limit);

  useEffect(() => {
    fetchEmployees();
  }, [page, limit, search, sort, sortDirection]);

  const fetchEmployees = () => {
    const params = { page, limit, search, sort, sortDirection };
    axios
      .get("http://localhost:8080/api/v1/employee/", { params })
      .then((response) => {
        setEmployees(response.data.employees);
        setTotalEmployees(response.data.totalEmployees);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/v1/employee/${id}`)
      .then(() => {
        toast.success("Employee deleted successfully");
        setEmployees(
          employees.filter((employee) => employee._id !== id.toString())
        );
        onClose();
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee");
      });
  };

  const handleSort = (field) => {
    if (sort === field) {
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSort(field);
      setSortDirection("asc");
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when limit changes
  };

  return (
    <Box mt={10} p={5} borderRadius="md" boxShadow="lg" bg="white">
      <Flex justifyContent="end" alignItems="center" mb={4}>
        <Link to="/create-employee">
          <Button colorScheme="teal" size="md">
            Create Employee
          </Button>
        </Link>
      </Flex>

      <Flex mb={4} justifyContent="space-between" alignItems="center">
        <Text fontSize="lg" fontWeight="bold" mr={4}>
          Total Employees: {totalEmployees}
        </Text>

        <Flex alignItems="center" width={["100%", "auto"]}>
          <InputGroup
            boxShadow="md"
            borderRadius="md"
            overflow="hidden"
            width={["100%", "300px"]}
            mr={2}
          >
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              border="none"
              _focus={{ outline: "none", boxShadow: "none" }}
              bg="gray.50"
            />
          </InputGroup>
          {/* <Button
            colorScheme="teal"
            size="md"
            boxShadow="md"
            onClick={fetchEmployees}
            _hover={{ bg: "teal.500" }}
          >
            Search
          </Button> */}
        </Flex>
      </Flex>

      <Box borderRadius="md" overflow="hidden" boxShadow="sm">
        <Flex fontWeight="bold" borderBottom="2px solid gray" py={2} bg="gray.100">
          <Box flex="0.1" textAlign="center">
            #
          </Box>
          <Box flex="0.5" paddingLeft={4}>
            Image
          </Box>
          <Box flex="1" onClick={() => handleSort("fullName")} cursor="pointer">
            Name
            {sort === "fullName" ? (
              sortDirection === "asc" ? (
                <ArrowUpIcon boxSize={4} />
              ) : (
                <ArrowDownIcon boxSize={4} />
              )
            ) : (
              <UpDownIcon boxSize={3} ml="1" />
            )}
          </Box>
          <Box flex="1" onClick={() => handleSort("email")} cursor="pointer">
            Email
            {sort === "email" ? (
              sortDirection === "asc" ? (
                <ArrowUpIcon boxSize={4} />
              ) : (
                <ArrowDownIcon boxSize={4} />
              )
            ) : (
              <UpDownIcon boxSize={3} ml="1" />
            )}
          </Box>
          <Box flex="1" onClick={() => handleSort("phone")} cursor="pointer">
            Mobile No
            {sort === "phone" ? (
              sortDirection === "asc" ? (
                <ArrowUpIcon boxSize={4} />
              ) : (
                <ArrowDownIcon boxSize={4} />
              )
            ) : (
              <UpDownIcon boxSize={3} ml="1" />
            )}
          </Box>
          <Box flex="1">Designation</Box>
          <Box flex="1">Gender</Box>
          <Box flex="1" display="flex" flexWrap="wrap" gap={2}>
            Courses
          </Box>
          <Box flex="1">Create Date</Box>
          <Box flex="0.5" textAlign="center">
            Action
          </Box>
        </Flex>

        {employees.map((employee, index) => (
          <Flex
            key={employee._id}
            borderBottom="1px solid gray"
            py={2}
            _hover={{ bg: "gray.50" }}
            alignItems="center"
          >
            <Box flex="0.1" textAlign="center">
              {(page - 1) * limit + index + 1}
            </Box>
            <Box flex="0.5" paddingLeft={4}>
              <Image
                h="60px"
                width="50px"
                borderRadius="10px"
                src={employee.profilePhoto}
                alt={employee.fullName}
                objectFit="cover"
              />
            </Box>
            <Box flex="1">{employee.fullName}</Box>
            <Box flex="1">{employee.email}</Box>
            <Box flex="1">{employee.phone}</Box>
            <Box flex="1">{employee.designation}</Box>
            <Box flex="1">{employee.gender}</Box>
            <Box flex="1" display="flex" flexWrap="wrap" gap={2}>
              {employee.course.map((course, index) => (
                <Text key={index} as="span">
                  <Tag colorScheme="teal" borderRadius="md" size="md" px={2}>
                    {course}
                  </Tag>
                </Text>
              ))}
            </Box>
            <Box flex="1">
              {new Date(employee.createdAt).toLocaleDateString("en-IN")}
            </Box>
            <Box flex="0.5" textAlign="center">
              <Link to={`/update-employee/${employee._id}`}>
                <Tooltip label="Edit" aria-label="Edit Employee">
                  <IconButton
                    size="sm"
                    colorScheme="blue"
                    icon={<EditIcon />}
                    aria-label="Edit"
                    mr={2}
                  />
                </Tooltip>
              </Link>
              <Tooltip label="Delete" aria-label="Delete Employee">
                <IconButton
                  size="sm"
                  colorScheme="red"
                  icon={<DeleteIcon />}
                  aria-label="Delete"
                  onClick={() => {
                    setSelectedEmployee(employee._id);
                    onOpen();
                  }}
                />
              </Tooltip>
            </Box>
          </Flex>
        ))}
      </Box>

      {/* Pagination */}
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Flex gap={4} align='center'>
        <Button onClick={() => setPage(1)} isDisabled={page === 1}>
          First
        </Button>
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={page === 1}
        >
          <ChevronLeftIcon />
        </Button>

        <Text>
          Page {page} of {totalPages}
        </Text>

        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          isDisabled={page === totalPages}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          onClick={() => setPage(totalPages)}
          isDisabled={page === totalPages}
        >
          Last
        </Button>
        </Flex>

        <Select width="120px" value={limit} onChange={handleLimitChange}>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </Select>
      </Flex>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>Are you sure you want to delete this employee?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => handleDelete(selectedEmployee)}
              ml={3}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default EmployeeList;
