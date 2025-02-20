import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="fixed z-50 px-4 py-2 text-white transform -translate-x-1/2 bg-red-500 rounded shadow-lg top-4 left-1/2">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          className="px-2 py-1 ml-4 text-white bg-red-700 rounded hover:bg-red-800"
          onClick={onDismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [role, setRole] = useState("student"); // Default to student
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message state

  const navigate = useNavigate(); // Initialize navigate

  const API_BASE_URL = process.env.REACT_APP_API_URL; // Access the API base URL
  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/department`);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    setError(""); // Reset error before trying to register
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        firstName,
        lastName,
        email,
        password,
        role: "student", // Assuming this is a student registration
        departmentId,
      });
      // On successful registration, redirect to login page
      navigate("/login"); // Use navigate instead of history.push
    } catch (error) {
      setError("Registration failed. Please try again."); // Show error message
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-teal-500">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-96 lg:w-[600px] mt-5 mb-5">
        <div className="text-center">
          <Link
            to="/"
            className="flex items-center text-2xl font-semibold text-white"
          >
            <img src="/images/logo.png" alt="Logo" className="w-10 mr-2" />
          </Link>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">
            Create Account
          </h2>
        </div>
        {error && (
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        )}{" "}
        {/* Display error banner */}
        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="departmentId"
              className="block text-sm font-medium text-gray-700"
            >
              Department
            </label>
            <select
              id="departmentId"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-yellow-400 rounded-md hover:bg-yellow-500"
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
