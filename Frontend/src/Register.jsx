import { useState } from "react";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const Register = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/V1/signup",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage(res.data.message || "User registered successfully!");

      setFormData({
        username: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        gender: "",
        dob: "",
      });
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  const handleOnClick = () => {
    navigate('/login');
  }

  return (
  <div className="flex min-h-screen w-full">
    {/* Left Side Image */}
    <div className="w-1/2 hidden md:block">
      <img
        src="../src/assets/register.jpg" // 🔹 put your image path here
        alt="Register Illustration"
        className="object-cover w-full h-full"
      />
    </div>

    {/* Right Side Form */}
    <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 p-4">
      <Motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-white">
          {[
            "username",
            "name",
            "email",
            "password",
            "phone",
            "address",
            "gender",
            "dob",
          ].map((field, index) => (
            <Motion.div
              key={field}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <label
                htmlFor={field}
                className="block mb-1 ml-1 text-sm font-medium text-gray-300 capitalize"
              >
                {field}
              </label>
              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "dob"
                    ? "date"
                    : "text"
                }
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 
                focus:border-pink-400 focus:ring-2 focus:ring-pink-500 focus:outline-none 
                transition-all duration-300 placeholder-gray-400"
              />
            </Motion.div>
          ))}

          <Motion.button
            type="submit"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 12px rgba(255,105,180,0.7)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 py-2 rounded-lg 
            font-semibold text-lg shadow-md hover:shadow-pink-500/30 transition-all duration-300 hover:cursor-pointer" 
          >
            Register
          </Motion.button>

          {message && (
            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm mt-4 text-gray-200"
            >
              {message}
            </Motion.p>
          )}
        </form>

        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-sm text-gray-400"
        >
          Already have an account?{" "}
          <a
            href="/login"
            onClick={handleOnClick}
            className="text-pink-400 hover:text-pink-300 transition duration-300 hover:cursor-pointer"
          >
            Login here
          </a>
        </Motion.div>
      </Motion.div>
    </div>
  </div>
);

};

export default Register;
