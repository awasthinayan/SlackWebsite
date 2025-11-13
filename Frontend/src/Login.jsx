import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/V1/signin",
        formData
      );
      const token = res.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        setMessage("Login successful! 🎉");
        setTimeout(() => navigate("/idea"), 1000);
      } else {
        setMessage("No token received");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  const handleOnclick = () => {
    setTimeout(() => navigate("/forgetPassword"), 1000);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#4f46e5,#9333ea,#ec4899)] bg-[length:200%_200%] animate-gradientMove">
      {/* Floating gradient orbs for animation */}
      <div className="absolute inset-0 overflow-hidden">
        <Motion.div
          initial={{ x: -200, y: -100, opacity: 0 }}
          animate={{ x: [0, 100, 0], y: [0, 50, 0], opacity: 0.4 }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-72 h-72 bg-pink-500/40 rounded-full blur-3xl top-20 left-20"
        />
        <Motion.div
          initial={{ x: 200, y: 100, opacity: 0 }}
          animate={{ x: [-100, 0, -100], y: [50, -20, 50], opacity: 0.4 }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-72 h-72 bg-indigo-500/40 rounded-full blur-3xl bottom-20 right-20"
        />
      </div>

      {/* Login Card */}
      <Motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl w-full max-w-md text-white"
      >
        <Motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-400"
        >
          Login Here 👋
        </Motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {["email", "password"].map((field, index) => (
            <Motion.div
              key={field}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <label
                htmlFor={field}
                className="block text-sm mb-2 text-gray-300 capitalize"
              >
                {field}
              </label>
              <input
                type={field === "password" ? "password" : "email"}
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                required
                placeholder={`Enter your ${field}`}
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-pink-400 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all duration-300"
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
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 py-2 rounded-lg font-semibold text-lg shadow-md hover:shadow-pink-500/30 transition-all duration-300 hover:cursor-pointer"
          >
            Login
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
          <button
            type="button"
            onClick={handleOnclick}
            className="text-indigo-400 hover:text-pink-400 transition duration-300 hover:underline hover:cursor-pointer"
          >
            Forgot Password?
          </button>
          <p className="mt-3">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-pink-400 hover:text-pink-300 transition duration-300"
            >
              Register here
            </a>
          </p>
        </Motion.div>
      </Motion.div>
    </div>
  );
};

export default Login;
